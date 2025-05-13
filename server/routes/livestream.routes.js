import { Router } from "express";
import {
    golive,
    endLiveStream,
    startLiveStream,
    getLiveStream,
    getOnGoingLiveStream,
} from "../controllers/livestream.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/live", verifyJwt, golive);
router.post("/live/end", endLiveStream);
router.post("/live/start", startLiveStream);
router.post("/live/status", getLiveStream);
router.get("/live/get", verifyJwt, getOnGoingLiveStream);

export default router;
