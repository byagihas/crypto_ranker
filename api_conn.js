'use strict';

require('dotenv').config();

const ccxt = require('ccxt');
const AppError = require('./error.js');

const Connect = async (cryptomarket) => {
    // Create Bittrex object through ccxt with api key and secret. Use .env file to securely connect
    try{
        if(cryptomarket == "bittrex" || cryptomarket == null){
            return new ccxt.bittrex ({
                apiKey: process.env.BITTREX_API_KEY,
                secret: process.env.BITTREX_SECRET
            });
        } else if(cryptomarket == "binance") {
            //need to add binanance/coinbase support etc.
        };
    } catch(error){
        throw new AppError(error, 'BittrexAPI Error', '404', 'Issue with Bittrex API connection', false);
    };
};

module.exports.Connect = Connect;