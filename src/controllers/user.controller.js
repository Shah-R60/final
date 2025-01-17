import { asynchandler } from "../utils/asynchandler.js"
import { apierror } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { apiresponse } from "../utils/apiresponce.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import mongodb from "mongodb";


// ******************************** generate AccessToken and refreshToken*************************
const generateAccessTokenandrefreshToken= async(userId)=>
{
     try{
      const user = await User.findById(userId)
       
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        console.log("accesstoken and refreshtoken is generated");

        user.refreshToken=refreshToken
        user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
     }
     catch(error)
     {
      throw new apierror(500,"something went wrong while generating refresh and access token")
     }
}


// ******************************register*********************************
const registerUser = asynchandler(async (req, res) => {

// get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
  const { fullname, email, username, password } = req.body
 
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apierror(400, "All field are required")
  }


  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })
    
    if(existedUser)
    {
      throw new apierror(409,"username or email is already exist");
    }
   
    const avatarLocalpath = req.files?.avatar[0]?.path;
    // const coverImageLocalpath = req.files?.coverImage[0]?.path;
    // console.log(avatarLocalpath);
    // console.log(coverImageLocalpath);
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalpath)
    {
      throw new apierror(400,"Avatar  file is required")
    }

    const avatar = await uploadoncloudinary(avatarLocalpath)
    const coverImage = await uploadoncloudinary(coverImageLocalPath)
    // console.log(avatar);
    // console.log(coverImage);
  
    if(!avatar){
      throw new apierror(400,"Avatar  file is required")
    }
     
   const user =  await User.create({
      fullname,
      avatar:avatar.url,
      coverImage:coverImage?.url||"",
      email,
      password,
      username: username.toLowerCase()
    })

    const createdusername = await User.findById(user._id).select("-password  -refreshToken");
    
    if(!createdusername)
    {
      throw new apierror(500,"something went wrong while reginstering the user")
    }

    return res.status(201).json(
      new apiresponse(200,createdusername,"User register successfully")
    )
}) 

// ***********************************login***************************************
const loginUser = asynchandler(async (req,res)=>{
  // req body->data,
  // username or email
  //find the user
  //password check
  //access and refresh token
  //send cookies 
  console.log("4");
  const {username,email,password}=req.body
  if(!username&&!email){
    throw new apierror(400,"username or email is required")
  }

  console.log("username is available")
  console.log(email)
  const user = await User.findOne({
    $or:[{username},{email}]
  })
  
  if(!user)
  {
    throw new apierror(400,"username , user does not exist")
  }
 console.log("user is availabele");
  const isPasswordValid = await user.isPasswordCorrect(password)  
  
  if(!isPasswordValid){
    throw new apierror(400,"invalid user credential")
  }
   console.log("password is correct");
   
  const {accessToken,refreshToken} = await generateAccessTokenandrefreshToken(user._id)
   
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
                       
  const options = {
    httpOnly: true,
    secure:true
  }
   console.log("ready to send json");
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new apiresponse(200,
    {
      user:loggedInUser,accessToken,refreshToken
    },"user is logged in successfull"
  )
)
  
})


// ********************************logout***************************
const logoutUser = asynchandler(async(req,res)=>{
  console.log("in controller logout user");
     await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset:{
          refreshToken:1
      }
    },{
         new: true
    }
     )
     
     const options = {
      httpOnly: true,
      secure:true
     }
     console.log(req.user._id);
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new apiresponse(200,"user is logged out successfully"))
})

// **************************delete **************


const deleteuser = asynchandler(async(req,res)=>{
 const store =  await User.findById(req.user._id);
  console.log(store._id);
  await User.deleteOne({_id: (store._id)})
    res.status(200)
    .json(new apiresponse(200,"successfull"));
})

// ***************************refreshToken*************************************************
const refreshAccessToken = asynchandler(async (req,res)=>{
  console.log("in controller refresh token");
  const incomingrefreshtoken = req.cookies.refreshToken||req.body.refreshToken
    //  console.log(incomingrefreshtoken);
  if(!incomingrefreshtoken){
    throw new apierror(401,"unauthorized request");
  }
  // console.log("reach");
try {
        // console.log(incomingrefreshtoken);
    const decodedtoken = jwt.verify(
      incomingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    )
    // console.log("reach");
    // console.log("decoded token",decodedtoken);
  
    const user =await User.findById(decodedtoken?._id)
    if(!user){
      throw new apierror(401,"unauthorized request");
    }
  
    if(incomingrefreshtoken!==user?.refreshToken)
    {
      throw new apierror(401,"Refresh token is expired or used");
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newrefreshToken}=await generateAccessTokenandrefreshToken(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",options)
    .json(
      new apiresponse(
        200,
        {accessToken,refreshAccessToken:newrefreshToken},
        "Access token refreshed"
    )
    )
} catch (error) {
  throw new apierror(401,error?.message||"invalid refresh token")
}

// **********************************change Current Password**************************************

})

const changeCurrentPassword = asynchandler(async(req,res)=>{
  const {oldPassword,newPassword}= req.body

  const user = await User.findById(req.user?._id)
 
  const isPasswordValid = await user.isPasswordCorrect(oldPassword)
 
  if(!isPasswordValid){
    throw new apierror(401,"invalid old password")
    }

    user.password = newPassword;
    
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new apiresponse(200,user,"password changed successfully"))

})




