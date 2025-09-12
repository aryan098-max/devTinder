const express = require('express');
const app = express();
const dbConnection = require("./config/database");
const cookieParser = require('cookie-parser');


// middlewares
app.use(express.json());
app.use(cookieParser());

// Importing Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

// Using routes middleware
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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

