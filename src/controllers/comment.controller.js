import mongoose  from "mongoose";
import {Comment} from "../models/comment.model.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponce.js"
import {asynchandler} from "../utils/asynchandler.js"



const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

        if(!videoId?.trim())
        {
            throw new apierror(400,"videoId is missing");
        }

       const comment  =  await Comment.find({video:videoId});
       if(!comment)
       {
        throw new apierror(400,"does not get comments");
       }
      
      return res.status(200).json(
        new apiresponse(200,comment,"comments get successfully")
       )

})


const addComment = asynchandler(async (req, res) => {
    // TODO: add a comment to a video
    const{videoId} = req.params
  
    if(!videoId?.trim())
    {
        throw new apierror(400,"video id is missing");
    }
    const {content} = req.body
    const userId = req.user._id;
     const comment = await Comment.create({
            content,
            video:videoId,
            owner:userId
     })

     if(!comment){
        throw new apierror (400,"there is some problem");
     }
     
     return res.status(200).json(
        new apiresponse(200,comment,"add comment successfully")
     )
})

const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    if(!commentId?.trim())
    {
        throw new apierror(400,"comment id is missing");
    }
    const {content}= req.body;
    const comment =  await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },
        {
            new:true
        }
    )

    if(!comment){
        throw new apierror(400,"there is some problem");
        }

        return res.status(200).json(
            new apiresponse(200,comment,"comment updated successfully")
            )
})



const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!commentId?.trim())
        {
            throw new apierror(400,"comment id is missing");
        }

        const deleted= await Comment.deleteOne({_id:commentId});
        if(!deleted)
        {
            throw new apierror(400,"there is some problem");
        }

         return res
         .status(200)
         .json(
          new apiresponse(200,"comment deleted successfully")
          )
})




export {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
};