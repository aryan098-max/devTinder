const mongoose = require('mongoose');
const {Schema} = new mongoose;

const userSchema = new Schema({

    firstName:{
        type:String,
        minLengh:3,
        maxLength:10
    }, 
    lastName:{
        type:String,
         minLengh:3,
        maxLength:10
    },
    emailId:{
        type:String,
        unique:true, 
        required:true,
        trim:true,
        lowercase:true,
        validate:{
            validator: function (value){
                // return false when invalid
               return validator.isEmail(value) && value.endsWith(".com")
            }, 
            message:"Email Id is Not Valid"
        }
    },
    password:{
        type:String,
        validate:{
            validator:function(value){
                return validator.isStrongPassword(value);
            },

            message:"Password Not Strong Enough"
        }
    },
    age:{
        type:Number, 
        min:18,
        max:50
    },
    gender:{
        type:String,
        enum:{
            values:["male", "female", "others"],
            message:"{VALUE} is not a valid gender"
        },
        validate(value){
            if(!(["male","female","others"].includes(value))){
                throw new Error ("Not a Valid Gender");
            }
        }
    }, 
    About:{
        type:String,
        default:"CS student chasing dreams"
    }, 
    skills:{
        type:[String]
    }


},{timeStamps:true});

const User = new mongoose.model("user",userSchema);

module.exports = User;