import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponce.js"
import {asynchandler} from "../utils/asynchandler.js"


const toggleVideoLike = asynchandler(async (req, res) => {
    try{
                    const {videoId} = req.params
                //TODO: toggle like on video
                if(!videoId?.trim())
                {
                    throw new apierror(400,"video id is missing");
                }

                const existingLike = await Like.findOne({Video:videoId,likedBy:req.user?._id})
                    if(!existingLike)
                    {
                    const videoResponse =  await Like.create({
                            Video:videoId,
                            likedBy:req.user?._id, 
                        })

                        res
                        .status(201)
                        .json(
                            new apiresponse(200,videoResponse,"video toggle successfully")
                        )
                    }else
                    {
                        await Like.deleteOne({_id:existingLike._id});
                        res.status(200).json(
                        new apiresponse(200,null,"remove liked")
                    )
                    }
    }
    catch(err)
    {
        
        throw new apierror("eror",err)
    }
})


const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId?.trim())
    {
        throw new apierror(400,"comment id is missing");
    }
   const like =  await Like.find({comment:commentId});

   if(like.length==0)
   {
      await Like.create({
        comment:commentId,
        likedBy:req.user?._id
      })
   }
   else{
    await Like.deleteOne({comment:commentId});
   }

   return res.status(200).json(
    new apiresponse(200,"ok")
   )


})



const toggleTweetLike = asynchandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId?.trim())
    {
        throw new apierror(400,"tweet id is missing");
    }

    const store = await Like.find({tweet:tweetId});
    if(store.length==0)
    {
        await Like.create(
            {
            tweet:tweetId,
            likedBy:req.user?._id
            });
    }
    else{
        await Like.deleteOne({tweet:tweetId});
    }
    
    return res.status(200).json(
        new apiresponse(200,"ok")
    )
}
)

const getLikedVideos = asynchandler(async (req, res) => {
    //TODO: get all liked videos
    const likeVideo = await Like.aggregate([
        {
            $project:{
                _id:0,
                Video:1,
                likedBy:1
            }
        }
    ])

    return res.status(200).json(
        new apiresponse(200,likeVideo,"okk")
    )
})


const getnoOfLike = asynchandler(async (req, res) => {
    const video_id = req.params.video_id;
    console.log(typeof video_id)


    const noOflikes = await Like.find({Video:new mongoose.Types.ObjectId(video_id)}).countDocuments()

    const islikedby = await Like.aggregate([
        {
            $match:{
                Video:new mongoose.Types.ObjectId(video_id),
            }
        },
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(req.user?._id)
            }
        }
    ])
    const response = {
        noOflikes:noOflikes,
        islikedby:islikedby.length>0
    }
    console.log(islikedby.length)
    res.status(201).json(
        new apiresponse(200,response, "Successfully fetched")
    );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
    getnoOfLike
};
