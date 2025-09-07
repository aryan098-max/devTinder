const express = require('express');
const adminAuth = require('../middlewares/adminAuth');
const adminRouter = express.Router();

adminRouter.post("/admin/auth/login",adminAuth, (req,res)=>{

    res.send("Hello")
})