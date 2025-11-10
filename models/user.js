import mongoose from "mongoose";
const {Schema}=mongoose
const userschema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true
    },
    password:{
        type:String,
        minLength:8,
        required:true
    }
},{timestamps: true})
userschema.post('findOneAndDelete',async function(doc){ 
    // this post means after User.func() tied to findOneandDelete is executed then this post is executed
    if(doc){
        await mongoose.model('submission').deleteMany({userId: doc._id})
    }
});
const User=mongoose.model("user",userschema)
export default  User