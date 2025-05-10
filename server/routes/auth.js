import { Router } from "express";

const router = Router();

router.post("/login");

router.post("/register");
router.post("/logout");
router.post("/forgot-password");

export default router;
