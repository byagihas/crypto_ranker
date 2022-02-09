'use strict';

const Monitor = require('./monitor.js');
const AppError = require('./error.js');

const BUY_LEVEL = -7;
const SELL_LEVEL = 20;

// Get currencies to buy
const getBuyCurrencies = async () => {
    const losers = [];
    try {
        return Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) < BUY_LEVEL) {
                    losers.push(data[i]);
                };
            };
            return losers;
        });
    } catch(err) {
        throw new AppError(err, 'getBuyCurrencies Error', '404', 'Issue with getBuyCurrencies', false);
    };
};

// Get currencies to sell
const getSellCurrencies = async () => {
    const gainers = [];
    try {
        return Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) >= SELL_LEVEL) {
                    gainers.push(data[i]);
                };
            };
            return gainers;
        });
    } catch(err) {
        throw new AppError(err, 'getSellCurrencies Error', '404', 'Issue with getSellCurrencies', false);
    };
};

module.exports.getBuyCurrencies = getBuyCurrencies;
module.exports.getSellCurrencies = getSellCurrencies;