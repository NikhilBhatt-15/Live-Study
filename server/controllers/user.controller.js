import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Channel } from "../models/channel.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // Save refresh token in database
        const updateduser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken,
                },
            },
            { new: true }
        );
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if ([name, email, password].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "Please fill all the fields");
    }
    const existeduser = await User.findOne({ email: email.toLowerCase() });
    if (existeduser) {
        throw new ApiError(409, "User already exists");
    }
    const localpath = req.file?.path;
    if (!localpath) {
        throw new ApiError(400, "Please upload an avatar");
    }
    const secure_url = await uploadOnCloudinary(localpath, "avatar");
    if (!secure_url) {
        throw new ApiError(500, "Cloudinary upload failed");
    }
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        avatarUrl: secure_url,
    });
    const userData = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!userData) {
        throw new ApiError(500, "User not registered");
    }
    const channel = await Channel.create({
        owner: user._id,
        name: user.name,
        description: "Welcome to my channel",
        avatarUrl: user.avatarUrl,
    });
    return res
        .status(201)
        .json(new ApiResponse(201, userData, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "Please fill all the fields");
    }
    const existeduser = await User.findOne({ email: email.toLowerCase() });
    if (!existeduser) {
        throw new ApiError(401, "Invalid credentials");
    }
    const isPasswordMatched = await existeduser.isPasswordCorrect(password);
    if (!isPasswordMatched) {
        throw new ApiError(401, "Wrong password");
    }
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(existeduser);
    const userData = await User.findById(existeduser._id).select(
        "-password -__v -refreshToken"
    );
    if (!userData) {
        throw new ApiError(500, "User not registered");
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json(
            new ApiResponse(
                200,
                {
                    user: userData,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

const logout = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        { new: true }
    );
    if (!user) {
        throw new ApiError(500, "User not found");
    }
    return res
        .status(200)
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken =
        req.cookies?.refreshToken || req.header("Authorization")?.split(" ")[1];
    if (!refreshToken) {
        throw new ApiError(401, "Please login first");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
        throw new ApiError(401, "Invalid refresh token");
    }
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }
    const tokens = await generateAccessAndRefreshToken(user);
    return res
        .status(200)
        .cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json(
            new ApiResponse(200, tokens, "Access token refreshed successfully")
        );
});

const forgotPassword = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if ([oldPassword, newPassword].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "Please fill all the fields");
    }
    const existeduser = await User.findById(req.user._id);
    if (!existeduser) {
        throw new ApiError(401, "Invalid credentials");
    }
    const isPasswordMatched = await existeduser.isPasswordCorrect(oldPassword);
    if (!isPasswordMatched) {
        throw new ApiError(401, "Wrong password");
    }
    const updateduser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                password: newPassword,
            },
        },
        { new: true }
    );
    if (!updateduser) {
        throw new ApiError(500, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
    const localpath = req.file?.path;
    if (!localpath) {
        throw new ApiError(400, "Please upload an avatar");
    }
    const secure_url = await uploadOnCloudinary(localpath, "avatar");
    if (!secure_url) {
        throw new ApiError(500, "Cloudinary upload failed");
    }
    const updateduser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatarUrl: secure_url,
            },
        },
        { new: true }
    );
    if (!updateduser) {
        throw new ApiError(500, "User not found");
    }
    // Delete old avatar from cloudinary
    const oldAvatarUrl = req.user.avatarUrl;
    if (oldAvatarUrl) {
        await deleteFromCloudinary(oldAvatarUrl);
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updateduser, "Avatar updated successfully"));
});

export {
    register,
    login,
    logout,
    forgotPassword,
    refreshAccessToken,
    resetPassword,
    getCurrentUser,
    changeAvatar,
};
