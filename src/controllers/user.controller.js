import { asynchandler } from "../utils/asynchandler.js"
import { apierror } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { apiresponse } from "../utils/apiresponce.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose"

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
    const coverImageLocalpath = req.files?.coverImage[0]?.path;
   
    if(!avatarLocalpath)
    {
      throw new apierror(400,"Avatar  file is required")
    }




    const avatar = await uploadoncloudinary(avatarLocalpath)
    const coverImage = await uploadoncloudinary(coverImageLocalpath)
    
  
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
     console.log("ready to send");
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new apiresponse(200,"user is logged out successfully"))
})

const refreshAccessToken = asynchandler(async (req,res)=>{
  console.log("in controller refresh token");
  const incomingrefreshtoken = req.cookies.refreshToken||req.body.refreshToken
     console.log(incomingrefreshtoken);
  if(!incomingrefreshtoken){
    throw new apierror(401,"unauthorized request");
  }
  console.log("reach");
try {
        console.log(incomingrefreshtoken);
    const decodedtoken = jwt.verify(
      incomingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    )
    console.log("reach");
    console.log("decoded token",decodedtoken);
  
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


  
})

const changeCurrentPassword = asynchandler(async(req,res)=>{
  const {oldPassword,newPassword}= req.body

  const user = await User.findById(req.user?._id)
  console.log(user);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword)
  console.log(isPasswordValid);

  if(!isPasswordValid){
    throw new apierror(401,"invalid old password")
    }

    user.password = newPassword;
    console.log(user.password);
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new apiresponse(200,user,"password changed successfully"))

})

const getCurrentUser =  asynchandler(async(req,res)=>{
  return res
  .status(200)
  .json(new apiresponse(200,req.user,"user fetch successfully"))
})

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
        fullname,
        email:email
      }
    },
    {new:true}

  ).select("-password" )
  console.log(user.email);
  console.log(user.fullname);
  return res
  .status(200)
  .json(new apiresponse(200,user,"Account details updated successfully"))
})


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
      new apierror(200, channel[0], "User channel fetched successfully")
  )
})



const getwatchHistory = asynchandler(async(req,res)=>{
    const user = await User.aggregate([
    {
        $match:{
          _id: new mongoose.Types.ObjectId(req.user?._id)
        }
      },
      {
        $lookup:{
          from:"video",
          localField:"watchHistory",
          foreignField:"-id",
          as:"watchHistory",
          pipeline:[
            {
              $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"-id",
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


    return res
    .status(200)
    .json(
      new apiresponse(
        200,
        user[0].getwatchHistory,
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
  updateAccountDetails,
  updatedUserAvatar,
  updatedUsercoverImage,
  getUserChannelProfile,
  getwatchHistory
};
