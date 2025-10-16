// How to set up cookies during logggin in 

const express = require('express');
const User = require('./src/models/user');
const authRouter = express.Router();


authRouter.post("/login", userAuthentication, async(req,res)=>{

    try{
        
        // validateUser Data, validate password, 

        // this user comes from the emailId
        if(password){
            const token = await user.jwt();

            res.cookies("token",token, {expiresIn:new Date(Date.now() * 60 * 60 * 24 * 1000)});
        }


    } catch (err){

        res.status(400).send("Error Occured:" + err.message);
    }

})