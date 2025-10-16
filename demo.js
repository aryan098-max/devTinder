const express = require('express');
const Routes = express.Router();
const cookieParser = require('cookie-parser');
const User = require("./src/models/user");
// validation - utils - validation 
const {validateSignupData} = require("./src/utils/validation")

// for parsing the req body - middleware 
app.use(express.json())
app.use(cookieParser()) - // for parsing the cookies


Routes.post("/signup", async (req,res)=>{

    try{

        const userData = req.body;

        const isValid = validateSignupData(userData);

        if(!isValid){
            return res.json({message:"User Data is Not Valid"})
        }

        const user = new User(userData);

        await user.save();
        
        res.json({message:"User is successfully saved in the database"});

    } catch(err){

        res.send("Error Occured: ", err.message)

    }
    
})