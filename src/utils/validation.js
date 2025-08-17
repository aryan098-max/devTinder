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

const validateProfileEditData = function (req){

    const userData = req.body;
    
    const allowedEditValues = [
        "firstName",
        "lastName", 
        "gender", 
        "age", 
        "skills", 
        "about", 
        "photo"
    ];

    // returning a boolean value
    const isEditAllowed = Object.keys(userData).every((key)=> allowedEditValues.includes(key));
    console.log(isEditAllowed);

    return isEditAllowed;

}

module.exports = {validateSignUpData, validateProfileEditData};