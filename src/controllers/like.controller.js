import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponce.js"
import {asynchandler} from "../utils/asynchandler.js"
import { comment } from "../models/comment.model.js"


const toggleVideoLike = asynchandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId?.trim())
    {
        throw new apierror(400,"video id is missing");
    }

       const store = await Like.find({Video:videoId})
       console.log(store.length);
        if(store.length==0)
        {
           await Like.create({
                Video:videoId
            })
        }else{
           await Like.deleteOne({Video:videoId});
        }
        res.status(200).json(
            new apiresponse(200,"ok")
        )
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
        comment:commentId
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
            tweet:tweetId
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
                Video:1
            }
        }
    ])

    return res.status(200).json(
        new apiresponse(200,likeVideo,"okk")
    )

})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
};
