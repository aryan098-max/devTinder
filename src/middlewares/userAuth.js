const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuthentication = async (req, res, next)=>{

    try{
    // Getting cookes
    const cookies = req.cookies;
    const {token} = cookies;

    // validating token
    if(!token){
        return res.status(401).json({message:"Cookies Expired Login Again"});
    }

    const decodedMessage = await jwt.verify(token, "Ary@nSomen123");
    const {_id} = decodedMessage;

    // finding user 
    const user = await User.findById(_id);

    if(!user){
        res.status(404).send('User Not Found');
    }

    // assigning user to req obj
    req.user = user;

    // calls the req hanlder 
    next();

    } catch (err){

        res.status(400).send('Error Occured: '+ err.message);

    }
}

module.exports = userAuthentication;