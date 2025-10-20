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

# Create user connection api 
- /user/connections - give all the "accepted connections'
- Make sure that connection fromUserId toUserId both are visible, A->B, C-A, D->A

# Feed Api, Use of complex queries $and, $or, $nin, $ne && Pagination 
- Defining user's feed api - /feed
- Use complex queries - for easy manipulation of Database collection
- Use of select for selecting specific field - .select("fromUserId toUserId");
- .select(" ") takes only one argument; therefore, separate users with space

const {page, limit} = req.query 

// page parsed, const page = parseInt(page)

# Pagination 
- /feed?page=1&limit=10 => first 10 users 1-10 = .skip(0).limit(10)
- /feed?page=2$limit=20 => 11-20 = .skip(10).limit(10)
- function for pagination - for skipping  & limiting users - .skip() & .limit()
- skip() - how many users you want to skip from the start
- For example, skip(0).limit(10) - skip 0 users and give me 10 users
- skip formula = (page-1)*10;
- .skip(skip).limit(limit) = chained on the search results, find(), findById()

# CORS
- Frontend is not allowed to make a api call to backend because both are running on different ports
- To solve this error - Install a package name - cors and use it as a middleware
- npm install cors, app.use(cors({add configuration}))
- You must import it before using it
- Add configuration for cookies as well
- app.use(cors({
    origin:"http://localhost:5173/login",
    credentials:true,
}))

# Handling Token Not Valid
- 401 status - Not authorized

# Send user data from most of the apis

# Set cookies during sign up as well

=========================================================================================================================
# DEPLOYING THE FRONT-END
- Create an AWS account
- Sign into console
- Search for EC2 

# Setting EC2 - an instance of a machine in cloud
- Name: DevTinder
- Chose ubuntu as a operating system
- Leave others options as default
- # Imp create a key value pair - download the pem file 
- Launch an instance 

