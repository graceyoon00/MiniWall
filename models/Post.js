/* Post schema based on MiniPost app, modified according to project guidelines,
   with the addition of likes and commends */

const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
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
    },
    like_count:{
        type:Number,
        default:0,
    },
    comment_count:{
        type:Number,
        default:0,
    }
})

module.exports = mongoose.model('posts', postSchema)