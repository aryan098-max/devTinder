const mongoose = require("mongoose");
const {Schema} = mongoose;


const connectionRequestSchema = new Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId, 
        required:true
    }, 

    toUserId:{
        type:mongoose.Schema.Types.ObjectId, 
        required:true
    },

    status:{
        type:String, 
        // enum is validator and constraint - It acts as both
        enum:{
            values:["interested", "ignored", "accepted", "rejected"], 
            message:`{VALUE} is not an allowed status`
        }, 
        required: true
    }

}, {timestamps:true});


// A->A - defining a method in schema level

connectionRequestSchema.pre("save", function (next){

    // - can also use this, using connectionRequest for convenience
    const connectionRequest = this

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error ("You can't send request to youreslf");
    }
    next(); 
})

// compund indexing, compund queries will be very fast
connectionRequestSchema.index({fromUserId:1, toUserId:1}, { unique: true });

// Model- ConnectionRequest, Collection- connectionrequests
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;