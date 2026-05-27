import { NextResponse } from "next/server";
import { hashPassword, isOwnerAdmin, permissionsForRole, requireApiUser, sanitizeUser } from "@/lib/auth";
import { permissionKeys } from "@/lib/options";
import Client from "@/models/Client";
import User from "@/models/User";

function permissionsForPortalRole(role, body = {}) {
  if (role === "Client") return Object.fromEntries(permissionKeys.map((key) => [key, false]));
  return permissionsForRole(role);
}

function normalizeAssignedClients(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

export async function GET(request) {
  const auth = await requireApiUser(request);
  if (auth.error) return auth.error;
  if (!isOwnerAdmin(auth.user)) {
    return NextResponse.json({ error: "Only Super Admin can manage portal users." }, { status: 403 });
  }

  const [users, clients] = await Promise.all([
    User.find({ agencyName: auth.user.agencyName }).select("-password").populate("assignedClients", "businessName").sort({ role: 1, name: 1 }).lean(),
    Client.find({ agencyName: auth.user.agencyName }).select("businessName").sort({ businessName: 1 }).lean()
  ]);

  return NextResponse.json({
    users: users.map((user) => sanitizeUser(user)),
    clients: clients.map((client) => ({ _id: client._id.toString(), businessName: client.businessName }))
  });
}

export async function POST(request) {
  try {
    const auth = await requireApiUser(request);
    if (auth.error) return auth.error;
    if (!isOwnerAdmin(auth.user)) {
      return NextResponse.json({ error: "Only Super Admin can create portal users." }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const role = body.role === "Super Admin" ? "Owner/Admin" : body.role || "Client";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });

    const user = await User.create({
      name,
      email,
      password: await hashPassword(body.password || "ChangeMe123!"),
      agencyName: auth.user.agencyName,
      role,
      status: body.status || "approved",
      emailVerified: true,
      permissions: permissionsForPortalRole(role, body),
      assignedClients: normalizeAssignedClients(body.assignedClients),
      phone: body.phone || "",
      ownerName: name
    });

    return NextResponse.json({ user: sanitizeUser(user) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Portal user could not be created." }, { status: 500 });
  }
}
