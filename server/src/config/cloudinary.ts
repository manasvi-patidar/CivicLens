import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
  .resources({
    type: "upload",
    resource_type: "image",
    max_results: 1,
  })
  .then(() => {
    console.log("CLOUDINARY AUTH TEST: SUCCESS");
  })
  .catch((error) => {
    console.error("CLOUDINARY AUTH TEST: FAILED", {
      message: error?.message,
      http_code: error?.http_code,
    });
  });

console.log("Cloudinary runtime config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key_last4: process.env.CLOUDINARY_API_KEY?.slice(-4),
  api_secret_length: process.env.CLOUDINARY_API_SECRET?.length,
});

export default cloudinary;
