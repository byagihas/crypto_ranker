'use strict';

const Monitor = require('./monitor.js');
const AppError = require('./error.js');

const BUYLEVEL = -9;
const SELLLEVEL = 8;

const getBuyCurrencies = async () => {
    const losers = [];
    try {
        return Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) < BUYLEVEL) {
                    losers.push(data[i]);
                };
            };
            return losers;
        });
    } catch(err) {
        throw new AppError(err, 'getBuyCurrencies Error', '404', 'Issue with getBuyCurrencies', false);
    };
};

const getSellCurrencies = async () => {
    const gainers = [];
    try {
        return Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) >= SELLLEVEL) {
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