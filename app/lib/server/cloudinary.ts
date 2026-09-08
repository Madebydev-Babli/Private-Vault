import "server-only";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

let configured = false;

function getCloudinary() {
  if (!configured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary environment variables are required.");
    }
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export type CloudinaryMedia = {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  format?: string;
};

export async function uploadMemoryMedia(file: File): Promise<CloudinaryMedia> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    getCloudinary()
      .uploader.upload_stream(
        { folder: "memento/memories", resource_type: resourceType },
        (error, response) =>
          error || !response
            ? reject(error ?? new Error("Cloudinary upload failed."))
            : resolve(response),
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType,
    ...(result.format ? { format: result.format } : {}),
  };
}

export async function deleteCloudinaryMedia(
  media: Pick<CloudinaryMedia, "publicId" | "resourceType">,
) {
  return getCloudinary().uploader.destroy(media.publicId, {
    resource_type: media.resourceType,
  });
}
