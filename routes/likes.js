/* This file handles the creation of likes for a post. */

const express = require('express')
const router = express.Router()

const verify = require('../verifyToken')

const Post = require('../models/Post')
const Like = require('../models/Like')

/* Liking a post, checking for the following:
    - The user must be verified.
    - The post must exist.
    - The user must not be the owner of the post.
    - The user cannot like the same post twice.

    Then we update the post's like count.
*/
router.post('/likepost/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot like a post that does not exist.'})
    }

    // Check if user is the owner of the post
    if(post.post_owner == req.user._id){
        return res.status(400).send({message:'You cannot like your own post.'})
    }

    // Check if user has already liked the post
    const like = await Like.findOne({like_post: req.params.postId, like_user: req.user._id})
    if(like){
        return res.status(400).send({message:'You cannot like a post twice.'})
    }

    // Create new like
    const newLike = new Like({
        like_post: req.params.postId,
        like_user: req.user._id
    })
    try {
        const savedLike = await newLike.save()
        res.send(savedLike)
    } catch(err) {
        res.status(400).send({message:err})
    }

    // Update post's like count
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId},
            {$inc: {post_likes: 1}}
        )
        res.send(updatedPost)
    }
    catch(err) {
        res.status(400).send({message:err})
    }
})

/* Unliking a post, checking for the following:
    - The user must be verified.
    - The post must exist. 
    - The user must not be the owner of the post.
    - The user must have liked the post.

    Then we update the post's like count.
*/
router.post('/unlikepost/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot unlike a post that does not exist.'})
    }

    // Check if user is the owner of the post
    if(post.post_owner == req.user._id){
        return res.status(400).send({message:'You cannot unlike your own post.'})
    }

    // Check if user has already liked the post
    const like = await Like.findOne({like_post: req.params.postId, like_user: req.user._id})
    if(!like){
        return res.status(400).send({message:'You cannot unlike a post you have not liked.'})
    }

    // Delete like
    try {
        const deletedLike = await Like.deleteOne({like_post: req.params.postId, like_user: req.user._id})
        res.send(deletedLike)
    } catch(err) {
        res.status(400).send({message:err})
    }

    // Update post's like count
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId},
            {$inc: {post_likes: -1}}
        )
        res.send(updatedPost)
    }
    catch(err) {
        res.status(400).send({message:err})
    }
})

module.exports = router