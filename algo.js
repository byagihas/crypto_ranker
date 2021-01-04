'use strict';

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');
const Monitor = require('./monitor.js');

// Need to store: boughtPrice
const buyPosition = async (currency, amount) => {
    const bittrex = await APIConnect.Connect(`${currency}`);
    let boughtPrice = 0;
    return Monitor.getBalances('LINK').then((data) => { 
        console.log(data);
        bittrex.createLimitBuyOrder (currency, amount, data.last);
        boughtPrice = data.last;
        return 'Order placed';
    });
};

const sellPosition = async (currency, amount) => {
    const bittrex = await APIConnect.Connect('bittrex');
    let soldPrice = 0;
    return Monitor.getBalances(`${currency}`).then((data) => { 
        console.log(data);
        bittrex.createLimitSellOrder (currency, amount, data.last);
        soldPrice = data.last;
        return 'Order placed';
    });
};
//buyPosition('LINK/BTC', 1);
//sellPosition('LINK/BTC', 1);

module.exports.buyPosition = buyPosition;
module.exports.sellPosition = sellPosition;
