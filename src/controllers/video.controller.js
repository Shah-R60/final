import { asynchandler } from "../utils/asynchandler.js"
import { apierror } from "../utils/apierror.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { apiresponse } from "../utils/apiresponce.js"
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId} from "mongoose"



//get all videos***************
const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    //build search filter
    const store = {}
    if(query){
        store.title = { $regex: query, $options: 'i' }
    }
    if(userId){
        store.userId = userId;
    }

    try{
        const videos = await Video.find(store)
        .sort({[sortBy]:sortType==='asc'?1:-1})
        .skip((pageNumber-1)*limitNumber)
        .limit(limitNumber);

        const totalvideos = await Video.countDocuments(store);
        
        return res.status(200).json(
            new apiresponse(200,videos,"get all videos")
          );
    }
    catch(err)
    {
        throw new apierror(500,"something went wrong while generating refresh and access token");
    }

  

})

//publish video**********************
const publishAVideo = asynchandler(async(req,res)=>{
        //fetch title and description from req.body
        const {title,description}= req.body
        if([title,description].some((field)=>field?.trim()==="")){
            throw new apierror(400,"All field are required");
        }   
    
    const videoLocalFile =  req.files?.videoFile[0]?.path
    const thumbnailLocalFile = req.files?.thumbnail[0]?.path
   
    if(!videoLocalFile){
        throw new apierror(400," videoFile is required");
    }
    if(!thumbnailLocalFile){
        throw new apierror(400,"thumbnail is required");
    }
   const videoFile = await uploadoncloudinary(videoLocalFile)
   const thumbnail = await uploadoncloudinary(thumbnailLocalFile)
                           
   if(!videoFile){
    throw new apierror(400,"videoFile is required");
   }
   if(!thumbnail){
    throw new apierror(400,"thumbnail is required");
    }

   const videog =   await Video.create({
           title,
           description,
           videoFile:videoFile.url,
           thumbnail:thumbnail.url,
           duration:videoFile.duration,
           owner:req.user._id
    })

    const createdvideo = await Video.findById(videog._id);
    if(!createdvideo)
    {
        throw new apierror(200,"video is not created");
    }

   return res.status(201).json(
    new apiresponse(200,createdvideo,"video is uploaded")
   )
})

//get video by id 
const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId?.trim())
    {
        throw new apierror(400,"video id is missing");
    }
    
    const video = await Video.findById(videoId)
    if(!video){
        throw new apierror(404,"video is not found")
    }

    return res.status(200)
    .json(
        new apiresponse(200,video,"video is found by id ")
    )
})


//get video by title
const getVideoByTitle = asynchandler(async (req, res) => {
    const { title } = req.params;
    //TODO: get video by title
    if(!title?.trim())
    {
        throw new apierror(400,"title is missing");
    }
    const video = await Video.aggregate([
        {
            $match:{
                title:{$regex:new RegExp(`^${title?.trim()}`,'i')}
            }
        },
        {
            $project:
            {
                videoFile:1,
                title:1,
                thumbnail:1,
                duration:1,
                owner:1,
                views:1,
                description:1
            }
        }
])
     
  return res.status(200)
    .json(
        new apiresponse(200,video,"video is found by title")
        )
})

//update thumbnail;
const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath)
    {
        throw new apierror(400,"thumbnail file is missing");
    }
    //TODO: update video details like title, description, thumbnail
    const thumbnail = await uploadoncloudinary(thumbnailLocalPath);

    if(!thumbnail.url)
    {
        throw new apierror(400,"Error while uploading on avatar");
    }
     if(!videoId?.trim())
     {
        throw new apierror(400,"give video id");
     }
    const video =  await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail:thumbnail.url
            }
        },
        {new:true}
     ).select("-password");

     return res.status(200)
     .json(new apiresponse(200,video,"thumbnail is updated successfully"));
})

//deleteVideo video
const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId?.trim())
    {
        throw new apierror(400,"enter valid videoId");
    }
    const video = await Video.findById(videoId);
    if(!video)
    {
        throw new apierror(400,"video is not found");
    }
   await Video.deleteOne({_id:videoId});
   return res.status(200).json(
    new apiresponse(200,"video has been deleted")
   )

    //TODO: delete video
    
})


//toggle publish status
const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId?.trim())
    {
        throw new apierror(400,"enter valid video id");
    }
    const video =  await Video.findById(videoId);
    if(!video){
        throw new apierror(400,"video is not found");
    }
    const store  = await video.ispublished;
    const toggle = await video.updateOne(
        {
            $set:{
                ispublished:!store
            }
        }
    )
    console.log(await video.ispublished)

    return res.status(200)
    .json(new apiresponse(200,toggle,"video status is updated"))
})
//TODO: toggle publish status

export {getAllVideos,
       publishAVideo,
       getVideoById,
       getVideoByTitle,
       updateVideo,
       deleteVideo,
       togglePublishStatus
};

