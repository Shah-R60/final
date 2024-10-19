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



// ********** get user playlist***********
const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId?.trim())
    {
        throw new apierror(200,"userId is missing");
    }
 
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const playlist = await PlayList.aggregate([
        {
            $match:{
                owner:userObjectId
            }
        }
    ])
    if(!playlist)
    {
        throw new apierror(200,"playlist is not found");
    }
    
    res.status(200).
    json(
        new apiresponse(200,playlist,"playlist fetch successfully")
    );
})



// *************get playlist by id********************

const getPlaylistById = asynchandler(async(req,res)=>{
    const {playlistId} = req.params
    if(!playlistId?.trim())
    {
        throw new apierror(400,"playlist id is missing");
    }

    const playlist = await PlayList.findById(playlistId).select('videos');
    if(!playlist){
        throw new apierror(400,"playlist is not found");
    }
    res.status(200).json(
        new apiresponse(200,playlist.videos,"playlist fetch successfully")
        ); 
})

// **************** add videos *****************

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {videoId, playlistId} = req.params;
    console.log(videoId);
    console.log(playlistId);
    if (!playlistId?.trim() || !videoId?.trim()) {
        throw new apierror(400,"field are necessary");
    }
    
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new apierror(400, "playlist is not found");
    };

    const addVideo = await PlayList.updateOne(
        {_id:playlistId}
         ,{
           $push:{
            videos:videoId
        }});

    if(!addVideo)
    {
        throw new apierror(400,"video is not uploaded");
    }
   return  res.status(200).json(
        new apiresponse(200,addVideo,"video is added")
    )

})
// *********************delete video from playlist*****************


const removeVideoFromPlaylist  = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId?.trim())
    {
        throw new apierror(400,"playlist id is missing")
    }

    const removePlaylist = await PlayList.updateOne({_id:playlistId},
        {$pull:{
            videos:videoId
        }
    });

    if(!removePlaylist)
    {
        throw new apierror(400,"there is something error, video is not deleted")
    }

    return res.status(200).json(
        new apiresponse(200,removePlaylist,"video is added")
    )
})



const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId?.trim())
    {
        throw new apierror(400,"playlist id is missing");
    }
    const store = await PlayList.findById({_id:playlistId});
    if(!(store))
    {
        throw new apierror(400,"playlist is not exist");
    }
    if(name?.trim()|description?.trim())
    {
        throw new apierror(400,"one of the field is necessary");
    }
    const update_playlist = await PlayList.updateOne({_id:playlistId},{
        $set:{
            name:name,
            description:description
        }
    });
    if(!update_playlist)
    {
        throw new apierror(400,"playlist is not updated");
    }

    return res.status(200).json(
        new apiresponse(200,update_playlist,"playlist is updated")
    )
})


const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
        if(!playlistId?.trim())
        {
            throw new apierror(400,"playlist id is missing");
        }
        console.log(playlistId);
        const playlist = await PlayList.findById({_id:playlistId})
        console.log(playlist);

        if(!playlist){
            throw new apierror(400,"playlist is not found");
        }

       const deletedPlaylist = await PlayList.deleteOne({_id:playlistId});

       if(!deletedPlaylist)
        {
            throw new apierror(400,"playlist is not deleted,there is some error ");
        }

        return res.status(200).json(
            new apiresponse(200,deletePlaylist,"playlist deleted successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
