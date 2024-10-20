import mongoose,{Schema} from "mongoose";
import { Comment } from "./comment.model.js";
import { Video } from "./video.model.js";

const likeSchema = new Schema({
   comment:{
    type: Schema.Types.ObjectId,
    ref: 'comment'
   },
   Video:{
    type: Schema.Types.ObjectId,
    ref: 'Video'
   },
   likedBy:{
    type: Schema.Types.ObjectId,
    ref: 'User'
   },
   tweet:{
    type: Schema.Types.ObjectId,
    ref: 'Tweet'
   }
},{timestamps:true})

export const Like  = mongoose.model("Like",likeSchema);