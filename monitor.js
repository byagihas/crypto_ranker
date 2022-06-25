// Monitor coin prices and log opportunities
// Contains functions that use ccxt to retrieve crypto data.
'use strict';

require('dotenv').config();

const ErrorHandler = require('./error');
const APIConnect = require('./api_conn');
const fs = require('fs');

//getMarkets
const getMarkets = async () => {
    try{
        const bittrex = await APIConnect.Connect('bittrex');
        let markets = await bittrex.loadMarkets();
        return markets;
    } catch(error) {
        throw new ErrorHandler(error, 'getMarkets Error', '404', 'Issue with getMarkets', false);
    };
};

//getPrice
//Gets singular price data for a cryptocurrency
// params: currency
const getPrice = async (currency) => {
    try {
        if(currency.length > 4){
            const bittrex = await APIConnect.Connect('bittrex');
            let formattedCurrency = currency.replace('-','/').toUpperCase();
            let ticker = await bittrex.fetchTicker(formattedCurrency);
            return ticker;
        } else {
            return "Invalid Symbol, needs to be greater than 4 characters";
        };
    } catch(error) {
        throw new ErrorHandler(error, 'getPrice Error', '404', 'Issue with getPrice', false);
    };
};

//getPrices
//Gets prices of all currencies on bittrex.
//params: none
const getPrices = async () => {
    try{
        const bittrex = await APIConnect.Connect('bittrex');
        let tickers = await bittrex.fetchTickers();
        return tickers;
    } catch(error) {
        throw new ErrorHandler(error, 'getPrices error', '404', 'Issue with getPrices', false);
    };
};

const getUSDPrices = async () => {
    try{
        const sortusd = async () => {
            const bittrex = await APIConnect.Connect('bittrex');
            let tickers = await bittrex.fetchTickers();
            console.log(tickers.length)
            let usdprices = [];
            for(let i = 0; i <= tickers.length; i++){
                if(tickers[i].symbol.includes('USD')){
                    usdprices.push(tickers[i]);
                };
            };
            return usdprices;
        }
       
       return await sortusd();
    } catch(error) {
        throw new ErrorHandler(error, 'getPrices error', '404', 'Issue with getPrices', false);
    };
};

//getBalances
//Gets balances of all owned currencies on bittrex.
//params: currency, might not be necessary as we're just displaying balances here.
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
        throw new ErrorHandler(error, 'getBalances Error', '404', 'Issue with getBalances', false);
    };
};

// Get Tether indicator/price for predictions
const getTetherIndicator = async () => {
    try {
        const bittrex = await APIConnect.Connect('bittrex');
        const tether = await bittrex.fetchTicker('USDT/USD');
        return tether;
    } catch(error){
        throw new ErrorHandler(error, 'getTetherIndicator Error', '404', 'Issue with getTetherIndicator', false);
    };
};

module.exports.getPrice = getPrice;
module.exports.getPrices = getPrices;
module.exports.getMarkets = getMarkets;
module.exports.getBalances = getBalances;
module.exports.getTetherIndicator = getTetherIndicator;
module.exports.getUSDPrices = getUSDPrices;