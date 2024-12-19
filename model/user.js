// import { Schema }from "mongoose";
import mongoose from "mongoose";

const {Schema} = mongoose

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    passwordHash:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    googleId:{
        type:String,
        unique:true,
        sparse: true
    },
    avatar:{
        type:String
    },
    provider: {
         type: String,
          required: true,
           default: 'jwt' 
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

UserSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

UserSchema.set('toJSON',{
    virtuals:true
})

export const User = mongoose.model('users',UserSchema)