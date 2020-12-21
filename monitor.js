// Monitor coin prices and log opportunities
// Run: node monitor.js
'use strict';

const config = require('./config.js');
const ccxt = require('ccxt');
const fs = require('fs');
const AppError = require('./error.js');

const getBalances = async () => {
    let Balances = [];
    // CREATE BITTREX OBJECT
    const bittrex = new ccxt.bittrex ({
        apiKey: config.get('btx_api_key'),
        secret: config.get('btx_api_secret')
    });
    try {
        //console.log (bittrex.id,  await bittrex.loadMarkets ())
        //console.log (bittrex.id,  await bittrex.fetchOrderBook (bittrex.symbols[0]))
        //let LINKUSD = await bittrex.fetchTicker ('LINK/USD');
        const balance = await bittrex.fetchBalance();
        const items = balance.info;
        
        for(let i=0;i<items.length;i++){
            if(items[i].Balance >= 0.00001 && items[i].Currency != 'BTC' && items[i].Currency != 'BTXCRD'){
                // console.log(items[i].Currency + ':' + items[i].Balance);
                let priceObject = (await bittrex.fetchTicker(`${items[i].Currency}/BTC`));
                Balances.push(priceObject);
                console.log(priceObject.symbol + '|' + items[i].Balance + '|' + priceObject.last + '|'
                + priceObject.change + '|' + priceObject.percentage);
            };
        };
        fs.writeFileSync(__dirname + '/balances.json', JSON.stringify(Balances));
    } catch(error) {
        throw new AppError(commonErrors.resourceNotFound, commonHTTPErrors.notFound, error, true)
    } finally {
        return Balances;
    };
};

module.exports.getBalances = getBalances();