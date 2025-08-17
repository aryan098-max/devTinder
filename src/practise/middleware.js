const express = require ("express");
const adminAuth = require("../middleware/auth");
const User = require("../models/user");
// this loc runs all the code inside the database.js
const connectDB = require("../config/database");
const app = express ();

// this middleware will run on every request sent by the user
//  it parses the req.body into an obj
app.use(express.json());

// ============================================================>
app.post("/signup", async (req,res)=>{

  // making things dynamic
    const userData = new User(req.body);
  
  try{
    await userData.save();
    res.send("User has been successfully added to the database");

  } catch(err){

    res.status(500).send(err.message);
  }

})
// ============================================================>


// ============================================================>
app.get("/user", async (req,res)=>{
  // getting email from the database using email
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({emailId:userEmail});
    res.send(user);

  } catch (err){

    res.status(400).send("Error Occured");
  }
})
// ============================================================>


// ============================================================>
app.get("/feed", async (req,res)=>{

  try{

    // returns array of obj
    const allUser = await User.find({})
    res.send(allUser);

  } catch (err){

    res.status(400).send(err.message);
  }

})
// ============================================================>

// ============================================================>
app.delete("/user", async (req,res)=>{

  const userId = req.body.userId;
  console.log(userId);

  try{
    const user = await User.findByIdAndDelete({_id:userId});
    console.log(user);
    res.send("User was deleted");

  }catch(err){

    res.status(400).send("Error in the code");
  }

})

// ============================================================>

// ============================================================>

  app.patch("/user", async(req,res)=>{

    const userId = req.body.userId;
    const data = req.body;

    try{

      // data will be sent in body by a user
     const beforeUpdateUser =  await User.findByIdAndUpdate({_id:userId}, data, {returnDocument:"before", runValidators:true});
     console.log(beforeUpdateUser);
      res.send("User updated successfully");
    } catch(err){

      res.status(404).send(err.message);
    }

  })


// ============================================================>


connectDB()
.then(()=>{
    console.log("Connection Established...");

    // After connection is established with the database, start listening to request on port 3000
    app.listen(3000, ()=>{
    console.log("Port is running on 3000");
  })

})
.catch((err)=> console.log(err));


