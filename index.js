const request = require('request');
const cheerio = require('cheerio')

request('https://coinmarketcap.com/', function(err, resp, html) {
    if (!err){
      const $ = cheerio.load(html)
      // let percentage = $('.percent-change').text()
      // let name = $('.currency-name-container').text()
      // let rank = $('.sorting_1').text()
      // let volume = $('.volume').text()
      let nameHolder = {};
      let percentageHolder = {};
      $('body').each(function() {
        const percentage = JSON.stringify($(this).find('.percent-change').contents().map(function(){
          return (this.type === 'text') ? $(this).text()+'' : '';
        }).get().join('|'))
        const volume = $(this).find('.volume').text();
        const name = JSON.stringify($(this).find('.currency-name-container').contents().map(function(){
           return (this.type === 'text') ? $(this).text() + '': '';
        }).get().join('|'))
        
        let fname = name.split('.').join('').split('"').join('').split('|')
        let fpercentage = percentage.split('"').join('').split('%').join('').split('|')

        Object.keys(fname)
         .forEach(key => nameHolder[key] = fname[key]);
        
        Object.keys(fpercentage)
         .forEach(key => percentageHolder[key] = fpercentage[key]);
         
         for(i=0;i<=fpercentage.length;i++){
           if(fpercentage[i] >= 3){
           console.log(fname[i] + ': ' + fpercentage[i]);
           }
         }
         

        
      });
       // console.log(JSON.stringify(percentageHolder));
      /*
      for(let i=0; i <= percentage.length;i ++){
        console.log(name[i] + '- ' + percentage[i])
      }
      */
    }
});