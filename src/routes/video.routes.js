import {Router} from "express";
import { deleteVideo, getAllVideos,togglePublishStatus,updateVideo,IncreaseView} from "../controllers/video.controller.js";
import { publishAVideo } from "../controllers/video.controller.js";
import { getVideoById } from "../controllers/video.controller.js";
import { getVideoByTitle } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/aut.middlewares.js";

const router = Router()

router.route("/getAllVideos").get(getAllVideos);
router.route("/uploadVideo").post(
    upload.fields([
        { 
        name: "videoFile", 
        maxCount: 1
        },
        {
         name: "thumbnail",
         maxCount: 1
        },
    ]),verifyJWT,
    publishAVideo);
router.route("/c/:videoId").get(getVideoById)
                        .patch(verifyJWT,upload.single("thumbnail"),updateVideo)
                        .delete(verifyJWT,deleteVideo);
router.route("/getbytitle/c/:title").get(verifyJWT,getVideoByTitle);
router.route("/toggle/c/:videoId").patch(verifyJWT,togglePublishStatus);
router.route("/IncView/:videoId").get(IncreaseView);



export default router;