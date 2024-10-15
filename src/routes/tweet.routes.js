import { Router } from 'express';
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/aut.middlewares.js"
const router = Router();

router.route("/").post(verifyJWT,createTweet);
router.route("/user/:userId").get(verifyJWT,getUserTweets);
router.route("/c/:tweetId").patch(verifyJWT,updateTweet).delete(verifyJWT,deleteTweet);

export default router;