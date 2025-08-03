const express = require ("express");

const app = express ();

app.get("/user",(req,res,next)=>{
    console.log("First Handler");
    // res.send("Hey"); First case
    next();
    // res.send("Hey"); Second case
    /*
        In the second case, first of all next() handler will execute the subsequent route handler, 
        therefore, the response from the second route hander is sent to the client. 

        After, this second route handler is finished executing again res.send("Hey") is called which 
        causes an error saying Headers are can't be set again. 
     */
    },

    (req,res)=>{
        console.log("second handler");
        res.send("Hello");
    }
)

app.listen(3000, ()=>{
    console.log("Port is running on 3000")
})