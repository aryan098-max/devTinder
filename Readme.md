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
11. joi-password-complexity

- List of all the apis

    1. auth - authRouter
    - POST /signup
    - POST /login
    - POST /logout

    2. userprofile - profileRouter
    - GET   /profile/view
    - PATCH /profile/edit/:id
    - DELETE /profile/:id
    - PATCH /profile/password
    
    3. connections - connectionRequestRouter
    - Total 4 status - interested, ignored, - interested - accepted or rejected
    Note: Creating dynamic routes for interested or ignored, Same for accepted or rejected
        
    - /request/send/interested/:userId, /request/send/ignored/:userId 
    = POST /request/send/:status/:userId

    - /request/review/accepted/:requestId, /request/review/rejected/:requestId
     = POST /request/review/:status/:requestId

    4. feed - userRouter
    - GET /user/requests/received - more clear
    - GET /user/connections
    - GET /user/feed - Gets you the profile of other users on platform


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

# Creating Separate Routes and Using Express Router
- For each group of secific api - using same routes
- Add edit/profile/password - routes own your own
- Completed Auth & Profile Routes

# Creating connection request schema && defining send request api
- Creating Connection Request schema
- Defining - /request/send/:status/:toUserId
- Add all the validations (cover all the corner cases)
- Use of complex queries: $or[{},{}]

# Indexing in the schema
- Indexing makes find/search operations faster, queries would be faster
- Note: unique:true, automatically creates index
- Complex queries make operations slow; therefore, use compound index. Created inside schema
- conectionRequsetSchema.index({fromUserId:1, toUserId:1})

# Creating review request api
- Defining review request api - /request/review/:status/:requestId
- Convered all the corner cases 

# Creaing and Defining userRouter & Creating relation between two collections using ref field
- Defning userRouter, 1. /user/requests/received
- Populating api - using ref (establishing relationship between user & connectionRequest collection)
- toUserId & fromUserId - replaced with user data - because of ref = estalished connection

# Install joi-password-complexity
- npm install joi-password-complexity
- As validate function was not working because of hashing; therefore, using joi-password-complexity
- Note: schema validation works before the data is being saved.

