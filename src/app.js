const express = require("express");

const app = express();

app.get("/user", (req, res)=>{
    res.send({firstName:"Aryan", lastName:"Gupta"})
});

app.post("/user",(req,res)=>{
    res.send("Data resolve successfully")
})

app.use("/",(req,res)=>{
    res.send("Welcome to the main website of DevTinder");
})

app.listen(3000,()=>{
    console.log("The port is running on server 3000")
})

