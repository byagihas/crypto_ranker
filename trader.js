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

let cryptoData = []
let Gainers = []
let Losers = []
let Targets = []

app.enable('trust proxy') // Needed to use for reverse proxy

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
    cryptoData = JSON.stringify(csvjson.toObject(data, options))
    fs.writeFile('./crypto_data.json', cryptoData, function(err){
      if (err) throw err
      console.log('JSON file saved - Sending response')
      res.setHeader('Content-Type', 'application/json')
      res.send(cryptoData)
    })
  })
})

app.get('/rank', function(req, res){
  let contents = fs.readFileSync("crypto_data.json")
  let jsonContent = JSON.parse(contents)

  //console.log(jsonContent)
  for(let i=0;i<jsonContent.length;i++){
    let price = jsonContent[i].PRICE.replace('$','')
    if(parseInt(jsonContent[i].PERCENTAGE) <= parseInt("-5")){
      console.log(jsonContent[i].NAME + ": " + jsonContent[i].PERCENTAGE)
      Losers.push(jsonContent[i])
    }
    else if(parseInt(jsonContent[i].PERCENTAGE) >= parseInt("5")) {
      console.log(jsonContent[i].NAME + ": " + jsonContent[i].PERCENTAGE)
      Gainers.push(jsonContent[i])
    }
  }
  
})

app.listen(8080, 'localhost',  () => console.log('App running on 8080'))
