import Router from "express";
import {verifyJWT} from "../middlewares/aut.middlewares.js"
import {toggleCommentLike, toggleTweetLike, toggleVideoLike,getLikedVideos} from "../controllers/like.controller.js"
const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(verifyJWT,toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike)
router.route("/").get(getLikedVideos);

export default router