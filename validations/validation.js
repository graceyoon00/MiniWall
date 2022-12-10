/* This file is based off MiniFilm-auth. It contains the validation requirements for:
   - The registration of a new user (validates username, email, and password)
   - User login (validates email and password)
   - User input/interactions with the MiniWall, which includes: post, comment, like */

   const joi = require('joi')

   const registerValidation = (data) => {
       const schemaValidation = joi.object({
           username: joi.string().required().min(3).max(256),
           email: joi.string().required().min(6).max(256).email(),
           password: joi.string().required().min(6).max(1024)
       })
       return schemaValidation.validate(data)
   }
   
   const loginValidation = (data) => {
       const schemaValidation = joi.object({
           email: joi.string().required().min(6).max(256).email(),
           password: joi.string().required().min(6).max(1024)
       })
       return schemaValidation.validate(data)
   }

   const postValidation = (data) => {
         const schemaValidation = joi.object({
                post_title: joi.string().required().min(6).max(128),
                post_description: joi.string().required().min(6).max(1024)
            })
            return schemaValidation.validate(data)
    }

    const commentValidation = (data) => {
        const schemaValidation = joi.object({
            comment_content: joi.string().required().min(6).max(1024)
        })
        return schemaValidation.validate(data)
    }
   
    module.exports.registerValidation = registerValidation
    module.exports.loginValidation = loginValidation
    module.exports.postValidation = postValidation
    module.exports.commentValidation = commentValidation
