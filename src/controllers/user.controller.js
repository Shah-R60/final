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

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apierror(400, "All field are required")
  }


  const existedUser = User.findOne({
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
      password,
      username:username.toLowerCase()
    })
    const createdusername = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if(!createdusername)
    {
      throw new apierror(500,"something went wrong while reginstering the user")
    }

    return res.status(201).json(
      new apierror(200,createdusername,"somethig went wrong");
    )
}) 

export { registerUser };