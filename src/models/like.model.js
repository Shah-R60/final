import mongoose,{Schema} from "mongoose";
import { comment } from "./comment.model";
import { Video } from "./video.model";

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



likeSchema.plugin(mongooseAggregatePaginate)
export const like  = mongoose.model("like",likeSchema);