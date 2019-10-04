'use strict';

require('dotenv').config()

const fs = require('fs')
const request = require('request')
const rp = require('request-promise')
const express = require('express')
const csvjson = require('csvjson')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const app = express()

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

// Compression and content for future web app client
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

// Converts list.csv provided from index.js to JSON object
// Responds with top 100 crypto information formatted in JSON file.
app.get('/list', function(req, res){
  fs.readFile('../crypto_ranker/list.csv', 'utf-8', function(err, data){
    if(err) { console.log('Error on csv file read'); throw err }
    let options = {
      delimiter : ',',
      quote     : '"' 
    }
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
