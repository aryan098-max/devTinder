const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

// Importing Models
const User = require("../models/user");

// importing middlewares
const userAuthentication = require("../middlewares/userAuth");

// importing validation
const {validateProfileData} = require("../utils/validation");

profileRouter.get("/profile/view", userAuthentication, async(req,res)=>{

    try{
        const user = req.user;
        res.json({user});

    } catch (err){

        res.status(400).send("Error Occured: " + err.message); 
    }
})

profileRouter.patch("/profile/edit", userAuthentication, async(req, res)=>{
    
    try{
        const userData = req.body;
        const loggedInUser = req.user;

        // api - level validation
        const {isValid, errorMessages} = validateProfileData(userData);

        if(!isValid){
            console.log("Hello");
            return res.status(400).json({errors:errorMessages});
        }

        // Not Allowing Email update, Api Level Validation
        const ALLOWED_UPDATES = ["age", "gender", "about", "skills","photoURL"];

        const isUpdateAllowed = Object.keys(userData).every(
            (k)=> ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            return res.status(400).json({message:"Not Allowed To Update Field"});
        }

        // Update the database
        Object.keys(userData).forEach((key)=>{
            loggedInUser[key] = userData[key];
        })

        await loggedInUser.save();

        res.json({message:"User updated Successfully"});

    } catch (err){

        res.status(400).send("Error Occured: " + err.message);
    }
})

profileRouter.patch("/profile/edit/password", userAuthentication, async(req, res)=>{

    try{

        // accessing user data and loggedInUser
        const userData = req.body;
        const loggedInUser = req.user;

        // comparing password
        const isPasswordMatching = await loggedInUser.validatePassword(userData.password)

        if(isPasswordMatching){
            return res.status(400).json({message:"New & Old passwords are same. Enter a different password"});
        }

        // strong password validation
        const isPasswordStrong = validator.isStrongPassword(userData.password);

        if(!isPasswordStrong){
            return res.status(400).json({message:"Password must be of 8 characters & include uppercase, lowercase, number, & a symbol"});
        }

        // hasing new password
        const newHashedPassword = await bcrypt.hash(userData.password, 10);

        // assigning  a new hashed password & saving the database
        loggedInUser.password = newHashedPassword;
        await loggedInUser.save();

        res.json({message:"Password updated Successfully"});

    } catch (err){

        res.status(500).send("Error Occured: " + err.message);
    }

})

profileRouter.delete("/profile/delete",userAuthentication, async (req,res)=>{

    try{
    
    const loggedInUser = req.user;
    const id = loggedInUser._id;

    // finding User and Delete
      const deletedUser = await User.findByIdAndDelete({_id:id});

      res.send("User deleted Successfully");

    } catch (err){

        res.status(400).send("Error Occured" + err.message);
    }
})

module.exports = profileRouter;