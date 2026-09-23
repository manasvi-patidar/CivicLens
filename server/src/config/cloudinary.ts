import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary runtime config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key_last4: process.env.CLOUDINARY_API_KEY?.slice(-4),
  api_secret_length: process.env.CLOUDINARY_API_SECRET?.length,
});

const testSignature = cloudinary.utils.api_sign_request(
  {
    folder: "CivicLens/issues",
    timestamp: Math.floor(Date.now() / 1000),
  },
  process.env.CLOUDINARY_API_SECRET!,
);

console.log("CLOUDINARY SIGNATURE TEST:", testSignature);

export default cloudinary;
