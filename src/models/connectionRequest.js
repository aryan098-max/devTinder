const mongoose = require('mongoose');
const {Schema} = mongoose;

const connectionRequestSchema = new Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId, 
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }, 
    status:{
        type:String, 
        required:true,
        enum:{
            values:["interested","ignored", "accepted","rejected"],
            message:`{VALUE} is not a valid status type`
        }
    }
},{timestamps:true})

// ===============.pre() method on connectionRequestSchema =======>

// runs before save

// connectionRequestSchema.pre("save", function(next){
    // this = current connectionRequest instance
//    const  connectionRequest = this;

//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error ("Cannot Send connection request to yourself!");
//     }
//     next();
// })
// ===============================================================>

// compound indexing - make search queries faster - connectionRequest.findOne({fromUserId:segn12k, toUserId:gknkg122})
connectionRequestSchema.index({fromUserId:1, toUserId:1})


// creating model
const ConnectionRequest = mongoose.model("connectionrequest", connectionRequestSchema);

module.exports = ConnectionRequest;