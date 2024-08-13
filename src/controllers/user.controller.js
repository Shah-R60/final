import {asynchandler} from "../utils/asynchandler.js"

const registerUser = asynchandler(async(req,res)=>{
   return  res.status(800).json({
        message:"ok"  ,
        message:"rahul shah is deciplined",
          message:"rahul shah is deciplined",
            message:"rahul shah is deciplined",
    })
})

export {registerUser};