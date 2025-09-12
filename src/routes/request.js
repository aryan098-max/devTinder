const express = require("express");
const requestRouter = express.Router();
const mongoose = require('mongoose');

// imorting models
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// importing userAuth 
const userAuth = require("../middlewares/userAuth");

// Defining routes
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{

    try{
        // accessing data
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // status validation 
        const Allowed_Status = ["interested", "ignored"];
        const isStatusAllowed = Allowed_Status.includes(status);

        if(!isStatusAllowed){
            return res.status(400).json({message:"Invalid Status Type", status:status});
        }

        // mongoose id validtion
        if(!mongoose.Types.ObjectId.isValid(toUserId)){
            return res.status(400).json({message:"Invalid toUserId"})
        }

        // user exists or not validation
        const toUser = await User.findById({_id:toUserId})

        if(!toUser){
            return res.status(404).json({message:"User Not Found"});
        }

        // sending connection request to itself validation
        // if(fromUserId.toString() === toUserId.toString()){
        //     res.status(400).json({message:"You Cannot Send Request To Yourself"});
        // }

        // Alternative way = more cleaner
        if(fromUserId.equals(toUserId)){
           return res.status(400).json({message:"You Cannot Send Request To Yourself"});

        }

        // Checkin Already Existing Connection Request
        const existingConnection = await ConnectionRequest.findOne({
            $or:[
                {fromUserId:fromUserId, toUserId:toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })

        if(existingConnection){
            return res.status(400).json({message:"Connection Request Already Exists"});
        }
        
        // created new instance of connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId, 
            toUserId, 
            status
        })

        // saving in the database
        const data = await connectionRequest.save();

        res.json({message:loggedInUser.firstName + " is " + status + " on " + toUser.firstName, data});

    } catch (err){
        
        res.status(400).send("Error Occured: " + err.message);
    }
})

module.exports = requestRouter;
