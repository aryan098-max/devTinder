const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("Welcome to the main website")
})

app.use("/jello",(req,res)=>{
    res.send("Hello from the server")
})

app.listen(3000,()=>{
    console.log("The port is running on server 3000")
})

