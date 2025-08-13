const express = require ("express");
const app = express ();
const adminAuth = require("./middleware/auth");
const User = require("./models/user");
const connectDB = require("./config/database");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookiePraser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth")


// this middleware will run on every request sent by the user
//  it parses the req.body into an obj
app.use(express.json());
app.use(cookiePraser());

// ============================================================>
app.post("/signup", async (req,res)=>{


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
// ============================================================>

app.post("/login", async (req,res)=>{

  try{

    const {emailId, password} = req.body;

    const user = await User.findOne({emailId:emailId}); 


    if(!user){
      throw new Error ("User doesn't exist in the Database");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){

      // creating a JSON WEB TOEKN
       const token = jwt.sign({_id:user._id}, "Aryan@123")

      // sending cookie
      res.cookie("token", token);


      res.send("Credentials Correct Login Successful");
    } else {

      throw new Error ("Password is not correct");
    }


  } catch (err){

    res.status(500).send("Error " + err.message)
  }

})

app.get("/profile", userAuth, async (req, res)=>{

  try{

      // user has been attached to req obj in userAtuh; therefore, extracting user from req
      const user = req.user;

      res.send(user);

  } catch (err){

    res.status(500).send("Error Occured " + err.message);

  }

})

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

  app.patch("/user/:userId", async(req,res)=>{

    const userId = req.params.userId;
    const data = req.body;

    try{

    // update validation - API validations
    const Allowed_Updates = ["userId", "password","skills","about","photo"];

    const isUpdatesAllowed = Object.keys(data).every((k)=> Allowed_Updates.includes(k));

    if(!isUpdatesAllowed){

      throw new Error("You can't update this field");
    }

    // data will be sent in body by a user
     const beforeUpdateUser =  await User.findByIdAndUpdate({_id:userId}, data, {returnDocument:"before", runValidators:true});
      res.send("User updated successfully");

    } catch(err){

      res.status(500).send(err.message);
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


