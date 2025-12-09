import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { uploadProtection } from "@/lib/arcjet";

cloudinary.config({
  cloud_name: "cjblackdev",
  api_key: "718533139269126",
  api_secret: "ODfyiokQEGiR_BiB5W-Nbei_zus",
  // Ideally these should be env vars, but using what was in the previous files for now
  // Securely they should be process.env.CLOUDINARY_...
});

export async function POST(req: NextRequest) {
  // Apply Arcjet protection (rate limiting + bot detection)
  try {
    // Cast to Request for Arcjet compatibility
    const decision = await uploadProtection.protect(req as unknown as Request, {
      requested: 1, // Consume 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { message: "Too many upload requests. Please try again later." },
          { status: 429 }
        );
      }
      if (decision.reason.isBot()) {
        return NextResponse.json(
          { message: "Bot detected. Access denied." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { message: "Request blocked." },
        { status: 403 }
      );
    }
  } catch (arcjetError) {
    // If Arcjet fails, log but don't block the request
    console.warn("Arcjet protection error:", arcjetError);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") ?? formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        )
        .end(buffer);
    });

    return NextResponse.json(
      { url: (uploadResult as { secure_url: string }).secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        message: "Upload failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
