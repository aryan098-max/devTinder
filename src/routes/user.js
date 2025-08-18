const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();


userRouter.get("/user/requests/received", userAuth, async(req,res)=>{

    try{

        // loggedIn User from req.user
        const loggedInUser = req.user;

        // finding array of; therefore, using find. loggedInUser connection request, A->B, C->B
        const connectionRequset = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]);

        res.json({message:`${loggedInUser.firstName} connection requests`, data:connectionRequset})


    } catch (err){

        res.status(400).send("Error Occurred: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async(req,res)=>{

    try{
        // fetching loggedInUser
        const loggedInUser = req.user;

        // All connections - loggedInUser can be sender or a receiver; therefore, checking for both
        const allConnections = await ConnectionRequest.find({

            $or:[{fromUserId:loggedInUser._id, status:"accepted"}, {toUserId:loggedInUser._id, status:"accepted"}]

        })
        .populate("fromUserId", "firstName lastName")
        .populate("toUserId", "firstName lastName");


        // allConnections is an array - find returns an array, filtering data
        const data = allConnections.map((row)=>{
            // if Elon is the sender, pick the receiver, 
            // if Elon is the receiver, pick the sender, 

            const user = row.fromUserId._id.toString() === loggedInUser._id.toString()? row.toUserId: row.fromUserId;

            // user is an obj
            return {firstName:user.firstName, lastName:user.lastName};
        });

        // response to a user
        res.json({data:data});

    } catch (err) {

        res.status(400).send("Error Occurred: " + err.message);
    }

})



module.exports = userRouter;     