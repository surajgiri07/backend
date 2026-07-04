import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema({
    vedioFile:{
        type:String,//cloudnary URL
        required:true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    tittle: {
        type: String,
        required: true,

    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    duration: {
        type: Number, //cloudnary url
        required: true
    },

    views: {
        type: Number,
        default:0,
        required: true
    },
    isPublished:{
        type:Boolean,
        default:true
    }

}, { timestamps: true })

vedioSchema.plugin(mongooseAggregatePaginate);

export const Vedio=mongoose.model("Vedio",vedioSchema)