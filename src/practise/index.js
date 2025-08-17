
const express = require("express");

const app = express();

app.get("/user/:userId", (req, res)=>{
    console.log(req.params);
    res.send({firstName:"Aryan", lastName:"Gupta"})
});

app.get("/client", (req, res)=>{
    console.log(req.query);
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

