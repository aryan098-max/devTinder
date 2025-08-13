const express = require ("express");
const adminAuth = require("./middleware/auth")

const app = express ();

// When a ever a user sends a /admin request this middleware will run and admin is authenticated
// This adminAuth has a next() handler which passes the control to the request handler
// next() calls the next middleware on the sequence which is (req,res,next)
app.use("/admin", adminAuth)

app.get("/admin/:id", (req,res,next)=>{

    const userId = Number(req.params.id);
    console.log(userId)
    if(userId === 1){
        next();
    } else {
        res.send("User credentials are wrong")
    }
})

app.get("/admin/:id", (req,res,next)=>{
    console.log("The admin credentials are correct");
    res.send("Hey"); // First case
})

app.get("/user", (req,res,next)=>{
    console.log("Second Hanlder");
    res.send("Hello");
})

app.listen(3000, ()=>{
    console.log("Port is running on 3000");
})