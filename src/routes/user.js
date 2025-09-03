const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");


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
            // returns a user obj 
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

userRouter.get("/user/feed", userAuth, async(req,res)=>{

    try{

        /*
            1. Own profile - hidden
            2. Existing Connections - hidden, interested. accepted
            3. ignored - hidden
            4. rejected - hidden

        */

        // fetching the loggedInUser
        const loggedInUser = req.user;

        // adding page (skip) & limit feature
        let limit = parseInt(req.query.limit) || 10;
        // sanitizing limit 
        limit = limit > 50 ? 50 : limit;

        // page sanitization
        let page = parseInt(req.query.page) || 1;
        page = page === -1 ? 1 : page
        const skip = (page-1) * limit;
        
        // getting all the connections fromUser or toUser
        const allConnections = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId")
        //.populate("fromUserId", "firstName").populate("toUserId", "firstName")

        // hiding all the current connections from the feed, hiddenConnections will have all unique elements, creating set
        const hiddenUsersFromFeed = new Set();
        allConnections.forEach((req)=>{
            hiddenUsersFromFeed.add(req.fromUserId.toString()); // 
            hiddenUsersFromFeed.add(req.toUserId.toString());
        })

        // query for selecting non connections user - user User model

        const nonConnectedUsers = await User.find({$and:[
            {_id:{$nin:Array.from(hiddenUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
        ]}).select("firstName lastName skills").skip(skip).limit(limit);
        
        res.json({data:nonConnectedUsers});

    } catch (err){
    
        res.status(400).send("Error Occured: " + err.message);
    }
  
})

module.exports = userRouter;     