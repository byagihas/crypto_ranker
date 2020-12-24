'use strict';

const Monitor = require('./monitor.js');

const getBuyCurrencies = async () => {
    const losers = [];
    try {
        return Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) < -5) {
                    losers.push(data[i]);
                };
            };
            return losers;
        });
    } catch(err) {
        throw new Error(err);
    };
};

const getSellCurrencies = async () => {
    const gainers = [];
    try {
        return Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) >= 5) {
                    gainers.push(data[i]);
                };
            };
            return gainers;
        });
    } catch(err) {
        throw new Error(err);
    };
};

module.exports.getBuyCurrencies = getBuyCurrencies;
module.exports.getSellCurrencies = getSellCurrencies;