const express = require('express');
const app = express();
const dbConnection = require("./config/database");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Importing models
const Admin = require("./models/admin");
const User = require("./models/user");

// importing adminAuth middleware
const adminAuth = require("./middlewares/adminAuth")

// validation
const {validateAdminData, validateSignupData, validateLoginData} = require("./utils/validation");

// middlewares
app.use(express.json());

app.post("/admin/auth/login", adminAuth, (req, res)=>{

    // validate loginData 
    const adminData = req.body;

    const {isValid, errorMessages} = validateAdminData(adminData);
    if(!isValid){
        return res.status.json({message:errorMessages});
    }

    // user exists
    const admin = Admin.findOne({email:email})
    if(!admin){
        return res.status(401).json({message:"Invalid Credentials"})
    }

    // verify password
    const isPasswordMatch = bcrypt.compare(admin.password, adminData.password)

    // checking role
      if (admin.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    // Generate JWT
    const token = jwt.sign(
        { id: admin._id, role: admin.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

  res.json({ token, role: admin.role, message: 'Admin login successful' });

})

app.post("/signup", async(req,res)=>{

    try{
        // extracting userData from req.body
        const {firstName, lastName, emailId, password, skills, age, gender, about, photoURL} = req.body;
        console.log(skills, age, gender, about, photoURL);

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

app.post("/login", async(req,res)=>{

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
        const isPasswordMatching = await bcrypt.compare(password, user.password);

        if(!isPasswordMatching){
            return res.status(400).json({message:"Wrong Credentials"});
        }
        
        res.send("User loggedIn Successfully");

    } catch (err){

        res.status(400).send("Error Ocurred" + err.message)
    }
})

app.patch("/user/:id", async(req, res)=>{
    
    try{
        const userData = req.body;
        const {id}= req.params;

        // validating userId
        if(!mongoose.Types.ObjectId.isValid(id)){
              return res.status(400).send("Invalid User ID");
        }

        // Not Allowing Email update, Api Level Validation
        const ALLOWED_UPDATES = ["age", "gender", "about", "skills"];

        const isUpdateAllowed = Object.keys(userData).every(
            (k)=> ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            return res.status(400).send("Update Not Allowed");
        }

        // finding User and Update
        const user = await User.findByIdAndUpdate({_id:id}, userData, {runValidators:true});

        // User Doesn't Exists
        if(!user){
            return res.json(404).json({message:"User Not Found"});
        }

        res.json({message:"User updated Successfully"});

    } catch (err){

        res.status(400).send("Error Occured" + err.message);
    }
})

app.delete("/user/:id",async (req,res)=>{

    try{
        
    const {id} = req.params;
    const userId = id.toString();
    
    // finding User and Delete
      const deletedUser = await User.findByIdAndDelete({_id:userId});

      if(!deletedUser){
        return res.status(404).send("User Not Found");
      }

        res.send("User deleted Successfully");

    } catch (err){

        res.status(400).send("Error Occured" + err.message);

    }
})


// Database Connection 
dbConnection()
.then(()=>{
    console.log("Database Connection is established");

    app.listen(7000, ()=>{
        console.log("Server is running on Port 7000");
    })
})
.catch(err =>{
    console.error("Database Connection Failed", err)
})

