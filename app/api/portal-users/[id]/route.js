import { NextResponse } from "next/server";
import { isOwnerAdmin, requireApiUser, sanitizeUser } from "@/lib/auth";
import User from "@/models/User";

function normalizeAssignedClients(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

export async function PATCH(request, context) {
  try {
    const auth = await requireApiUser(request);
    if (auth.error) return auth.error;
    if (!isOwnerAdmin(auth.user)) {
      return NextResponse.json({ error: "Only Super Admin can update portal users." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const update = {};
    ["name", "phone", "role", "status"].forEach((key) => {
      if (body[key] !== undefined) update[key] = body[key];
    });
    if (body.role === "Super Admin") update.role = "Owner/Admin";
    if (body.assignedClients !== undefined) update.assignedClients = normalizeAssignedClients(body.assignedClients);

    const user = await User.findOneAndUpdate(
      { _id: id, agencyName: auth.user.agencyName },
      update,
      { new: true }
    ).select("-password");

    if (!user) return NextResponse.json({ error: "Portal user not found." }, { status: 404 });
    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Portal user could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const auth = await requireApiUser(request);
    if (auth.error) return auth.error;
    if (!isOwnerAdmin(auth.user)) {
      return NextResponse.json({ error: "Only Super Admin can remove portal users." }, { status: 403 });
    }
    const { id } = await context.params;
    if (id === auth.user._id.toString()) {
      return NextResponse.json({ error: "You cannot remove your own Super Admin account." }, { status: 400 });
    }

    const deleted = await User.findOneAndDelete({ _id: id, agencyName: auth.user.agencyName });
    if (!deleted) return NextResponse.json({ error: "Portal user not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Portal user could not be removed." }, { status: 500 });
  }
}
