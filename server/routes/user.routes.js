import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    register,
    login,
    logout,
    forgotPassword,
    refreshAccessToken,
    getCurrentUser,
    changeAvatar,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/login", login);
router.post("/register", upload.single("avatar"), register);
router.post("/logout", verifyJwt, logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.get("/me", verifyJwt, getCurrentUser);
router.post("/change-avatar", upload.single("avatar"), verifyJwt, changeAvatar);

export default router;
