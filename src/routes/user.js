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

userRouter.get("/feed", userAuth, async(req,res)=>{

    try{

        // accessing data
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // sanitizing limit
         limit = limit>50 ? 50 : limit;   

        // page and limit validation
        if(page<1 || limit<1){
           return res.status(400).json({message:"page and limit can't be negative"});
        }

        // skip calculation
        const skip = (page-1)*limit;

        // finding all the connection request
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id} 
            ]       
        }).select("fromUserId toUserId");

        // list of hidden users
        const hiddenUsers = new Set()
        connectionRequests.forEach((req)=>{
            hiddenUsers.add(req.fromUserId);
            hiddenUsers.add(req.toUserId);
        })

        // list of users we want in our feed
        const users = await User.find({
            $and:[
                {_id:{$nin:Array.from(hiddenUsers)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName").skip(skip).limit(limit);

        res.json({message:"List of User: ", data:users});

    } catch (err){

        res.status(400).send("Error Occured: " + err.message);
    }
})

module.exports = userRouter;