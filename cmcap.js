// DEPRECATED - Not kept up to date
// Simple data scraper to pull top 100 crypto rankings into a JSON file
// node cmcap.js
const fs = require('fs')
const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')

let { promisify } = require('util')
let writeFile = promisify(fs.writeFile)

let dayMood = ""
let gainers = []
let losers = []
let cryptolist = []

// Push headers into losers/gainers array
losers.push("SYMBOL,PERCENTAGE")
gainers.push("SYMBOL,PERCENTAGE")

rp('https://coinmarketcap.com/', (error, html) => {

  if (error) { console.log('Error requesting page'); throw error } 

  // Load page with cheerio
  const $ = cheerio.load(html)
  $('body').each((err) => {
    if(err) throw err
    // Declare Cheerio HTML Selectors
    const percentage = JSON.stringify($(this).find('.percent-change').contents().map(function(){
      return (this.type === 'text') ? $(this).text()+'' : ''
    }).get().join('|'))
    
    const dataccid = JSON.stringify($(this).find('.dropdown').map(function(){
      return (this.type === 'tag') ? $(this).attr("data-cc-id") + '' : ''
    }).get().join('|'))
    
    const dataccslug = JSON.stringify($(this).find('.dropdown').map(function(){
      return (this.type === 'tag') ? $(this).attr("data-cc-slug")  + '' : ''
    }).get().join('|'))
    
    const volume = JSON.stringify($(this).find('.volume').contents().map(function(){
      return (this.type === 'text') ? $(this).text() + '': ''
    }).get().join('|'))
    
    const price = JSON.stringify($(this).find('.price').contents().map(function(){
      return (this.type === 'text') ? $(this).text() + '': ''
    }).get().join('|'))
    
    const marketcap = JSON.stringify($(this).find('.market-cap').contents().map(function(){
      return (this.type === 'text') ? $(this).text() + '': ''
    }).get().join('|'))
    
    const name = JSON.stringify($(this).find('.currency-symbol > a').contents().map(function(){
      return (this.type === 'text') ? $(this).text() + '': '-'
    }).get().join('|'))
    
    const sparkline = JSON.stringify($(this).find('.sparkline').map(function(){
      return (this.type === 'tag') ? $(this).attr("src") + '': ''
    }).get().join('|'))

    // Declare selector formatters
    let fname = name.split('.').join('').split('"').join('').split('|')
    let fdataccid =  dataccid.split('"').join('').split('|')
    let fdataccslug = dataccslug.split('"').join('').split('|')
    let fprice = price.split('"').join('').split('|')
    let fmarketcap = marketcap.split('\\n').join('').split('"').join('').split('|')
    let fpercentage = percentage.split('"').join('').split('%').join('').split('|')
    let fvolume = volume.split('"').join('').split('|')
    let fsparkline = {}

    console.log(name)
    
    // Load all objects into a Gainer or Loser array for example
    
    for(i=0;i<=fdataccid.length-1;i++){

      // Sparkline path construction
      fsparkline[i] =  "https://s2.coinmarketcap.com/generated/sparklines/web/7d/usd/" + fdataccid[i] + ".png"

      // Construct object from selector fields
      let cryptocurrencies = "{  \"RANK\":\"" + (i + 1) + 
        "\", \"ID\":\"" + fdataccid[i] + 
        "\", \"NAME\":\"" + fdataccslug[i] + 
        "\", \"SYMBOL\":\"" + fname[i] + 
        "\", \"PERCENTAGE\":\""  + fpercentage[i] + 
        "\", \"VOLUME\":\"" + fvolume[i] + 
        "\", \"PRICE\":\"" + fprice[i] + 
        "\", \"MARKETCAP\":\"" + fmarketcap[i] + 
        "\", \"SPARKLINEURL\": \"" + fsparkline[i] + 
        "\" }"

      // Push constructed object into cryptolist object
      cryptolist.push(JSON.parse(cryptocurrencies))
      
      // Push lists for example
      if(fcrypto.PERCENTAGE <= -3) {
        losers.push("\n" + fcrypto.SYMBOL + "," + fcrypto.PERCENTAGE)
      }
      else if(fcrypto.PERCENTAGE >= 3) {
        gainers.push("\n" + fcrypto.SYMBOL + "," + fcrypto.PERCENTAGE)
      }
      
    }

    if(cryptolist.length = "0") { console.log("Data empty"); throw error}

    // Display Gainers and Losers first depending on if Bull or Bear mood, set dayMood var for other purposes.
    if(gainers.length > losers.length) {
        dayMood = "BULL";
        // console.log("|| ------------- BULL MOOD ------------- ||\n")
        // console.log("| --- Gainers --- |: \n" + gainers)
        // console.log("| --- Losers --- |: \n" + losers)
        console.log("BULL")
    } else {
        dayMood = "BEAR";
        // console.log("|| ------------- BEAR MOOD ------------- ||\n")
        // console.log("| --- Losers --- |: \n" + losers)
        // console.log("| --- Gainers --- |: \n" + gainers)
        console.log("BEAR")
    }
  })

}).then(() => {
  // Write JSON file
  if(cryptolist.length = '0'){ console.log("File empty"); throw error }

  writeFile('./cryptodata.json', JSON.stringify(cryptolist))
    .then(() => console.log('File successfully created'))
    .catch((error) => console.log(`Error creating file: ${error}`))

})
