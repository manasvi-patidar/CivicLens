import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// TEMPORARY DIAGNOSTIC
(async () => {
  const testImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  try {
    const result = await cloudinary.uploader.upload(testImage, {
      folder: "CivicLens/diagnostic",
      public_id: `render-test-${Date.now()}`,
      resource_type: "image",
    });

    console.log("DIRECT CLOUDINARY UPLOAD: SUCCESS", {
      public_id: result.public_id,
    });

    await cloudinary.uploader.destroy(result.public_id, {
      resource_type: "image",
    });

    console.log("DIAGNOSTIC IMAGE DELETED");
  } catch (error: any) {
    console.error("DIRECT CLOUDINARY UPLOAD: FAILED", {
      message: error?.message,
      http_code: error?.http_code,
      name: error?.name,
    });
  }
})();

export default cloudinary;
