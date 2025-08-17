# Api List

## authRouter - userAuthRouter
- POST  /singup 
- POST  /login
- POST  /logout


## profileRouter
- GET   /profile/view 
- PATCH /profile/edit 
- PATCH /profile/password 

# Different status - interested, ignored, accepted, rejected 
# Based on these we are going to make different api calls
# Tinder usses like and pass for right and left swipe respectively

## connectionRequestRouter
- PATCH /request/send/interested/:userId
- PATCH /request/send/ignored/:uesrId

- PATCH /request/review/accepted/:requestId
- PATCH /request/review/rejected/:requestId

# Make status dynamic converting two different APIS into one 

- PATCH /request/send/:status/

## userRouter
- GET /user/connections (matches, can send messages to these users)
- GET /user/requests (Requests received by the user)
- GET /user/feed (list of 20-30 random users)
