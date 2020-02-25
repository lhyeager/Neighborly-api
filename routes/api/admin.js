const express = require('express')
const router = express.Router();
const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')(configuration);    

router.get('/users', (req, res) => {
    database('users').select().then((results)=>{
        return res.status(200).json(results)
    }).catch((err) => {
        return res.status(500).json({error: "database error"})
    })
})
  
module.exports = router