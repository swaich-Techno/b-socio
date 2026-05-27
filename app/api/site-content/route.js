import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { isOwnerAdmin, requireApiUser } from "@/lib/auth";
import { defaultSiteContent, mergeSiteContent } from "@/lib/siteContent";
import SiteContent from "@/models/SiteContent";

export async function GET() {
  try {
    await connectDB();
    const saved = await SiteContent.findOne({ key: "main" }).lean();
    return NextResponse.json({ content: mergeSiteContent(saved || {}), persisted: Boolean(saved) });
  } catch (error) {
    return NextResponse.json({
      content: mergeSiteContent(defaultSiteContent),
      persisted: false,
      warning: error.message || "Using default website content."
    });
  }
}

export async function PUT(request) {
  try {
    const auth = await requireApiUser(request);
    if (auth.error) return auth.error;
    if (!isOwnerAdmin(auth.user)) {
      return NextResponse.json({ error: "Only Super Admin can update website content." }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const merged = mergeSiteContent(body);
    const saved = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { ...merged, key: "main" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ content: mergeSiteContent(saved) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Website content could not be saved." }, { status: 500 });
  }
}
