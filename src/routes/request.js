const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{

  try{

    // fetching user 
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id
    const {status} = req.params;
    const {toUserId} = req.params;

    // status validation
    const Allowed_Status = ["interested", "ignored"];

    if(!Allowed_Status.includes(status)){
      return res.status(400).send("Status Not Valid");
    }

    // toUserId Validation
    if(!mongoose.Types.ObjectId.isValid(toUserId)){
      return res.status(400).send("UserId Not Valid");
    }

    // existing connection validation
    const existingConnectionRequest = await ConnectionRequest.findOne({
       $or:[{fromUserId: fromUserId, toUserId: toUserId}, {fromUserId:toUserId, toUserId:fromUserId}] , 
    })

    if(existingConnectionRequest){
      return res.status(400).send("A connection request already exists")
    }

    // creating a new connectionRequest document 
    const connectionRequest = new ConnectionRequest({
      fromUserId:fromUserId,
      toUserId:toUserId,
      status:status
    })

    // saving the new connection 
    await connectionRequest.save();

    // fetch toUserId firstName 
    const toUser = await User.findById(toUserId).select("firstName lastName");
    console.log(toUser);

    res.json({message:`${loggedInUser.firstName} has sent a connection request to ${toUser.firstName}` });


  } catch (err){

      res.status(400).send("Error Occured: "+ err.message);
  }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{

  try{  

    const loggedInUser = req.user;
    const {status} = req.params;
    const {requestId} = req.params;

    // status validation 
    const Allowed_Status = ["accepted", "rejected"];

    if(!Allowed_Status.includes(status)){
      return res.status(400).send("Status Not Valid");
    }

    // requestId Validation 

    if(!mongoose.Types.ObjectId.isValid(requestId)){
      return res.status(400).send("RequestId Not Valid");
    }

    // searching for connection request
    const connectionRequest = await ConnectionRequest.findOne({
      toUserId:loggedInUser._id, 
      status:"interested"
    })

    // changing status
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({message:"Connection Request was: " + status, data:connectionRequest});

  } catch (err){


  }
})

// I need to accept a user's request

module.exports = requestRouter;
