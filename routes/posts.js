/* This file handles the CRUD operations concerning posts. */

const express = require('express')
const router = express.Router()

const verify = require('../verifyToken')

const Post = require('../models/Post')
const {postValidation} = require('../validations/validation')

/* Creating a new post, checking for the following:
   - The user must be verified.
   - The post must be valid according to the requirements of postValidation in validation.js
*/
router.post('/makepost', verify, async (req, res) => {
    // Check if post is valid
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Create new post
    const post = new Post({
        post_title: req.body.post_title,
        post_description: req.body.post_description,
        post_owner: req.user._id
    })
    try {
        const savedPost = await post.save()
        res.send(savedPost)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Updating a post, checking for the following:
    - The user must be verified.
    - The post must exist.
    - The user must be the owner of the post.
*/
router.patch('/updatepost/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot edit a post that does not exist.'})
    }

    // Check if user is the owner of the post
    if(post.post_owner != req.user._id){
        return res.status(400).send({message:'You cannot edit a post that is not yours.'})
    }

    // Update post
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId},
            {$set: {post_title: req.body.post_title, post_description: req.body.post_description}}
        )
        res.send(updatedPost)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Deleting a post, checking for the following:
    - The user must be verified.
    - The post must exist.
    - The user must be the owner of the post.
*/
router.delete('/deletepost/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot delete a post that does not exist.'})
    }

    // Check if user is the owner of the post
    if(post.post_owner != req.user._id){
        return res.status(400).send({message:'You cannot delete a post that is not yours.'})
    }

    // Delete post
    try {
        const deletedPost = await Post.deleteOne({_id: req.params.postId})
        res.send(deletedPost)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Getting all posts, checking for the following:
    - The user must be verified.
    - Posts that have a higher value for like_count are shown first.
    - If two posts have the same number of likes, they are shown in descending order of post_timestamp
*/
router.get('/getposts', verify, async (req, res) => {
    try {
        const posts = await Post.find().sort({like_count:-1, post_timestamp:-1})
        res.send(posts)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

module.exports = router