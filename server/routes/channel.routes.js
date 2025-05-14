import e, { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
import {
    getChannelVideos,
    subscribeToChannel,
    unsubscribeFromChannel,
    getOwnChannelProfile,
    getChannelinfo,
    isSubscribed,
} from "../controllers/channel.controller.js";

router.post("/subscribe/:id", verifyJwt, subscribeToChannel);
router.post("/unsubscribe/:id", verifyJwt, unsubscribeFromChannel);
router.get("/videos/:id", getChannelVideos);
router.get("/info/:id", getChannelinfo);
router.get("/profile", verifyJwt, getOwnChannelProfile);
router.get("/isSubscribed/:id", verifyJwt, isSubscribed);

export default router;
