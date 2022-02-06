// Monitor coin prices and log opportunities
// Run: node monitor.js
'use strict';

require('dotenv').config();

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');
const fs = require('fs');

const getPrice = async (currency) => {
    const bittrex = await APIConnect.Connect('bittrex');
    var ticker = await bittrex.fetchTicker(currency);
    //fs.writeFileSync('./coins.json', JSON.stringify(currencies));
    return ticker;
};

const getPrices = async () => {
    const bittrex = await APIConnect.Connect('bittrex');
    var tickers = await bittrex.fetchTickers();
    fs.writeFileSync('./coins.json', JSON.stringify(tickers));
    return tickers;
};

const getBalances = async (currency) => {
    let Balances = [];
    try {
        //console.log (bittrex.id,  await bittrex.loadMarkets ())
        
        //let LINKUSD = await bittrex.fetchTicker ('LINK/USD');
        const bittrex = await APIConnect.Connect('bittrex');
        const balance = await bittrex.fetchBalance();
        if(currency != null){
            const bittrex = await APIConnect.Connect('bittrex');
            return (await bittrex.fetchTicker(`${currency}`));
        } else {
            const items = balance.info;
            Balances.push(items);
            if(Balances.length > 0){
                return Balances;
            } else {
                return 'Invalid currency';
            };
        }
        
    } catch(error) {
        throw new AppError(error, 'Balance Error', '404', 'Issue with getBalances', false);
    };
};

// Get Tether indicator/price for predictions
const getTetherIndicator = async () => {
    try {
        const bittrex = await APIConnect.Connect('bittrex');
        const tether = await bittrex.fetchTicker('USDT/USD');
        return tether;
    } catch(error){
        throw new AppError(error, 'Balance Error', '404', 'Issue with getBalances', false);
    };
};
module.exports.getBalances = getBalances;
module.exports.getTetherIndicator = getTetherIndicator;
module.exports.getPrice = getPrice;
module.exports.getPrices = getPrices;
