/* This file handles the CRUD operations concerning comments. */

const express = require('express')
const router = express.Router()

const verify = require('../verifyToken')

const Post = require('../models/Post')
const Comment = require('../models/Comment')

const {commentValidation} = require('../validations/validation')

/* Creating a new comment, checking for the following:
    - The user must be verified.
    - The comment must be valid according to the requirements of commentValidation in validation.js
    - The post must exist.
    - The user must not be the owner of the post.
*/
router.post('/makecomment/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot comment on a post that does not exist.'})
    }

    // Check if user is the owner of the post
    if(post.post_owner == req.user._id){
        return res.status(400).send({message:'You cannot comment on your own post.'})
    }

    // Check if comment is valid
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Create new comment
    const comment = new Comment({
        comment_post: req.params.postId,
        comment_content: req.body.comment_content,
        comment_user: req.user._id,
    })
    try {
        const savedComment = await comment.save()
        res.send(savedComment)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Updating a comment, checking for the following:
    - The user must be verified.
    - The user must be the owner of the comment.
*/
router.patch('/updatecomment/:commentId', verify, async (req, res) => {
    // Check if comment exists
    const comment = await Comment.findOne({_id: req.params.commentId})
    if(!comment){
        return res.status(400).send({message:'You cannot update a comment that does not exist.'})
    }

    // Check if user is the owner of the comment
    if(comment.comment_user != req.user._id){
        return res.status(400).send({message:'You cannot update a comment that is not yours.'})
    }

    // Update comment
    try {
        const updatedComment = await Comment.updateOne(
            {_id: req.params.commentId},
            {$set: {comment_content: req.body.comment_content}}
        )
        res.send(updatedComment)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Deleting a comment, checking for the following:
    - The user must be verified.
    - The user must be the owner of the comment.
*/
router.delete('/deletecomment/:commentId', verify, async (req, res) => {
    // Check if comment exists
    const comment = await Comment.findOne({_id: req.params.commentId})
    if(!comment){
        return res.status(400).send({message:'You cannot delete a comment that does not exist.'})
    }

    // Check if user is the owner of the comment
    if(comment.comment_user != req.user._id){
        return res.status(400).send({message:'You cannot delete a comment that is not yours.'})
    }

    // Delete comment
    try {
        const deletedComment = await Comment.deleteOne({_id: req.params.commentId})
        res.send(deletedComment)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Getting all comments for a specific post, checking for the following:
    - The user must be verified.
    - The post must exist.
    - The post must have at least one comment.
*/
router.get('/getcomments/:postId', verify, async (req, res) => {
    // Check if post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot get comments for a post that does not exist.'})
    }

    // Check if post has comments
    const comments = await Comment.find({comment_post: req.params.postId})
    if(comments.length == 0){
        return res.status(400).send({message:'This post has no comments.'})
    }
    
    // Get comments
    try {
        const comments = await Comment.find({comment_post: req.params.postId})
        res.send(comments)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

/* Get all comments for a specific post, checking for the following:
    - The user must be verified.
    - The post must exist.
    - The post must have at least one comment.
*/
router.get('/getcommentsforpost/:postId', verify, async (req, res) => {
    // Check if the post exists
    const post = await Post.findOne({_id: req.params.postId})
    if(!post){
        return res.status(400).send({message:'You cannot get comments for a post that does not exist.'})
    }

    // Check if post has comments
    const comments = await Comment.find({comment_post: req.params.postId})
    if(comments.length == 0){
        return res.status(400).send({message:'This post has no comments yet.'})
    }

    // Get comments
    try {
        const comments = await Comment.find({comment_post: req.params.postId})
        res.send(comments)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

module.exports = router