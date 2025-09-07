const mongoose = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');

const adminSchema = new Schema({
    
    email:{
        type:String,
        unique:true, 
        required:true,
        trim:true,
        index:true,
        validate(value){
            if(!(validator.isEmail(value) && value.endsWith(".com"))){
                throw new Error ("Wrong Credentials")
            }
        }
    },

    password:{
        type:String, 
        required:true, 
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("Password is Not Strong Enough");
            }
        }
    },

    role:{
        type:String,
        default:"admin"
    }
}, {timestamps:true})


const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;