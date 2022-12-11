/* This file handles token verification processes.
   It checks if the user has the appropriate auth-token in their header when interacting with MiniWall.
   It is based on the same file from MiniFilm-Auth. */

const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('auth-token')
    if(!token) return res.status(401).send({message:'Access denied'})

    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch(err){
        res.status(401).send({message:'Invalid token'})
    }
}

module.exports = auth