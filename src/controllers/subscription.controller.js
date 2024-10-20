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


const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params

  const noOfSubscribers =   await  Subscription.find({channel:channelId})
    res.status(200).json(
        new apiresponse(200,noOfSubscribers,"successfully")
    )
})

const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params
    const meSubscripedToHowMany = await  Subscription.find({subscriber:subscriberId})
    res.status(200).json(
        new apiresponse(200,meSubscripedToHowMany,"successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
    
}