const mongoose = require("mongoose");
const {Schema} = mongoose;
const validator = require("validator");

const userSchema = new Schema({

    /*
        Schema: Schema defines what will be the different field and its data type. 
        It bascially defines our data type.
    */
     
    firstName:{
        type:String,
        required:true,
        minlength:3, 
        maxlength:10
    }, 
    lastName:{
        type: String,
        required: true,
        minlength:3
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
        validate(value){
            if(!(validator.isEmail(value) && value.endsWith(".com"))){
                throw new Error ("Not a Valid Email: " + value);
            }
        }

    }, 
    password:{
        type: String,
        required:true,
        minlength:5, 
        validate(value){
            
            if(!validator.isStrongPassword(value)){
                throw new Error ("Password Not Strong Enough: Add Characters Capital Letters")
            }
        }
    },
    age:{
        type:Number,
        min:18,
        maxAge:50
    },
    gender:{
        type:String,
        lowercase:true,
        // gender validātion
        validate(value){
            if(!["male", "female","others"].includes(value)){

                throw new Error("Not Valid Data");
            }
        }
    },
    photo:{
        type:String,
        default:"https://www.vectorstock.com/royalty-free-vector/default-profile-picture-avatar-user-icon-vector-46389216",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("URL is not Valid");
            }
        }
    },
    about:{
        type:String,
        default:"Nice to meet you"
    },
    skills:{
        type:[String],
        validate(value){
            if(value.length > 15){
                throw new Error ("You can't add more than 15 skills");
            }
        }
    }
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;