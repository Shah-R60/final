import mongoose,{isValidObjectId} from "mongoose";
import {PlayList} from "../models/playlist.model.js";
import {apierror} from "../utils/apierror.js";
import {apiresponse} from "../utils/apiresponce.js";
import {asynchandler} from "../utils/asynchandler.js";



//TODO: create playlist
const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user._id;
    if(
        [name,description].some((field)=>field?.trim()==="")
    ){
        throw new apierror(400,"All field are required");
    }
     const playlist = await  PlayList.create({
        name,
        description,
        owner:userId
      })
      if(!playlist)
      {
        throw new apierror(400,"playlist is not created");
      }
      
      res.status(200).json(
        new apiresponse(200,playlist,"playlist has created")
      )
})




export {createPlaylist};
