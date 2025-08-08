const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({

    /*
        Schema: Schema defines what will be the different field and its data type. 
        It bascially defines our data type.
    */
     
    firstName:{
        type:"String"
    }, 
    lastName:{
        type:"String"
    },
    emailId:{
        type:"String"
    }, 
    password:{
        type:"String"
    },
    age:{
        type:"Number"
    },
    gender:{
        type:"String"
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;