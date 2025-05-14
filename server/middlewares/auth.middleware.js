import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
export const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json(ApiResponse(401, null, "You are not logged in"));
        }
        const tokendata = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = tokendata.id;
        const user = await User.findById(userId).select(
            "-password -refreshToken"
        );
        if (!user) {
            return res
                .status(401)
                .json(
                    ApiResponse(401, null, "Invalid token or user not found")
                );
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token");
    }
});
