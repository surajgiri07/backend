import mongoose,{Schema} from "mongoose"

const likeSchema=new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment",
        required:true
    },

    video:{
        types:Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },

    tweet:{
        types:Schema.Types.ObjectId,
        ref:"Tweet",
        required:true
    }
},{timestamps:true})

export const Like=mongoose.model("Like",likeSchema)