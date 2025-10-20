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

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        // accessing user data
        const loggedInUser = req.user;
        const {status, requestId} = req.params
        
        // status validation = interested && allowed status
        const Allowed_Status = ["accepted","rejected"];
        const isStatusAllowed = Allowed_Status.includes(status);

        if(!isStatusAllowed){
            return res.status(400).json({message:"Not Allowed Status Type"})
        }

        // valid requestId = ObjectId
        if(!mongoose.Types.ObjectId.isValid(requestId)){
            return res.status(400).json({message:"Request Id is not a valid Id"});
        }


        // ================= All three Validtions Using findOne ================>
        // requestId exists or not
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
        }

        // checking loggedInUser is toUserId && requestId.status == interested
        // if(!loggedInUser._id.equals(connectionRequest.toUserId)){
        //     return res.status(403).json({message:"You are not allowed to review this request"});
        // }

        // if(connectionRequest.status !== "interested"){
        //     return res.status(400).json({message:`{ The request has already been ${connectionRequest.status}`});
        // }

        // ====================================================================>

        // connection request exist
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message:`${loggedInUser.firstName} has ${status} the request`, data});

    } catch (err){

        res.status(400).send("Error Occured: " + err.message);
    }
})

module.exports = requestRouter;
