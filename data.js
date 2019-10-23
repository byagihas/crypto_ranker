const request = require('request')
const ObjectsToCsv = require('objects-to-csv')
const rp = require('request-promise')

const fs = require('fs')
const csvjson = require('csvjson')
const cron = require('node-cron')

let crypto = {}

cron.schedule('* * * * *', () => {

    rp('https://api.coinranking.com/v1/public/coins?base=USD&timePeriod=7d&limit=100', function(err, resp, html) {

        let responsebody = JSON.parse(resp.body)
        crypto = responsebody.data.coins 

    }).then(function(){

        fs.writeFile('./coinranking.json', crypto, function(err){
            if (err) throw err
            console.log('JSON file saved - Sending response')
        })

        new ObjectsToCsv(crypto).toDisk('./coinranking.csv', function(err){
            if(err){
                console.log('Error saving file')
            }
            else{
                console.log('CSV File saved')
            }
        })
    })

})