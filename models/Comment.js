/* Schema for comments */

const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comment_post: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'Post',
    },
    comment_content: {
        type: String,
        require:true,
        min:6,
        max:1024
    },
    comment_user: {
        type: mongoose.Schema.Types.ObjectId,  
        require:true,
        ref: 'users',
    },
    comment_timestamp:{
        type:Date,
        default:Date.now(),
    }
})

module.exports = mongoose.model('comments', commentSchema)