// *******************get current user*********************************************
const getCurrentUser =  asynchandler(async(req,res)=>{
  return res
  .status(200)
  .json(new apiresponse(200,req.user,"user fetch successfully"))
})

const getUserById = asynchandler(async(req,res)=>{
  const user_id = req.params.id;
  const user = await User.findById(user_id);
  return res
  .status(200)
  .json(new apiresponse(200,user,"user fetch successfully"))
})
// *********************update account detail***********
const updateAccountDetails = asynchandler(async(req,res)=>{
  const {fullname,email}=req.body

  if(!fullname||!email)
  {
    throw new apierror(400,"fullname and email are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullname:fullname,
        email:email
      }
    },
    {new:true}

  ).select("-password" )
  
  return res
  .status(200)
  .json(new apiresponse(200,user,"Account details updated successfully"))
})


// ******************************updated UserAvatar************************************************
const updatedUserAvatar = asynchandler(async(req,res)=>{
  const  avatarLocalpath=req.file?.path
  
  if(!avatarLocalpath){
    throw new apierror(400,"Avatar file is missing")
  }

  const avatar = await uploadoncloudinary(avatarLocalpath)
  if(!avatar.url){
    throw new apierror(400,"Avatar upload failed")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    }
    ,{
      new:true
    }
  ).select("-password")


  return res
        .status(200)
        .json(
          new apiresponse(200,user,"cover Image updated")
        )

})


// ******************************************update coverImage*********************************
const updatedUsercoverImage = asynchandler(async(req, res) => {
  const  coverImageLocalpath = req.file?.path

      if (!coverImageLocalpath) {
          throw new apierror(400, "coverImage file is missing")
      }

  const coverImage = await uploadoncloudinary(coverImageLocalpath)
      if (!coverImage.url) {
          throw new apierror(400, "coverImage upload failed")
      }

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")


        return res
        .status(200)
        .json(
          new apiresponse(200,user,"cover Image updated")
        )
})

// *****************************get user channel profile*****************************
const getUserChannelProfile = asynchandler(async(req, res) => {
  const {username} = req.params

  if (!username?.trim()) {
      throw new apierror(400, "username is missing")
  }

  const channel = await User.aggregate([
      {
          $match: {
              username: username?.toLowerCase()
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "noOfSubscribers"
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "meSubscripedToHowMany"
          }
      },
      {
          $addFields: {
              subscribersCount: {
                  $size: "$noOfSubscribers"
              },
              channelsSubscribedToCount: {
                  $size: "$meSubscripedToHowMany"
              },
              isSubscribed: {
                  $cond: {
                      if: {$in: [req.user?._id, "$noOfSubscribers.subscriber"]},
                      then: true,
                      else: false
                  }
              }
          }
      },
      {
          $project: {
              fullName: 1,
              username: 1,
              subscribersCount: 1,
              channelsSubscribedToCount: 1,
              isSubscribed: 1,
              avatar: 1,
              coverImage: 1,
              email: 1
          }
      }
  ])

  if (!channel?.length) {
      throw new apierror(404, "channel does not exists")
  }

  return res
  .status(200)
  .json(
      new apiresponse(200, channel[0], "User channel fetched successfully")
  )
})



// ******************************get watch History****************************
const getwatchHistory = asynchandler(async(req,res)=>{
    const his = await User.aggregate([
    {
        $match:{
          _id: new mongoose.Types.ObjectId(req.user?._id)
        }
    },
      {
        $lookup:{
          from:"videos",
          localField:"watchHistory",
          foreignField:"_id",
          as:"history",
          pipeline:[
            {
              $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                  {
                    $project:{
                      fullname:1,
                      username:1,
                      avatar:1
                    }
                  }
                ]
              }
            },
            {
              $addFields:{
                owner:{
                   $first:"$owner"
                }
              }
            }
          ]
        }
      }
    ])

    // console.log(his);
    return res
    .status(200)
    .json(
      new apiresponse(
        200,
        his[0],
      "watch History fetched successfully"
      )
    )
})


 


export { 
  registerUser ,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserById,
  updateAccountDetails,
  updatedUserAvatar,
  updatedUsercoverImage,
  getUserChannelProfile,
  getwatchHistory,
  deleteuser
};
