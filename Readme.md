- List of Dependencies
1. node.js
2. express.js
3. mongodb
4. mongoose
5. validator
6. nodemon - for script
7. bcrypt - hashing password
8. joi - api level validation
9. 

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

# Update Validation 
- If a user tries to update email prevent it using const ALLOWED_UPDATES = ["fields you want to update only"]
- For checking userId - mongoose.Types.ObjectId.isValid(userId)
- Use validate for putting restriction in skills count

# Note: 
1. joi api level validation creates problem in updating. DON'T USE FOR UPDATES

# Delete Route
- use findByIdAndDelete(userId), Always Convert userId into userId.toString()