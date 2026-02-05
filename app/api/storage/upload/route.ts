import { NextRequest, NextResponse } from "next/server";
import { verifyOwner } from "@/lib/supabase/auth";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

const BUCKET = "site-assets";

export async function POST(request: NextRequest) {
  try {
    const { isOwner, error: authError } = await verifyOwner();
    if (!isOwner) {
      return NextResponse.json({ error: authError || "Unauthorized" }, { status: 403 });
    }

    const form = await request.formData();
    const file = form.get("file") as unknown as File | null;
    const folder = (form.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = createAdminClient();

    // Ensure bucket exists and is public
    const { data: bucketInfo } = await supabase.storage.getBucket(BUCKET);
    if (!bucketInfo) {
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: "10MB",
      });
      if (createBucketError) {
        console.error("Create bucket error:", createBucketError);
        return NextResponse.json({ error: "Failed to initialize storage bucket" }, { status: 500 });
      }
    }

    const safeName = (file.name || "image").replace(/[^a-zA-Z0-9_.-]/g, "_");
    const key = `${folder}/${randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(key, buffer, { contentType: file.type || "application/octet-stream", upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed", details: uploadError.message }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(key);
    const url = pub?.publicUrl;

    if (!url) {
      return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url, path: key }, { status: 200 });
  } catch (e) {
    console.error("Storage upload exception:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
