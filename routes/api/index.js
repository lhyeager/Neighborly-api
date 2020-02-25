const express = require('express');
const router = express.Router();
const userRoute = require('./user');
const adminRoutes = require('./admin')
const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')(configuration); 
const donations = require('./donations')   

router.use('/user', userRoute);
router.use('/donation_request', checkLogin, donations);
router.use('/admin', checkIfAdmin, adminRoutes)


function checkLogin (req, res, next) {
    database("users").select().where('token', req.query.usertoken).first().then(function(user){
        if(!user) {
           return res.status(401).json("not logged in ")
        }
        req.user = user
        next()
    }).catch((err) => {
        return res.status(500).json("you done fucked up")
    })
}

function checkIfAdmin (req, res, next) {
    console.log(req.query.usertoken)

    database("users").select().where('token', req.query.usertoken).first().then(function(user){
        if(!user) {
           return res.status(401).json("you done fucked up")
        }
        if (!user.isAdmin) {
            return res.status(403).json("not an admin")
        }
        next()
    }).catch((err) => {
        res.status(500).json("you done fucked up")
    })

}

module.exports = router;