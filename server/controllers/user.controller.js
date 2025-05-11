import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const register = asyncHandler(async (req, res) => {
    console.log("Registering user...");
    const { name, email, password } = req.body;
    if ([name, email, password].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "Please fill all the fields");
    }
    const existeduser = await User.findOne({ email: email.toLowerCase() });
    console.log("existeduser", existeduser);
    if (existeduser) {
        throw new ApiError(409, "User already exists");
    }
    console.log("existeduser", existeduser);
    const localpath = req.file?.path;
    if (!localpath) {
        throw new ApiError(400, "Please upload an avatar");
    }
    console.log("localpath", localpath);
    const secure_url = await uploadOnCloudinary(localpath, "avatar");
    if (!secure_url) {
        throw new ApiError(500, "Cloudinary upload failed");
    }
    console.log("secure_url", secure_url);
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        avatar: secure_url,
    });
    const userData = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!userData) {
        throw new ApiError(500, "User not registered");
    }

    return res.status(201).json(
        new ApiResponse({
            statusCode: 201,
            message: "User registered successfully",
            data: userData,
        })
    );
});

const login = asyncHandler(async (req, res) => {});

const logout = asyncHandler(async (req, res) => {});

const forgotPassword = asyncHandler(async (req, res) => {});
export { register, login, logout, forgotPassword };
