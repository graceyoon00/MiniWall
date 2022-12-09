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
        return res.status(400).send({message:'Post does not exist'})
    }

    // Check if user is the owner of the post
    if(post.post_owner != req.user._id){
        return res.status(400).send({message:'You are not the owner of this post'})
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

module.exports = router