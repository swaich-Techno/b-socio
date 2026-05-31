import { NextResponse } from "next/server";
import { accessibleClientIds } from "@/lib/access";
import { isOwnerAdmin, requireApiUser } from "@/lib/auth";
import { publicChatSender, publicTeamMember } from "@/lib/teamPrivacy";
import ChatChannel from "@/models/ChatChannel";
import ChatMessage from "@/models/ChatMessage";
import Client from "@/models/Client";
import User from "@/models/User";

function slugify(value) {
  return String(value || "team").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "team";
}

async function ensureDefaultChannel(user) {
  const existing = await ChatChannel.findOne({ agencyName: user.agencyName, slug: "team" });
  if (existing) return existing;
  return ChatChannel.create({
    agencyName: user.agencyName,
    name: "Agency Team",
    slug: "team",
    topic: "Main internal team channel",
    createdBy: user._id,
    isDefault: true
  });
}

function isClientUser(user) {
  return user.role === "Client";
}

async function ensureClientChannels(user, clientIds) {
  if (!clientIds.length) return;
  const clients = await Client.find({ _id: { $in: clientIds } }).select("businessName").lean();
  await Promise.all(clients.map((client) => {
    const slug = `client-${client._id.toString()}`;
    return ChatChannel.findOneAndUpdate(
      { agencyName: user.agencyName, slug },
      {
        agencyName: user.agencyName,
        name: client.businessName,
        slug,
        topic: "External client discussion",
        clientId: client._id,
        createdBy: user._id
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }));
}

async function getAllowedChannels(user) {
  const clientIds = await accessibleClientIds(user);
  if (!isClientUser(user)) await ensureDefaultChannel(user);
  await ensureClientChannels(user, clientIds);

  if (isOwnerAdmin(user)) {
    const channels = await ChatChannel.find({ agencyName: user.agencyName }).populate("clientId", "businessName").sort({ isDefault: -1, name: 1 }).lean();
    return { channels, clientIds };
  }

  const query = isClientUser(user)
    ? { agencyName: user.agencyName, clientId: { $in: clientIds } }
    : { agencyName: user.agencyName, $or: [{ slug: "team" }, { clientId: { $in: clientIds } }] };
  const channels = await ChatChannel.find(query).populate("clientId", "businessName").sort({ isDefault: -1, name: 1 }).lean();
  return { channels, clientIds };
}

function canUseRoom(channels, room) {
  return channels.some((channel) => channel.slug === room);
}

export async function GET(request) {
  const auth = await requireApiUser(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const requestedRoom = searchParams.get("room") || "";
  const limit = Math.min(Number(searchParams.get("limit") || 80), 120);
  const { channels, clientIds } = await getAllowedChannels(auth.user);
  const room = requestedRoom || (isClientUser(auth.user) ? channels[0]?.slug : "team");

  if (!room) {
    return NextResponse.json({ channels: [], messages: [], members: [], currentUser: { _id: auth.user._id.toString(), chatStatus: auth.user.chatStatus || "Available" }, activeRoom: "" });
  }

  if (!canUseRoom(channels, room)) {
    return NextResponse.json({ error: "You do not have access to this discussion." }, { status: 403 });
  }

  await ChatMessage.updateMany(
    { agencyName: auth.user.agencyName, room },
    { $addToSet: { readBy: auth.user._id } }
  );

  const memberQuery = isClientUser(auth.user)
    ? { agencyName: auth.user.agencyName, status: "approved", role: { $ne: "Client" } }
    : { agencyName: auth.user.agencyName, status: "approved", role: { $ne: "Client" } };

  const [messages, members] = await Promise.all([
    ChatMessage.find({ agencyName: auth.user.agencyName, room })
      .populate("senderId", "name role chatStatus status")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    User.find(memberQuery)
      .select("name role status skills assignedClients chatStatus")
      .sort({ name: 1 })
      .lean()
  ]);

  return NextResponse.json({
    channels,
    activeRoom: room,
    messages: messages.reverse().map((item) => ({
      _id: item._id.toString(),
      message: item.message,
      room: item.room,
      sender: publicChatSender(item.senderId),
      isMine: item.senderId?._id?.toString?.() === auth.user._id.toString(),
      attachments: item.attachments || [],
      pinned: Boolean(item.pinned),
      readCount: item.readBy?.length || 0,
      createdAt: item.createdAt
    })),
    members: members
      .filter((member) => {
        if (!isClientUser(auth.user)) return true;
        return (member.assignedClients || []).some((id) => clientIds.map(String).includes(id.toString()));
      })
      .map((member) => ({
      _id: member._id.toString(),
      name: member.name || "Team member",
      role: member.role || "Team",
      status: member.status || "approved",
      skills: member.skills || [],
      assignedClients: member.assignedClients || [],
      chatStatus: member.chatStatus || "Available"
    })),
    currentUser: {
      _id: auth.user._id.toString(),
      role: auth.user.role,
      chatStatus: auth.user.chatStatus || "Available"
    }
  });
}

export async function POST(request) {
  try {
    const auth = await requireApiUser(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const { channels, clientIds } = await getAllowedChannels(auth.user);
    if (body.type === "channel") {
      if (isClientUser(auth.user)) {
        return NextResponse.json({ error: "Clients cannot create internal channels." }, { status: 403 });
      }
      if (body.clientId && !isOwnerAdmin(auth.user) && !clientIds.map(String).includes(String(body.clientId))) {
        return NextResponse.json({ error: "You can only create channels for assigned clients." }, { status: 403 });
      }
      const name = String(body.name || "").trim();
      if (!name) return NextResponse.json({ error: "Channel name is required." }, { status: 400 });
      const slug = slugify(name);
      const existing = await ChatChannel.findOne({ agencyName: auth.user.agencyName, slug });
      if (existing) return NextResponse.json({ channel: existing });
      const channel = await ChatChannel.create({
        agencyName: auth.user.agencyName,
        name,
        slug,
        topic: body.topic || "",
        clientId: body.clientId || undefined,
        createdBy: auth.user._id
      });
      return NextResponse.json({ channel }, { status: 201 });
    }

    const message = String(body.message || "").trim();
    const room = body.room || "team";
    const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 4) : [];

    if (!canUseRoom(channels, room)) {
      return NextResponse.json({ error: "You do not have access to this discussion." }, { status: 403 });
    }

    if (!message && !attachments.length) {
      return NextResponse.json({ error: "Message or attachment is required." }, { status: 400 });
    }

    if (message.length > 1200) {
      return NextResponse.json({ error: "Message is too long. Keep it under 1200 characters." }, { status: 400 });
    }

    const saved = await ChatMessage.create({
      agencyName: auth.user.agencyName,
      senderId: auth.user._id,
      room,
      message: message || "Shared an attachment.",
      attachments,
      pinned: Boolean(body.pinned),
      readBy: [auth.user._id]
    });

    const populated = await ChatMessage.findById(saved._id).populate("senderId", "name role chatStatus status").lean();

    return NextResponse.json({
      message: {
        _id: populated._id.toString(),
        message: populated.message,
        room: populated.room,
        sender: publicChatSender(populated.senderId),
        isMine: true,
        attachments: populated.attachments || [],
        pinned: Boolean(populated.pinned),
        readCount: populated.readBy?.length || 1,
        createdAt: populated.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Message could not be sent." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await requireApiUser(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const { channels } = await getAllowedChannels(auth.user);
    if (body.messageId && typeof body.pinned === "boolean") {
      const message = await ChatMessage.findOneAndUpdate(
        { _id: body.messageId, agencyName: auth.user.agencyName, room: { $in: channels.map((channel) => channel.slug) } },
        { pinned: body.pinned },
        { new: true }
      );
      if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    const allowedStatuses = ["Available", "Busy", "Away", "Offline"];
    const chatStatus = allowedStatuses.includes(body.chatStatus) ? body.chatStatus : "Available";

    const user = await User.findByIdAndUpdate(auth.user._id, { chatStatus }, { new: true }).select("-password").lean();
    return NextResponse.json({ user: publicTeamMember(user, user) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Availability could not be updated." }, { status: 500 });
  }
}
