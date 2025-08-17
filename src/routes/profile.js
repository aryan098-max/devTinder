const express = require ("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const {validateProfileEditData} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res)=>{

  try{

      // user has been attached to req obj in userAtuh; therefore, extracting user from req
      const user = req.user;

      res.send(user);

  } catch (err){

    res.status(500).send("Error Occured " + err.message);

  }

})

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{

  try{

  // req.user = userAuth, req.body = client/postman

    const userData = req.body;
    const loggedInUser = req.user;

    const isEditAllowed = validateProfileEditData(req);

    if(!isEditAllowed){
      throw new Error ("Edit is not allowed");
    }

    // Updating database 
    Object.keys(userData).forEach((key) => (loggedInUser[key] = userData[key]));
    await loggedInUser.save();

    res.json({message:`${loggedInUser.firstName}, has been successfully updated`, data:loggedInUser})
    

  } catch (err){

    res.status(400).send("Error: " + err.message);
  }

})

profileRouter.patch("/profile/edit/password", userAuth, async (req, res)=>{

  try{

    // destructuring old and new password
      const {oldPassword, newPassword} = req.body;
      const loggedInUser = req.user;

      // validate password - call userSchema method validatePassword
      const isPasswordValid = await loggedInUser.validatePassword(oldPassword);


      if(!isPasswordValid){

        throw new Error ("The old password is not correct");
      } 

      // hash new password before saving
      const hashPassword = await bcrypt.hash(newPassword, 10);
      loggedInUser["password"] = hashPassword;


      // database update
      await loggedInUser.save();

      res.send("User password has been successfully updated");

  } catch (err){

    res.status(400).send("Error: " + err.message);
  }


})
module.exports = profileRouter