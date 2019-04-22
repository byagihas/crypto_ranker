const request = require('request');
const cheerio = require('cheerio')
const cryptocurrencies = require('cryptocurrencies');

let dayMood = "";
let gainers = [];
let losers = [];

request('https://coinmarketcap.com/', function(err, resp, html) {
    if (!err){
      const $ = cheerio.load(html)
      let nameHolder = {};
      let percentageHolder = {};
      let cryptoHolder = {};

      $('body').each(function(){

        // Percentage 
        const percentage = JSON.stringify($(this).find('.percent-change').contents().map(function(){
          return (this.type === 'text') ? $(this).text()+'' : '';
        }).get().join('|'))
        
        // 24hr Volume
        const volume = JSON.stringify($(this).find('.volume').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '';
        }).get().join('|'))
        
        // Name
        const name = JSON.stringify($(this).find('.currency-symbol > a').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '';
        }).get().join('|'))

        let fname = name.split('.').join('').split('"').join('').split('|')
        let fpercentage = percentage.split('"').join('').split('%').join('').split('|')
        let fvolume = volume.split('"').join('').split('|')
        let fcrypto = JSON.stringify(cryptocurrencies).split('}').join('').split('{').join('').split('"').join('').split(',');

        Object.keys(fname)
         .forEach(key => nameHolder[key] = fname[key]);

        Object.keys(fpercentage)
         .forEach(key => percentageHolder[key] = fpercentage[key]);

         Object.keys(fcrypto)
         .forEach(key => cryptoHolder[key] = fcrypto[key]);

         for(i=0;i<=fname.length-1;i++){
           if(fpercentage[i] <= -6){
              losers.push("[" + fname[i] + "]|%:" + fpercentage[i] + "|Vol:" + fvolume[i] + "|\n")
           }
           else if(fpercentage[i] >= 3){
              gainers.push("[" + fname[i] + "]|%:" + fpercentage[i] + "|Vol:" + fvolume[i] + "|\n")
           }
         }

         if(gainers.length > losers.length){
           dayMood = "BULL";
           console.log("|| ------------- BULL MOOD ------------- ||\n");
           console.log("| --- Gainers --- |: \n" + gainers);
           console.log("| --- Losers --- |: \n" + losers);
         }
         else{
           dayMood = "BEAR";
           console.log("|| ------------- BEAR MOOD ------------- ||\n");
           console.log("| --- Losers --- |: \n" + losers);
           console.log("| --- Gainers --- |: \n" + gainers);
         }

      });
    }
});