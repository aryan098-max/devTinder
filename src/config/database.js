const mongoose = require ('mongoose')


const dbConnection = async () =>{

    try{
         const URI = "mongodb+srv://aryangupta:AryanSomen123@namastenode.vhxclkg.mongodb.net/devTinder";
         await mongoose.connect(URI);
    } catch (err){
        console.error("MongoDB Connection error:", err);
    }
   
}

module.exports = dbConnection;