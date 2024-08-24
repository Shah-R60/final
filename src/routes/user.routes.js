import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updatedUserAvatar, updatedUsercoverImage, getUserChannelProfile, getwatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/aut.middlewares.js";
const router = Router();
router.route("/register").post(
   upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
   ]),
    registerUser
    )


console.log("1");
router.route("/login").post(loginUser)
//secured routesc
console.log("2");
router.route("/logout").post(verifyJWT, logoutUser)
console.log("3");
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword),
router.route("/current-user").get(verifyJWT,getCurrentUser),
router.route("/update-account").patch(verifyJWT,updateAccountDetails),
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updatedUserAvatar),
router.route("/cover-Image").patch(verifyJWT,upload.single("coverImage"),updatedUsercoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile),
router.route("/history").get(verifyJWT,getwatchHistory)
export default router