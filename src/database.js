const express = require ("express");
const adminAuth = require("../middleware/auth")
const User = require("./models/user")
// this loc runs all the code inside the database.js
const connectDB = require("../config/database")
const app = express ();


app.post("/signup", async (req,res)=>{

  const userData = new User({
    firstName:"Aryan",
    lastName:"Gupta",
    emailId:"aryan123@gmail.com",
    password:"aryan@123",
    age:23, 
    gender:"Male"
  })

  try{

    await userData.save();
    res.send("User Data Added Successfully");

  } catch(err){

    res.status(400).send(err.message);
  }
})

connectDB()
.then(()=>{
    console.log("Connection Established...");

    // After connection is established with the database, start listening to request on port 3000
    app.listen(3000, ()=>{
    console.log("Port is running on 3000");
  })

})
.catch((err)=> console.log(err));


