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

module.exports = router