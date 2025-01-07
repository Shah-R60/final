import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponce.js"
import {asynchandler} from "../utils/asynchandler.js"
import { uploadoncloudinary } from "../utils/cloudnary.js"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const user = await User.findById(req.user?._id)
    if (!user) {
        return apierror(res, 401, "User not found")
    }
        
   const {content} = req.body;
   let photo_localpath ;
   if(req.files&&Array.isArray(req.files.tweet_photo)&&req.files.tweet_photo.length>0)
   {
    photo_localpath = req.files.tweet_photo[0].path
   }

   const tweet_photo = await uploadoncloudinary(photo_localpath);

    if(!content)
    {
        throw new apierror(200,"content is missing");
    }

    // const tweet_photo = req.body.tweet_photo;
    const tweet =await Tweet.create({
        owner:user,
        content:content,
        tweet_photo:tweet_photo?.url||""
    })

    return res.status(200)
    .json(
        new apiresponse(200,tweet,"tweet has successfully posted")
    )
})


const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets
    const user_Id = req.params.userId;
    if(!user_Id){
        throw new apierror(400,"User id is nesessary");
    }
   const getTweet = await Tweet.aggregate([{
        $match:{
            // owner: new mongoose.Types.ObjectId(user_Id)
           owner: new mongoose.Types.ObjectId(user_Id)
        }
    },
        {
            $project:{
                owner:1,
                content:1,
                tweet_photo:1
            }
        }])
    if(!getTweet){
        throw new apierror(400,"tweet is not found");
    }

    res.status(200).json(
        new apiresponse(200,getTweet,"get tweet successfully")
    )
})


const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    const {content} = req.body;
    if(!content)
    {
        throw new apierror(400,"new content is necessary");
    }
    if(!tweetId){
        throw new apierror(400,"Tweet id is necessary");
    } 
     
    const tweet = await Tweet.findById(tweetId);
    if(!tweet)
    {
        throw new apierror(400,"tweet is not found in database");
    }
  const updateTweet = await Tweet.findByIdAndUpdate(
     tweetId,
    {
      $set:{
       content:content
      }
    },
    {new:true}
  );
  

       if(!updateTweet){
        throw new apierror(400,"Tweet is not Updated");
       }

       res.status(200).json(
        new apiresponse(200,updateTweet,"Tweet is updated")
       )

})



const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    if(!tweetId){
        throw new apierror(400,"tweet id is necessary");
    }
    //find tweet by there id
    const tweet = await Tweet.findById(tweetId);
    //check if tweet is present or not
    if(!tweet)
    {
        throw new apierror(400,"tweet is not found");
    }
    //deleting tweet
    const tweet_delete = await Tweet.deleteOne({_id:tweetId});
    if(!tweet_delete)
    {
        throw new apierror(400,"tweet is not deleted");
    }
    
    res.status(200).
    json(
        new apiresponse(200,"tweet is deleted")
    )
        
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}