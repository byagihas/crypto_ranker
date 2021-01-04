'use strict';

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');
const Monitor = require('./monitor.js');

class Algorithm {
    constructor(currency, amount){
        this.currency = currency;
        this.amount = amount;
        this.boughtPrice = null;
        this.sellPrice = null;
        this.targetPrice = null;
        this.change = null;
    }
    async buyPosition(currency, amount){
        const bittrex = await APIConnect.Connect('bittrex');
        return Monitor.getBalances(`${currency}`).then((data) => { 
            console.log(data);
            bittrex.createLimitBuyOrder (currency, amount, data.last);
            this.boughtPrice = data.last;
            return 'Order placed';
        });
    };
    async sellposition(){
        const bittrex = await APIConnect.Connect('bittrex');
        return Monitor.getBalances(`${this.currency}`).then((data) => { 
            console.log(data);
            bittrex.createLimitSellOrder (this.currency, this.amount, data.last);
            this.soldPrice = data.last;
            return 'Order placed';
        });
    };
};

// Need to store: boughtPrice
const buyPosition = async (currency, amount) => {
    const bittrex = await APIConnect.Connect('bittrex');
    let boughtPrice = 0;
    return Monitor.getBalances(`${currency}`).then((data) => { 
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
//let trade = new Algorithm('LINK', 10);
//console.log(trade);

module.exports.buyPosition = buyPosition;
module.exports.sellPosition = sellPosition;
module.exports.algorithm = Algorithm;