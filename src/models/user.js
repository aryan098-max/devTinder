const mongoose = require('mongoose');
const validator = require('validator');
const {Schema} = mongoose;

const userSchema = new Schema({

    firstName:{
        type:String,
        minlengh:3,
        maxlength:10
    }, 
    lastName:{
        type:String,
        minlengh:3,
        maxlength:10
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
        },
        required:true
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

    photoURL:{
        type:String, 
        default:"https://cdn.vectorstock.com/i/1000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg",
        validate:{
            validator:function (phtourl){
                return validator.isURL(phtourl);
            },
            message:"The Photo URL Is Not Correct"
        }

    },
    about:{
        type:String,
        default:"CS student chasing dreams"
    }, 
    skills:{
        type:[String],
        validate:{
            validator:function (arr){
                return arr.length >=1 && arr.length <=5; // min=1, max=5
            },
            message:"Limit is 5 Skills"
        }
    }


},{timestamps:true});

const User = mongoose.model("user",userSchema);

module.exports = User;