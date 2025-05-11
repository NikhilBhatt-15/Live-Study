import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(filePath); // Delete the file after upload
        console.log("File uploaded to Cloudinary:", result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        // fs.unlinkSync(filePath); // Delete the file even if upload fails
        throw new Error("Cloudinary upload failed");
    }
};

export { uploadOnCloudinary };
