const mongoose = require ('mongoose')


const dbConnection = async () =>{

    try{
        const URI = process.env.DB_CONNECTION_SECRET
        await mongoose.connect(URI);

    } catch (err){
        console.error("MongoDB Connection error:", err);
    }
}

module.exports = dbConnection;