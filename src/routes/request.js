const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{

  // currently loggedIn user = fromUserId because it sends a request to other user - toUserId 
  // toUserId will get a request from the currently loggedInUser - Think this analogy as Facebook

  try{

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // statusvalidations
    const allowedStatusType = ["interested", "ignored"];  
    if(!allowedStatusType.includes(status)){

        return res.status(400).json({message:"Not allowed Status Type: " + status });s
    }

    // userId valid or not 
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // userID exists or not checking in users collections
    const toUser = await User.findById(toUserId);
    if(!toUser){
        return res.status(404).json({message:"This user doesn't exist"});
    }

    // sending connection to yourself
    // if(fromUserId.toString() === toUserId.toString()){
    //   return res.status(400).send("You can't send request to yourself");
    // }

    // existing connection validation, checking A->B or B->A 
    // Not chaning the schema just exchanging the values

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        {fromUserId:fromUserId, toUserId:toUserId},
        {fromUserId:toUserId, toUserId:fromUserId} // what is this second condition checking
      ]
    })

    if(existingConnectionRequest){
      return res.status(400).send("Connection Request already exists");
    }

    const connectionRequest = new ConnectionRequest({

      fromUserId:fromUserId, 
      toUserId: toUserId, 
      status: status
      
    });

    // saving connection in the database 

    const data = await connectionRequest.save();

    res.json({message:"Connection Request Sent Successfully", data:data})

  } catch (err){

    res.status(400).send("Error: " + err.message);

  }
})

module.exports = requestRouter;
