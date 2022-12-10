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
router.put('/likepost/:postId', verify, async (req, res) => {
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
    const like = await Like.findOne({like_user: req.user._id, like_post: req.params.postId})
    if(like){
        return res.status(400).send({message:'You cannot like a post twice.'})
    }

    // Like the post
    const newLike = new Like({
        like_user: req.user._id,
        like_post: req.params.postId
    })

    try{
        const savedLike = await newLike.save()
        res.send({message:'You have liked this post successfully.'})
    }catch(err){
        res.status(400).send({message:err})
    }

    // Update the post's like count
    try{
        await Post.findOneAndUpdate({_id: req.params.postId}, {$inc: {like_count: 1}})
    }catch(err){
        res.status(400).send({message:err})
    }
})

/* Unliking a post, checking for the following:
    - The user must be verified.
    - The post must exist.
    - The user must have liked the post.
*/

router.put('/unlikepost/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot unlike a post that does not exist.'})
    }

    // Check if user has liked the post
    const like = await Like.findOne({like_user: req.user._id, like_post: req.params.postId})
    if(!like){
        return res.status(400).send({message:'You cannot unlike a post that you have not liked.'})
    }

    // Unlike
    try{
        await Like.deleteOne({like_user: req.user._id, like_post: req.params.postId})
        res.send({message:'You have unliked this post successfully.'})
    }catch(err){
        res.status(400).send({message:err})
    }

    // Decrease the post's like count
    try{
        await Post.findOneAndUpdate({_id: req.params.postId}, {$inc: {like_count: -1}})
    }catch(err){
        res.status(400).send({message:err})
    }
})

/* Get the number of likes for a specific post, checking for the following: 
   - The post must exist.
*/
router.get('/getlikes/:postId', async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot get the likes for a post that does not exist.'})
    }

    // Get the number of likes
    try{
        const likes = await Like.find({like_post: req.params.postId})
        res.send({message:"This post has " + likes.length + " likes."})
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router