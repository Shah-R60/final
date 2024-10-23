import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {User} from "../models/user.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponce.js"
import {asynchandler} from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = new mongoose.Types.ObjectId(req.user._id)
    const totalSubscriper = await User.aggregate([
        {
            $match:{
                _id: userId
            }
        },
        {
            $lookup:{
                from: "Subscription",
                localField:"_id",
                foreignField:"channel",
                as:"subscriber"
            }
        },
        {
            $project:{
                Total_Subscriber:{$size:"$subscriber"},
                _id:0
            }
              
        }
    ])

    const total_videos = await Video.aggregate([
        {
           $match:{
            owner:userId
           }
        },
        {
            $project:{
                _id:0,
                totalView:{$sum:"$view"},
               
            }
        }
    ])
       
    const total_like = await Video.aggregate([
        {
          $match:{
            owner:userId
          }
        },
        {
            $lookup:{
                from: "Like",
                localField: "_id",
                foreignField: "video",
                as:"liked_video"
            }
        },
        {
           $project:{
            _id:0,
            total_like:{$size:"$liked_video"},
           }
        }
    ]
    )

    const output = [totalSubscriper,total_like,total_videos];
    return res.status(200).json(
        new apiresponse(200,output,"successfull")
    )
})

const getChannelVideos = asynchandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = new mongoose.Types.ObjectId(req.user._id)
    const total_videos = await Video.aggregate([
        {
           $match:{
            owner:userId
           }
        },
        {
            $project:{
                _id:0,
                totalVideos:{$sum:1}
            }
        }
    ])

    return res.status(200).json(
        new apiresponse(200,total_videos,"successfull")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }