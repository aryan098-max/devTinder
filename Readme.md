- List of Dependencies
1. node.js
2. express.js
3. mongodb
4. mongoose
5. validator
6. nodemon - for script
7. bcrypt - hashing password
8. joi - api level validation
9. jsonwebtoken (json web token)
10. cookie-parser (middleware for parsing cookie sent by the browser)

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
  - Similarly, you can validation on photoURL and a lot of things

  - findByIdAndUpdate({_id:userId},req.body,{runValidators:true}), must do it on patch 

# Update_Method Validation 
- If a user tries to update email prevent it using const ALLOWED_UPDATES = ["fields you want to update only"]
- For checking userId - mongoose.Types.ObjectId.isValid(userId)
- Use validate for putting restriction in skills count

# Note: 
1. joi api level validation creates problem in updating. DON'T USE FOR UPDATES

# Delete Route
- use findByIdAndDelete(userId), Always Convert userId into userId.toString()

# Envrypting Password using Bcrypt
1. While saving {password:hashedPassword}
2. await bcrypt.compare(userPassword, hashedPassword), Don't forget to add await

# JWT (Json Web Token) && Cookie - INSTALL jsonwebtoken && cookie-parser, require both cookie-praser and jwt
- Imp: cookie-parser is a middleware - used for parsing cookies, 
- const cookieParser = require('cookie-parser'), app.use(cookieParser())
- After succesfull login, create jwt token and wrap it inside cookie and send to the browser
- Every time a user sends a api request jwt token is verified
- This is the reason that a user can stay loggedIn in a website for weeks

- Difference between expiresIn (token) and expire in cookie
👉 JWT expiry = security check on the server
👉 Cookie expiry = storage lifetime in the client (browser)

Note:
- Token creation is done using user schema methods
- Token validation is done inside userAuth