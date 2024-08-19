import { asynchandler } from "../utils/asynchandler.js"
import { apierror } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { apiresponse } from "../utils/apiresponce.js"
import jwt from "jsonwebtoken";
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
  if(!incomingrefreshtoken){
    throw new apierror(401,"unauthorized request");
  }
try {
  
    const decodedtoken = jwt.verify(
      incomingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    )
    console.log("decoded token",decodedtoken);
  
    const user =await User.findById(decodedtoken?._id)
    if(!user){
      throw new apierror(401,"unauthorized request");
    }
  
    if(incomingrefreshtoken!==user?.refreshAccessToken)
    {
      throw new apierror(401,"Invalid refresh token");
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

export { 
  registerUser ,
  loginUser,
  logoutUser,
  refreshAccessToken
};
