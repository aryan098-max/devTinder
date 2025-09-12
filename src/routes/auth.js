const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");

// Importing models
const User = require("../models/user");

// Imorting middlewares
const userAuthentication = require('../middlewares/userAuth');

// importing validation
const {validateSignupData, validateLoginData} = require("../utils/validation");

// Defining routes
authRouter.post("/signup", async(req,res)=>{

    try{
        // extracting userData from req.body
        const {firstName, lastName, emailId, password, skills, age, gender, about, photoURL} = req.body;

        // api data validation
        const {isValid, errorMessages} = validateSignupData(req.body);

        if(!isValid){
            return res.status(400).send(errorMessages);
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // creating a new user
        const user = new User({
            firstName, 
            lastName, 
            emailId,
            password:hashedPassword, 
            skills, 
            age, 
            gender, 
            about, 
            photoURL
        })

        // saving in the database returns a promise
        await user.save();
        
        res.send("User successfully added in the database");

    } catch (err){

        res.status(400).send("Error Occurred" + err.message);
    }
})


authRouter.post("/login", async(req,res)=>{

    try{
        const {emailId, password} = req.body;

        // api level validation using joi 
        const {isValid, errorMessages} = validateLoginData(req.body);

        if(!isValid){
            return res.status(400).json({message:errorMessages});
        }

        // User Exist Or Not
        const user = await User.findOne({emailId});

        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }

        // Comparing password 
        const isPasswordMatching = await user.validatePassword(password);

        if(isPasswordMatching){

            // creating token
            const token = await user.getJWT();

            // After successful login - Create JWT token
            res.cookie("token", token, {expires:new Date(Date.now() +  60 * 60 * 24* 1000)});

          res.send("User loggedIn Successfully");
        } else {
            return res.status(400).json({message:"Wrong Credentials"});
        }
        
    } catch (err){

        res.status(400).send("Error Ocurred" + err.message)
    }
})

authRouter.post("/logout", userAuthentication, async(req,res)=>{

    try{
        
        // setting token = null, expire now
        res.cookie("token", null, {expires:new Date(Date.now())});
        res.json({message:"User Logged Out Successfully"});

    } catch (err){

        res.status(400).send("Error Occured: " + err.message)
    }
})

module.exports = authRouter;