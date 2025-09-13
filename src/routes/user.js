const express = require('express');
const userRouter = express.Router();

// importing mdodels
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

// importing userAuth middleware
const userAuth = require("../middlewares/userAuth");

userRouter.get("/user/requests/received", userAuth, async(req,res)=>{

    try{
        
        // accessing data
        const loggedInUser = req.user;
        
        // getting all the connection request
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("toUserId", ["firstName","lastName"]).populate("fromUserId",["firstName","lastName"]);

        res.json({message:connectionRequests}); 

    } catch (err){
        
        res.status(400).send("Error Occured: " + err.message);
    }


})

module.exports = userRouter;