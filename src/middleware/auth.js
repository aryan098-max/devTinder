const jwt = require('jsonwebtoken');
const User = require("../models/user")

const userAuth = async (req, res, next)=>{

    try{

        // verrify token
        const {token} = req.cookies;

        if(!token){
            throw new Error ("Token Invalid!!");
        }

        // verify token
        const decodedInfo = jwt.verify(token, "Aryan@123");
        const {_id} = decodedInfo;

        // find user based on id
        const user = await User.findById({_id:_id});

        if(!user){
            
            throw new Error ("User not found");
        }

        // attaching user to a req obj after finding it 
        req.user = user;

        // next passes the control to the next route handler
        // The req obj of the next route handler has this user; therefore, we can extract it from req obj
        next();

    } catch (err){

        res.status(400).send("Error Occurred: " + err.message);

    }
   
}

module.exports = {userAuth}