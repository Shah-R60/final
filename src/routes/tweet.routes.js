import { Router } from 'express';
import {upload} from "../middlewares/multer.middleware.js"
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/aut.middlewares.js"
const router = Router();

router.route("/").post(upload.fields([
    {
        name:"tweet_photo",
        maxCount:1
    }
]),verifyJWT,createTweet);
router.route("/user/:userId").get(verifyJWT,getUserTweets);
router.route("/c/:tweetId").patch(verifyJWT,updateTweet).delete(verifyJWT,deleteTweet);

export default router;