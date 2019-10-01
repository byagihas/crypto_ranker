const request = require('request')
const rp = require('request-promise')
const express = require('express')
const csv = require('csv-parser');
const fs = require('fs');
const app = express()
const port = 3000

app.get('/', function(req, res){
    res.send("Hello")
})

app.get('/list', function(req, res){
  const cryptostream = fs.createReadStream('../crypto_ranker/list.csv')
  cryptostream.pipe(res)
  cryptostream.pipe(csv())
  cryptostream.on('data', (row) => {
    console.log(row)
  })
  cryptostream.on('end', () => {
    console.log('CSV file successfully processed')
    
  })
  cryptostream.pipe(fs.createWriteStream('./test-data-output-stream.json'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

