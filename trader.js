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

const svgCaptcha = require('svg-captcha')
const {google} = require('googleapis')
const OAuth2 = google.auth.OAuth2

const accessToken = ''
let secrid = hat()

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

/*
const oauth2Client = new OAuth2(
  '876361110475-a1mhr51hc8ssoj0ba6veumpb0562h9i3.apps.googleusercontent.com', // ClientID
  'DqMcaISZWdpjYj0P_YpCUpXC', // Client Secret
  'https://developers.google.com/oauthplayground' // Redirect URL
)

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/gmail'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

// This will provide an object with the access_token and refresh_token.
// Save these somewhere safe so they can be used at a later time.
async function refreshToken() {
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);
  accessToken = tokens.credentials.access_token
} */

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

/*
app.get('/send', function(req,res) {
  fs.readFile('../crypto_ranker/crypto_data.json', function(err, data){

      if(err){
          throw err;
      }
      else {
          let jsonContent = JSON.parse(data)
          let htmlObject = []
          let htmlObjectRefined = []

          console.log(jsonContent)
          
          for(let i=0;i<jsonContent.length;i++){
              let tdcolor = ''
              if(parseInt(jsonContent[i].PERCENTAGE) < 1.00 ){ 
                  tdcolor = 'red'
              } else {
                  tdcolor = 'green'
              }

              htmlObject.push('<tr><td>' + jsonContent[i].RANK  + '</td><td>' + jsonContent[i].NAME + '</td><td>' 
              + jsonContent[i].SYMBOL + '</td><td style=\'color:' + tdcolor + ';\'>' + jsonContent[i].PERCENTAGE + '</td><td>' + jsonContent[i].PRICE + '</td></tr>')
              htmlObjectRefined[i] = JSON.stringify(htmlObject[i]).replace('\"','').replace('[','').replace(']','').replace('\"','').replace('\"','')

          }
          
          const smtpTransport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                      type: 'OAuth2',
                      user: 'byagihas@gmail.com', // Email
                      clientId: '876361110475-a1mhr51hc8ssoj0ba6veumpb0562h9i3.apps.googleusercontent.com',
                      clientSecret: 'DqMcaISZWdpjYj0P_YpCUpXC',
                      refreshToken: '1/4Hvj28_jJPUCpUcqNXeQIOWhmyANv1yYshr1l5qcEIU',
                      accessToken: accessToken
              }
          })
          
          const mailOptions = {
              from: '<mailer@byagihas.us>',
              to: 'byagihas@gmail.com', 
              subject: '! Crypto Rankings',
              html: '<html><body><div style=\'text-align:center\'display:block\'margin:0\'width:640px\'>' 
              + '<table style=\'display:block;padding:2em;width:35em;text-align:center;border:1px solid black;font-size:1.25em\'><tr><th>Rank</th><th>Name</th><th>Symbol</th><th>Percentage</th><th>Price</th></tr>'
              + htmlObjectRefined.join('') + '</table></div></body></html>'
          }
      
          smtpTransport.sendMail(mailOptions, function(error, response) {
              if (error) {
                  res.send('Email could not be sent due to error:' + error)
                  console.log(error);
              }else {
                  res.send('Email has been sent successfully')
                  console.log(htmlObjectRefined.join(''))
              }
          })

      }
  })
})
*/
app.listen(8080, 'localhost',  () => console.log('App running on 8080'))
