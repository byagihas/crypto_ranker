'use strict';

const Monitor = require('./monitor.js');

const getHighDeltaCurrencies = async (arr) => {
    const gainers = [];
    const losers = [];
    try {
        Monitor.getBalances().then((data) => {
            for(let i=0;i<data.length;i++){
                if(parseInt(data[i].percentage) >= 10) {
                    gainers.push(data[i]);
                } else if(parseInt(data[i].percentage) < -10) {
                    losers.push(data[i]);
                };
            };
            return losers;
        });
    } catch(err) {
        throw new Error(err);
    };
};

module.exports = getHighDeltaCurrencies();