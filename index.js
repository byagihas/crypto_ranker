const request = require('request')
const cheerio = require('cheerio')

let dayMood = ""
let gainers = []
let losers = []

let fcrypto = {}

request('https://coinmarketcap.com/', function(err, resp, html) {
    if (!err){
      const $ = cheerio.load(html)
      let nameHolder = {};
      let percentageHolder = {};
      let cryptoHolder = {};
      let priceHolder = {};
      let marketCapHolder = {};
      let dataccIdHolder = {};
      let dataccSlugHolder = {};
      let sparkHolder = {};

      $('body').each(function(){

        // Declare Cheerio HTML Selectors
        const percentage = JSON.stringify($(this).find('.percent-change').contents().map(function(){
          return (this.type === 'text') ? $(this).text()+'' : '';
        }).get().join('|'))
        
        const dataccid = JSON.stringify($(this).find('.dropdown').map(function(){
          return (this.type === 'tag') ? $(this).attr("data-cc-id") + '' : '';
        }).get().join('|'))
        
        const dataccslug = JSON.stringify($(this).find('.dropdown').map(function(){
          return (this.type === 'tag') ? $(this).attr("data-cc-slug")  + '' : '';
        }).get().join('|'))
        
        const volume = JSON.stringify($(this).find('.volume').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '';
        }).get().join('|'))
        
        const price = JSON.stringify($(this).find('.price').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '';
        }).get().join('|'))
        
        const marketcap = JSON.stringify($(this).find('.market-cap').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '';
        }).get().join('|'))
        
        const name = JSON.stringify($(this).find('.currency-symbol > a').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '-';
        }).get().join('|'))
        
        const sparkline = JSON.stringify($(this).find('.sparkline').map(function(){
          return (this.type === 'tag') ? $(this).attr("src") + '': '';
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
        
        // Set up separate lists with keys for modular use
        Object.keys(fname)
          .forEach(key => nameHolder[key] = fname[key]);

        Object.keys(fpercentage)
          .forEach(key => percentageHolder[key] = fpercentage[key]);
        
        Object.keys(fprice)
          .forEach(key => priceHolder[key] = fprice[key]);
          
        Object.keys(fmarketcap)
        .forEach(key => marketCapHolder[key] = fmarketcap[key]);
        
        Object.keys(fdataccid)
        .forEach(key => dataccIdHolder[key] = fdataccid[key]);
        
        Object.keys(fdataccslug)
        .forEach(key => dataccSlugHolder[key] = fdataccslug[key]);

        // Load all objects into a Gainer or Loser array for example 
        for(i=0;i<=fdataccid.length-1;i++){
          // Sparkline path construction
          fsparkline[i] =  "https://s2.coinmarketcap.com/generated/sparklines/web/7d/usd/" + fdataccid[i] + ".png"

          Object.keys(fsparkline)
          .forEach(key => sparkHolder[key] = fsparkline[key]);
          
          // Construct object from selector fields
          let cryptocurrencies = "{  \"id\":\"" + fdataccid[i] +  "\", \"name\":\"" + fdataccslug[i] + "\", \"symbol\":\"" + fname[i] + "\", \"percentage\":\"" + fpercentage[i] + "\", \"vol\":\"" + fvolume[i] + "\", \"price\":\""
          + fprice[i] + "\", \"marketcap\":\"" + fmarketcap[i] + "\", \"sparkline\": \"" + fsparkline[i] + "\" }"
          fcrypto = JSON.parse(cryptocurrencies);

          Object.keys(fcrypto)
          .forEach(key => cryptoHolder[key] = fcrypto[key]);
          
          // Push lists for example
          if(fcrypto.percentage <= -5){
            losers.push(fcrypto.symbol)
          }
          else if(fcrypto.percentage >= 5){
            gainers.push(fcrypto.symbol)
          }
          
        }

        // Display Gainers and Losers first depending on if Bull or Bear mood, set dayMood var for other purposes.
        if(gainers.length > losers.length){
            dayMood = "BULL";
            console.log("|| ------------- BULL MOOD ------------- ||\n");
            console.log("| --- Gainers --- |: \n" + gainers);
            console.log("| --- Losers --- |: \n" + losers);
        }
        else {
            dayMood = "BEAR";
            console.log("|| ------------- BEAR MOOD ------------- ||\n");
            console.log("| --- Losers --- |: \n" + losers);
            console.log("| --- Gainers --- |: \n" + gainers);
        }
           
      });
    }
});