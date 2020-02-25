const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')(configuration);           // define database based on above
const bcrypt          = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto          = require('crypto') 
const express = require('express')
const router = express.Router();

const signup = (request, response) => {
    const user = request.body
    if ( !user.password || !user.first_name || !user.last_name || !user.username) {
      return response.status(400).json({error: "missing user information" })
    }

    hashPassword(user.password)
      .then((hashedPassword) => {
        delete user.password
        user.password_digest = hashedPassword
      })
      .then(() => createToken())
      .then(token => user.token = token)
      .then(() => createUser(user))
      .then(user => {
        delete user.password_digest
        return response.status(201).json({ user })
      }).catch((err) => {
        console.error(err)
        return response.status(500).json(err)
      })
  }
  
  const hashPassword = (password) => {
    return new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err, hash) => {
        err ? reject(err) : resolve(hash)
      })
    )
  }
  
  const createUser = (user) => {
    return database.raw(
      "INSERT INTO users (first_name, last_name, username, password_digest, token, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, first_name, created_at, token",
      [user.first_name, user.last_name, user.username, user.password_digest, user.token, new Date()]
    )
    .then((data) => data.rows[0])
  }
  
 
  const createToken = () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, data) => {
        err ? reject(err) : resolve(data.toString('base64'))
      })
    })
  }

  router.post('/signup', signup)


  router.post('/login', (req, res) => {
    const user = req.body
    if ( !user.password || !user.username) {
      return res.status(400).json({error: "missing user information" })
    }
    database("users").select().where('username', user.username).first().then(function(dbUser){
      if(!dbUser) {
        return res.status(401).json("invalid login")
      }
    
      bcrypt.compare(user.password, dbUser.password_digest).then((matches)=>{
        if (!matches) {
          return res.status(401).json("invalid login")
        } else {
          return res.status(200).json({
            success: true,
            token: dbUser.token
          })
        }
      })

    }).catch((err)=>{
      console.error(err)
      return response.status(500).json(err)
    })
  })

  
  module.exports = router