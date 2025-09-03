const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req,res)=>{


  try{

    // validating user data
    validateSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;

    // Hasing password 
    const hashPassword = await bcrypt.hash(password, 10);

    // making things dynamic
    const userData = new User({
      firstName:firstName, 
      lastName: lastName, 
      emailId:emailId, 
      password: hashPassword
    });
  
    await userData.save();
    res.send("User has been successfully added to the database");

  } catch(err){

    res.status(500).send(err.message);
  }

})

authRouter.post("/login", async (req,res)=>{

  try{

    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId}); 

    if(!user){
      throw new Error ("User doesn't exist in the Database");
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // validatePassword is a method of userSchema - User.prototype
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){

      // creating a JSON WEB TOEKN
      //  const token = jwt.sign({_id:user._id}, "Aryan@123", {expiresIn:"1d"})
      //  console.log(token);

      const token = await user.getJWT();

      if(!token){
        throw new Error ("Tokens Not Created");
      }

      // sending cookie
      res.cookie("token", token, {expires:new Date(Date.now() + 24 * 60* 60 * 1000)});

      res.send("Credentials Correct Login Successful");
    } else {

      throw new Error ("Password is not correct");
    }

  } catch (err){

    res.status(500).send("Error " + err.message)
  }
})

authRouter.post("/logout", (req,res)=>{

    // clearing token and cookies for logging out current user

    res.cookie("token", null, {expires:new Date(Date.now())});

    res.send("Logout Successfully");

})

module.exports = authRouter;  