import {Router} from "express"
import {verifyJWT} from "../middlewares/aut.middlewares.js"
import {
   toggleSubscription,
   getUserChannelSubscribers,
   getSubscribedChannels
} from "../controllers/subscription.controller.js"
const router = Router();

router.route("/:channelId").post(verifyJWT,toggleSubscription).get(verifyJWT,getUserChannelSubscribers);
router.route("/s/:subscriberId").get(verifyJWT,getSubscribedChannels);

export default router;