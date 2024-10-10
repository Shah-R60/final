import { asynchandler } from "../utils/asynchandler.js"
import { apierror } from "../utils/apierror.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { apiresponse } from "../utils/apiresponce.js"
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId} from "mongoose"

const getAllVideos = asynchandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
   return  res.status(200).json({
        status: "success come from getall video routes",
    })
})

export {getAllVideos};