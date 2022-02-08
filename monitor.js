// Monitor coin prices and log opportunities
// Run: node monitor.js
'use strict';

require('dotenv').config();

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');
const fs = require('fs');

const getMarkets = async (currency) => {
    const bittrex = await APIConnect.Connect('bittrex');
    let markets = await bittrex.loadMarkets();
    return markets;
};

const getPrice = async (currency) => {
    if(currency.length > 4){
        const bittrex = await APIConnect.Connect('bittrex');
        console.log(currency);
        let formattedCurrency = currency.replace('-','/').toUpperCase();
        let ticker = await bittrex.fetchTicker(formattedCurrency);
        return ticker;
    } else {
        return "Invalid Symbol, needs to be greater than 4 characters";
    };
};

const getPrices = async () => {
    const bittrex = await APIConnect.Connect('bittrex');
    let tickers = await bittrex.fetchTickers();
    fs.writeFileSync('./coins.json', JSON.stringify(tickers));
    return tickers;
};

const getBalances = async (currency) => {
    let Balances = [];
    try {
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
        };
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
module.exports.getMarkets = getMarkets;