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

userRouter.get("/user/connections", userAuth, async(req,res)=>{

    try{
        // accessing data 
        const loggedInUser = req.user;

        // get all the accepted connection request
        // find - {toUser, fromUser}, status - "accepted"

        // find user connections 
        const userConnections = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ],
            status:"accepted"
        }).populate("fromUserId",["firstName", "lastName"]).populate("toUserId",["firstName","lastName"]);

        // Showing connections from both sender and receiver side
        const connections = userConnections.map((req)=>
            req.fromUserId._id.equals(loggedInUser._id)?
            req.toUserId : req.fromUserId
        )

        res.json({message:"User Connections", data:connections});

    } catch (err){

        res.status(400).send("Error Occured: " + err.message);
    }
})

module.exports = userRouter;