import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponce.js"
import {asynchandler} from "../utils/asynchandler.js"

const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
     const existingSubscription = await Subscription.findOne({
            subscriber:req.user._id,
            channel: channelId
     })
    let toggle;
    if(existingSubscription)
    {
        await Subscription.deleteOne({
            _id:existingSubscription.id
        })
        toggle = "unsubscribed_successfully";
    }
    else
    {
        await Subscription.create({
            subscriber:req.user._id,
            channel:channelId
        })
        toggle = "subscribed_successfully";
    }

    return res.status(200).json(
        new apiresponse(200,toggle,"okk")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const user_id = req.user?._id;

  const noOfSubscribers =   await  Subscription.find({channel:user_id})
    res.status(200).json(
        new apiresponse(200,noOfSubscribers,"successfully")
    )
})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const user_id = req.user?._id;
    // const meSubscripedToHowMany = await  Subscription.find({subscriber:user_id})

    const meSubscripedToHowMany = await Subscription.aggregate([
        {
        $match: { subscriber: user_id }
        },
        {
            $lookup:{
                from: 'users',
                localField:'channel',
                foreignField: '_id',
                as:"channel_detail",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            fullname:1,
                            avatar:1
                        }
                    }
                  
                ]
            }
        },
        
])
    res.status(200).json(
        new apiresponse(200,meSubscripedToHowMany,"successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
    
}