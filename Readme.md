- List of all the apis

    # auth 

    # userprofile

    # connections

    # feed

- Create a src folder 
    - create config, middleware, app.js folders and file

# Database Connection
- Create a database file inside config & export dbConnection
- Import dbConnection inside app.js

# Creating a User Model
- Create a user schema and model
- Adding a dummy user

# .json() middleware for pasing JSON Data 
- app.use(express.json()) - # runs on every request

# Schema Sanitaization 
  - required, trim, lowercase, validate function, uique, index, min, max, minLength, maxLength
  - Note: Another syntax for validate must return: boolean value, Must enable on updates,
  - validate:{
        validator:function(value){
            return true or false - true (does nothing), false calls catch block with the message
        }, 
        message:"Email Id is not Valid"
  }

  - findByIdAndUpdate({_id:userId},req.body,{runValidators:true}), must do it on patch 
  