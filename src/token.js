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

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){

      // creating a JSON WEB TOEKN
      //  const token = jwt.sign({_id:user._id}, "Aryan@123", {expiresIn:"1d"})
      //  console.log(token);

      const token = await user.getJWT();


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

// ============================================================>

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

app.post("/connectionRequest", userAuth, async (req, res)=>{

  const user = req.user;

  res.send(user.firstName + " sent the connection request");

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


