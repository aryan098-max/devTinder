const express = require('express');
const app = express();
const dbConnection = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors')


// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

// Importing Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Using routes middleware
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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