# Newly Created Instance 
- E2 instance connect - default 
- Go to SSH client 
- Go to Git bash and go to the dowloaded pem file
- cd downloads 

    ## For pem file 
        - chmod 400 "devTinder-secret.pem"
        - ssh -i "devTinder-secret.pem" ubuntu@ec2-16-171-151-54.eu-north-1.compute.amazonaws.com
        - You will be logged in to the instance 

    
    ## Install dependencies - nvm (use nvm not npm) - Node version of the local machine and ubunut must be same
        - Chose macos - nvm - npm - to get below command
        - Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
        - Install node - same version as your computer 
            - nvm install v22.15.0
        - Command nvm install v22.15.0 

    ## Git clone the files - Error might occur while building the production build
        # Note: An error can occured here if the folder names are mismatched
        - Solution: git pull origin main - make change consistent - push the code again

    ## Front-end - git clone (HTTPS link)
        - cd Front-end - npm install (install all the dependencies)
        - npm run build (build a production build)
        - For deploying the frontend project we need something known as # nginix
        - Install nginx 
            - In local machine - sudo apt udpate (update the ubuntu)

            # Nginx Command
            - sudo apt install nginx (press y)
            - sudo systemctl start nginx (after making changes to nginx config file) 
            - sudo systemctl restart nginx
            - nginx -t (checks for the error in nginx file)
            - sudo systemctl enable nginx
            - sudo systemctl status nginx (check the status of nginx)

            - Copy all the code of the dist folder into http server repository of nginx
                - Copy code from dist(build files) to /var/www/html/
                - check path: cd /var/www/html/
                - sudo scp -r dist/* /var/www/html/ (copy command r = recursiveness, copy - dist/* (all the content), path-/var/www/html)
                - check by going to the path and check the content, asses, index.html .....
            
            - After doing this go back to -02d455ad867dc8e05
            - Clik public IPv4 address - Public IPv4 address 16.171.151.54 | open address - error will occur

    ## Going back to instance for public IPv4 address
    - This is the ip where we can access the server
    - In this ip - your front-end app should be running 
   
   # Note: The app will be not live yet - you will face error 
    - We have to enable port :80 
    - To enable go to - isntances -02d455ad867dc8e05
    - Go To Security - Security Groups - Inbound rules - Edit Inbound Rules
    - After Edit Inbound Rules - Type - HTTP, Add rule - Port range - 80
    - 🔍 0.0.0.0/0 (access from anywhere)
    - Save rule

    # Running the port properly - CHANGE HTTPS - HTTP
    - By default port will run on https://16.171.151.54/ - GIVES ERROR
    - CHANGE IT TO - http://16.171.151.54/

    Note: Our frontend code doesn't run on HTTPS because while creating inbound rules
    We are selecting, Type- HTTP

    # Error in the backend resolved
    - Earlier whenever I was reloading the page in a particular api - nginx Nog Found 404 error was there
    - Nginx Not Found Error 

    - How to resolve the error? 
    1. sudo nano /etc/nginx/sites-available/default
    2.       location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.

                root /var/www/html;
                index index.html;
                try_files $uri /index.html; (From try_files $uri $uri/ =404 to  /index.html;)
        }


=====================================================================================================================

# DEPLOYING Back-End

# Note: We can make changes to cloned folder into a new instance via git pull as simple as that 
 - cd to Front-end or Back-end as you wish to and 
 - git pull

# Initial Steps
- Go to GitBash
- cd downloads - (where there is your pem file)
- Connect via SSH

# cd to backend folder 
- cd devTinder 
- install all the dependencies

# During the above process there can be error regarding the IP address
- You need to add a IP address of the newly created instance of AWS
- You can get this IP address from the - i-02d455ad867dc8e05
- Copy the Public IPV4 address - 16.171.151.54

# How to add the new Public IPV4 address 
- Go to Database and Network access in the MonogDB
- Go to IP access list 
- Add IP address - 16.171.151.54 ( From the AWS EC2 instance)

# To make a production build in Node.js
- Inside your package.json inside the start you should have 
- Inside the script - "start": "node src/app.js",
- change into backend directory using: cd Backend
- Therefore, do npm start / npm run start, inside the git bash
- Yourbackend will start running as a production 

# Next, you need to enable the port in which your backend server is running 
- This process is similar to enabling 80 port for the frontend
- My backend project is running on 7000 
- Go to Security - Go to Security Groups - Edit Inbound rules
- Add rule
    - Type - Custom TCP
    - Port Range - 7000
    - Source - Any - 0.0.0.0/0
    
# Now your url should be like 
- http://16.171.151.54:7000 (:port on which your backend is running)

# PM2 serve vite build - keeps your application online 24/7
- npm install pm2 -g - In your ubuntu (-g flag is very imp) (installs globally)
- runs our backend in the background (so that we don't have to keep opening the terminal)
- Now, we will do npm start via a process manager
- The command below starts a new process - this process is online - running background
- pm2 start npm -- start (give space after -- start, runs 24/7)

# check logs on pm2 , helps to debug error
- pm2 logs (helps to debug error)
- pm2 flush npm (name of the application on the box of the process is npm not devTinder)

# Commands for pm2
# change the name of the application (npm), some other useful commands
- pm2 list (list down all the server started by pm2)
- pm2 stop npm (npm is the name of the package, it stopped the process running on the background)
- pm2 delete npm (deletes the process)
- custom name can be given when starting the process - pm2 start npm --name "devtinder-backend" -- start
- pm2 start npm --name "custom-name" -- start 

# Understanding how things are running 
Fronted: http://16.171.151.54
Backend: http://16.171.151.54:7000/

# DNS mapping
Domain name = devTinder.com => 16.171.151.54

front-end = devTinder.com

# we have to map port number to /api (path) - use nginx proxy pass 
- chatgpt prompt - nginx config map path of /api to 7000 node application
back-end = devTinder.com:7000 => devTinder.com/api

# Note: any request that comes to a server first goes to nginx
- whenever - devTinder.com/api request comes nginx maps to
- It will map it to new proxy pass http://localhost:/7000 
- To achieve this we will be using nginx proxy pass
- During this process the first step is to edit the nginx configuration
- We can do that from ubuntu terminal

# How to edit a file in the terminal - Go to the below path
- Command: sudo nano /etc/nginx/available-sites/default
- Here we can edit the confifuration files
- Here we can also see - server {listen:80 (default_server)}
- This is the reason why we enable the port 80 

## Now we will set a configuration a proxy passs
- Note: sever_name _; - change it to the port in which we are running our application
- When we have a domain name, we can change this to domain name as well 
- Step1: Edit the sever name to the current ip address = (server_name 16.171.151.54)
- Note: Add an another rule below the server name

- Enter this prompt in chatgpt: nginx config map path of /api to 7000 node application
- You will get this file in return you have to make some changes on it

NOTE: While editing the proxy pass you can't miss even a single "/" 
    # Make sure that you restart after making these changes

 location /api/ {
        proxy_pass http://localhost:7000/;   # Forward requests to Node app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

# changes applies 
1. server_name _ = server_name 16.171.151.54
2. proxy_pass http://127.0.0.1:7000/; = proxy_pass http://localhost:7000/; (localhost)

- How to come out of the nginx configuration after making the changes
1. Press (CLT + X), (Y) and finally press (Enter)

- Next, you must restart the nginx, otherwise it will not take the new config
1. restart nginx - sudo systemctl restart nginx 

# Changes in the browser 
1. From 404 Not found to Cannot GET /api/

# Changes in the front-end 
1. In the front-end you must change the BASE_URL  = "http"//localhost:7000/ to '/api';
- export const BASE_URL = 'http://localhost:7000' to = export const BASE_URL = '/api';

# push to git repo after making this change and git clone in the frontend of the devTinder
1. git add ., git commit -m 'Update Base URL', git push origin main\
2. git log in the ubuntu always 
3. git pull (all changes are pulled from the origin)

# ONE MORE MAJOR CHANGE IS THAT: YOU HAVE TO AGAIN RE-DEPLOY AFTER PERFORMING: git log
# Step by Step approach again 
1. npm run build 
2. sudo scp -r dist/* /var/www/html/

# Now check in the browser the apis are being called correctly

============================================================================================================

- For mapping your website to a DNS, you need
1. Domain (Godaddy)
2. SSL certificate (cloudflare) 
    - Cloudflare manages the DNS of devTinder.in


# Deploying the website in the actual Domain Name - DNS - Domain Name server
1. Chose GoDaddy
2. No need of professional email
3. Go To Dashboard -> Products -> devTinder.in -> Manage DNS 
4. DNS Management (DNS Mapping) -> We are going to chose Cloudflare for managing DNS

# ClourFlare Setup - Free  - Manage DNS name
- Create a account in cloudflare
- Note: you can do DNS mapping into GOdaddy as well but this is a better option
- Homepage - Add a Domain Name
- Add an existing Domain Name -> Chose quick scans for dns records -> Free version
- Review your DNS records - to remove the error - Click on activation
- You will get - Your assinged Cloudfare nameservers:   
    1. (You will get this from cloudfare) 
    2. (You will get this from cloudfare)

# Next Steps for CloudFare
- Copy these name severs from cloudfare and go to Godaddy 
- In Godaddy -> Name Servers -> Click Change Nameservers
- Edit Name Severs (will pop up) -> Click use my own nameservers
- Copy the name servers from Cloudflare -> Click Save -> Continue
- Refresh the page for changes
- Go Back To - CloudFlare - Click Check the name servers
- You have to around 15-20 mins for an update - Pending name server update shown in the page
- You can see the update back in the godaddy as well


# After setting the name servers in CloudFare - Go to DNS Records of CloudFlare
- Update Domain Name records   
- DNS - Records
- Name should point to my ip address but it is pointing to random ip address
- Edit the first A records and Delete the Second A records
- Edit the first A records -> Change the IPv4 addersss to (16.171.151.54)
- Delete the second one
- Proxy Status turned on, Click Save

# CNAME
- Explanation: When a user enters - www - (redirect to) devTinder.in - (points to) 16.171.151.54
- CNAME - www - devTinder.in - 16.171.151.54

# Enabling SSL - to make our website safe
- Go to SSL/TLS on CloudFlare
- In Overview - Click Configure
- Go to Custom SSL/TLS (By default: Automatic SSL is selected)
- Select Flexible (https will be there)
- Click Save

# For Full SSL 
- For Full (you have to put SSL certificate in your website as well) 
- Put SSL certificate in original server also
- You have to make some nginx configuration

# Edge Certificate inside CloudFlare
- Look for option 
- Automatic HTTPS Rewrites
- Enable this (http will be redirected to https) (https secure)

=============================================================================================================

# Sending email through Amzaon SEZ (Simple Email Service)

# Create IAM First - Search IAM 
- Step 1 - Chose mumbai region (currently I have chose Europe Stockholm)
- Step 2 - Create IAM (through a serach in the bar) - Identity and Access Management (IAM)
- Step 3 - Create a user - Go to Users - 0 (currently)
- Step 4 - Name of ther user (any) - ses-user, Click Nest
- Step 5 - (Multiple Options) (Attach policies directly)
- Step 6 - Giving permissions (by searching) - amazonses
- Step 7 - Give full access - (allow send email & read email), Click Next
- Step 8 - Review and Create - Click - create user 
- Step 9 - Go back to aws console - clicking on the left upper conner (aws)
- Step 10 - Search for (Simple Email Service)

# Setting up Create Identity
- Step 1 - Go to Account Dashboard from the left side 
- Step 2 - Click - Create Identity
- Step 3 - Chose Domain 
- Step 4 - Advanced DKIM settings -> Identity type -> DKIM signing key length -> RSA_2048_BIT
- Step 5 - Publish DNS records to Route53 -> Enabled
- Step 6 - DKIM signatures -> Enabled
- Step 7 - Click -> Create Identity

- Note: Action required 
  To verify ownership of this identity, DKIM must be configured in the domain's DNS settings using the CNAME records provided.
  
- Note: Three CNAME are under authentication inside - Publish DNS records 
1. CNAME: vajgnmtyvm3yaewizzyk6gzedryucgec._domainkey.aryantesting.com - value: vajgnmtyvm3yaewizzyk6gzedryucgec.dkim.amazonses.com
2. CNAME: ls7chigl5wip5pbm5fsjgai2atwgc6np._domainkey.aryantesting.com - value: ls7chigl5wip5pbm5fsjgai2atwgc6np.dkim.amazonses.com
3. CNAME: 3tohbmkblexo3dbprnum3poyi32x6xii._domainkey.aryantesting.com - value: 3tohbmkblexo3dbprnum3poyi32x6xii.dkim.amazonses.com

- Amazon SES wants to verify that whether I am the owner of aryantesting.com or not

# Now, You have to set these DNS records in CloudFlare - Turn off proxy status, while setting DNS record
1. Create a CNAME - under the CNAME and paste value at content- similary create for three

# Wait for sometime for verification 
DKIM configuration: Successful

Go Back to Get Set up page

2. Request production access
    - Request Details: 
    - Transactional 
    - website url 
    - Additional contacts - optional
    - Acknowledge and sumbit request 
    - Verify email as well - a mail will be sent to your email address

# Until the verification is done we can still send 200 emails per day 
# To send the email we need few things from the IAM 
- Now swtich back to IAMs
- Go to IAM user -> Click -> ses-user -> Security Credentials
- In security credentials -> Create access key -> other -> Giving tag is optional
- Tag -> Dev
- Secret Access Key - Ln4IQ2HREsoPBTMTmi4RIvffv8dbIlkovm+dj1FH
- 



===============================================================================================================

# dotenv(), .env

# Security issues in our code
1. MonogDB password visible
2. Token secret key is visible 
3. PORT number is visible

# Enabling Security Feature in our Project
- This file is created in the backend with a name .env
- You don't need to use var, let or const for creating a env variable
- You don't need to put secret things inside the double quotes still it is valid
- However, it is prefered to give double quotes

# Creating env variable 
- create a .env file in root level
- The secret keys can should be declared with CAPITAL LETTERS with necessary (_)
- All the secret keys are attached inside the a global object known as process
- Therefore, we can access the hidden secret anywhere inside the code
- However, to make this work this is not enough 

# How to make process.env works? 
- To make process.env works we need to install and import this package= .dotenv
- Command: npm install dotenv()
- Next, we need to config file
- Insdie the root level of the application - app.js
- require("dotenv").config().

# Last Step 
- .env() file must be added in the .gitignore() 
- In this way, the keys will be only inside our sys
