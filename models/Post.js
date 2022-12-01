/* Post schema based on MiniPost app, modified according to project guidelines*/
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    post_identifier:{
        type: String,
        require:true,
        min:3,
        max:128
    },
    post_title:{
        type:String,
        require:true,
        min:6,
        max:128,
    },
    post_timestamp:{
        type:Date,
        default:Date.now(),
    },
    post_owner:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User",
        require:true,
    },
    post_description:{
        type:String,
        require:true,
        min:6,
        max:1024,
    }
})

module.exports = mongoose.model('Post', postSchema)