const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username : {
        required : true,
        type : String,
        min : 3,
        max : 20,
        unidque : true,

    },
    
    email : {
        type : String,
        required : true,
        unidque : true,
        max : 50,
    },
    password : {
        type : String,
        required : true,
        min : 8,
    },
    isAvatarImageSet : {
        type : Boolean,
        default :  false
    },
    avatarImage : {
        type : String,
        default : ""
    }
})

module.exports = mongoose.model("User",userSchema)