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

const deleteFromCloudinary = async (secureUrl) => {
    try {
        const publicId = secureUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from Cloudinary:", secureUrl);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw new Error("Cloudinary delete failed");
    }
};

const uploadVideoToCloudinary = async (filePath) => {
    //    const result = await cloudinary.uploader.upload(filePath, {
    //        resource_type: "video",
    //        chunk_size: 6000000,
    //        eager: [
    //            {
    //                transformation: [
    //                    {
    //                        width: 640,
    //                        height: 360,
    //                        crop: "scale",
    //                        audio_codec: "none",
    //                    },
    //                    {
    //                        width: 160,
};

export { uploadOnCloudinary, deleteFromCloudinary };
