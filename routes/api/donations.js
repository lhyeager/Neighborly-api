const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')(configuration);           // define database based on above
const bcrypt          = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto          = require('crypto') 
const express = require('express')
const router = express.Router();

router.post('/',(req, res) => {

    // console.log(req.user)
    // return res.status(200).json("yay")


    const donation = { 
        title: req.body.title,
        description: req.body.description,
        user_id: req.user.id
    }

    if (!donation.title || !donation.description) {
      return res.status(400).json({error: "missing donation information" })
    }

    database('donations').insert({title: donation.title, description: donation.description, user_id: donation.user_id}).returning("id")
    .then((id) => {
        donation.id = id[0]
        return res.status(200).json(donation)
    }).catch((err) => {
        console.error(err)
        return res.status(500).json(err)
    })
})



module.exports = router