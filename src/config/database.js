const mongoose = require("mongoose");

const connectDB = async ()=>{

    /*
        For directly establishing connection to the database modify the conncetion string
        = "mongodb+srv://aryangupta:AryanSomen123@namastenode.vhxclkg.mongodb.net/
        DATABASE_NAME"
    */

    // Connection is established witht the cluster first
    await mongoose.connect(
        "mongodb+srv://aryangupta:AryanSomen123@namastenode.vhxclkg.mongodb.net/DevTinder"
    );
}

module.exports = connectDB;