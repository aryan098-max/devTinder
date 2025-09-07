const joi = require("joi");

const adminLoginSchema = joi.object({
    email:Joi.string().email().required(), 
    password:Joi.string().min(8).required(),
})

const validateAdminData = (adminData)=>{
    let {error} = adminLoginSchema.validate(adminData);
    const errorMessages = error.details.map(err=>err.message);
    // return error ? {isValid:false, errorMessages:errorMessages} : {isValid:true}

    if(error){
        return {isValid:false, errorMessages:errorMessages}
    }
    return {isValid:true};
}

const userLoginData = joi.object({
    firstName:joi.string().min(3).max(8).required(),
    lastName:joi.string().min(3).max(8).required(),
    emailId:joi.string().email().trim().required(),
    password:joi.string().required(),
    gender:joi.string().required(),
    age:joi.Number().required(),
})

const validateUserData = (userData)=>{

    const {error} = userLoginData.validate(userData);

    const errorMessages= error.details.map((err)=>{
        return err.message;
    })

    if(error){
        return {isValid:false, errorMessages:errorMessages};
    }

    return {isValid:true};
}

module.exports = {validateAdminData, validateUserData}