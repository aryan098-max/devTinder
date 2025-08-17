const express = require ("express");
const app = express ();
const User = require("./models/user");
const connectDB = require("./config/database");
const cookiePraser = require("cookie-parser");
const {userAuth} = require("./middleware/auth")

// middlewares run on every request to the server
app.use(express.json());
app.use(cookiePraser());

// Importing all the routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

/** 
  1. using all the routes, routes are acting like middlewares now
  2. Whenever a user sends a request it goes through all the routes one by one 
     and when a matching route is found response is sent by the server
*/
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB()
.then(()=>{
    console.log("Connection Established...");

    // After connection is established with the database, start listening to request on port 3000
    app.listen(3000, ()=>{
    console.log("Port is running on 3000");
  })

})
.catch((err)=> console.log(err));


