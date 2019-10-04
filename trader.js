'use strict';

require('dotenv').config()
const request = require('request')
const rp = require('request-promise')
const express = require('express')
const csvjson = require('csvjson');
const fs = require('fs');
const app = express()
const lessMiddleware = require('less-middleware')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const helmet = require('helmet')
const escapeHTML = require('escape-html')
const compression = require('compression')
const parseurl = require('parseurl')
const session = require('express-session')
const hat = require('hat')
const rateLimit = require('express-rate-limit')

app.enable('trust proxy') // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})
 
//  apply to all requests
app.use(limiter)

// START MAIN CODE
app.use(helmet())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ['"self"'],
    vibrate: ['"none"'],
    payment: ['byagihas.us'],
    syncXhr: ['"none"']
  }
}))

// Compression and Content
app.use(compression())
app.set('view engine', 'ejs')
app.set('json spaces', 40)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))
app.use('/media', express.static(__dirname + '/media'))

app.get('/', function(req, res) {
    res.render('base')
})

app.get('/list', function(req, res){
  fs.readFile('../crypto_ranker/list.csv', 'utf-8', function(err, data){
    if(err) { throw err }
    let options = {
      delimiter : ',', // optional
      quote     : '"' // optional
    };
    const cryptoData = csvjson.toObject(data, options)
    fs.writeFile('./crypto_data.json', cryptoData, function(err){
      if (err) throw err
      console.log('JSON file saved - Sending response')
      res.setHeader('Content-Type', 'application/json')
      res.send(cryptoData)
    })
  })

  })
app.listen(8080, 'localhost',  () => console.log('App running on 8080'))

//app.listen(8080, '10.138.60.17',  () => console.log('App running on 8080'))
