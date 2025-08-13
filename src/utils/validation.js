const validator = require("validator");

const validateSignUpData = function (req){

    // destructuring
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName){
        throw new Error("First Name is not valid");
    } else if (!lastName){
        throw new Error ("Last Name is Not Valid");
    }
    else if(!(validator.isEmail(emailId) && emailId.endsWith(".com"))){
         throw new Error ("EmailId is Not Valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error ("Password is not Strong Enough");
    }
}

module.exports = {validateSignUpData};