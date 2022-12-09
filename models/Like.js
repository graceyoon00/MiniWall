/* Schema for Likes for a post */

const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    like_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    like_post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})

module.exports = mongoose.model('Like', LikeSchema)