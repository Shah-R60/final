import { asynchandler } from "../utils/asynchandler.js"
import { apierror } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js"
import { apiresponse } from "../utils/apiresponce.js"
 // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



const registerUser = asynchandler(async (req, res) => {


  const { fullname, email, username, password } = req.body
  console.log(req.body);
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apierror(400, "All field are required")
  }


  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })
    console.log(existedUser);
    if(existedUser)
    {
      throw new apierror(409,"username or email is already exist");
    }
   
    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;
    console.log(req.files);
    console.log(avatarLocalpath)
    console.log(coverImageLocalpath)

    if(!avatarLocalpath)
    {
      throw new apierror(400,"Avatar  file is required")
    }

    const avatar = await uploadoncloudinary(avatarLocalpath)
    console.log(avatar)

    const coverImage = await uploadoncloudinary(coverImageLocalpath)
    console.log(coverImage);
    
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

    console.log(user)
    const createdusername = await User.findById(user._id).select(
      "-password -refreshToken"
    )
    console.log(createdusername)
    if(!createdusername)
    {
      throw new apierror(500,"something went wrong while reginstering the user")
    }

    return res.status(201).json(
      new apiresponse(200,createdusername,"somethig went wrong")
    )
}) 

export { registerUser };