import { Router } from "express";
import {
    golive,
    endLiveStream,
    startLiveStream,
    getLiveStreamStatus,
    getOnGoingLiveStream,
    getallOngoingLiveStream,
    getLiveStreamById,
} from "../controllers/livestream.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/live", verifyJwt, golive);
router.get("/live/get", verifyJwt, getOnGoingLiveStream);
router.get("/live/:id", getLiveStreamById);
router.get("/live", getallOngoingLiveStream);
router.post("/live/end", endLiveStream);
router.post("/live/start", startLiveStream);
router.post("/live/status", getLiveStreamStatus);

export default router;
