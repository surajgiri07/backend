import mongoose,{Schema} from 'mongoose';

const subscriptionSchema = new Schema({

    subscriber:{ // one whos is subscribing
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    channel:{//one who the subscriber will subscribe
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema)