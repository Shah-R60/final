import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
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
//secured routes
console.log("2");
router.route("/logout").post(verifyJWT, logoutUser)
console.log("3");
router.route("/refresh-token").post(refreshAccessToken)
export default router