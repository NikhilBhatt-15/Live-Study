import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    register,
    login,
    logout,
    forgotPassword,
} from "../controllers/user.controller.js";
const router = Router();

router.post("/login", login);

router.post("/register", upload.single("avatar"), register);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

export default router;
