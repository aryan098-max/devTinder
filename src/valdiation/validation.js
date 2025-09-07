const joi = require("joi");

const adminLoginSchema = joi.object({
    email:joi.string().email().required(), 
    password:joi.string().min(8).required(),
})

const validateAdminData = (adminData)=>{
    let {error} = adminLoginSchema.validate(adminData);
    // return error ? {isValid:false, errorMessages:errorMessages} : {isValid:true}

    if(error){
        const errorMessages = error.details.map(err=>err.message);
        return {isValid:false, errorMessages:errorMessages}
    }
    return {isValid:true};
}

const userLoginData = joi.object({
    firstName:joi.string().min(3).max(8).required(),
    lastName:joi.string().min(3).max(8).required(),
    emailId:joi.string().email().trim().required(),
    password:joi.string().required(),
    gender:joi.string().valid("male","female","others"),
    age:joi.number(),
    about:joi.string(),
    skills:joi.array().items(joi.string()).min(1),
})

const validateUserData = (userData)=>{

    const {error} = userLoginData.validate(userData);
    if(error){
        const errorMessages= error.details.map((err)=>err.message)
        return {isValid:false, errorMessages};
    }
    return {isValid:true};
}

module.exports = {validateAdminData, validateUserData}