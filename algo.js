'use strict';

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');
const Monitor = require('./monitor.js');
const Analyze = require('./Analyze.js');
class Algorithm {
    constructor(currency, amount){
        this.currency = currency;
        this.amount = amount;
        this.active = false;
        this.boughtPrice = null;
        this.sellPrice = null;
        this.targetPrice = null;
        this.change = null;
        this.profit = 0;
        this.sellIndicator = false;
    };
    async buyPosition(currency, amount){
        const bittrex = await APIConnect.Connect('bittrex');
        return Monitor.getBalances(`${currency}`).then((data) => { 
            console.log(data);
            bittrex.createLimitBuyOrder (currency, amount, data.last);
            this.boughtPrice = data.last;
            this.active = true;
            return 'Order placed';
        });
    };
    async sellposition(){
        if(this.active = true) {
            const bittrex = await APIConnect.Connect('bittrex');
            return Monitor.getBalances(`${this.currency}`).then((data) => { 
                console.log(data);
                bittrex.createLimitSellOrder (this.currency, this.amount, data.last);
                this.soldPrice = data.last;
                this.active = false;
                return 'Order placed';
            });
        } else {
            console.log('No active trade');
        };
    };
    async getBalances(){
        return Monitor.getBalances().then((data) => {
            console.log(data);
            return data;
        });
    };
    async analyze(){
        return Analyze.getSellCurrencies().then((data) => {
            for(let i=0;i<data.length;i++){
                console.log(this.currency)
                if((this.currency + '/BTC') == data[i].symbol){
                    console.log('Sell indicator: ' + data[i].symbol + '\nChange: ' + data[i].percentage + ' %'
                    + '\nPrice: ' + data[i].last + ' BTC');
                    this.sellIndicator = true;
                    return this.sellIndicator;
                };
            };
            
        });
    };
    start(){
        console.log('Trading algo for ' + this.currency + ' initialized');
    };
    end(){
        console.log('Trading algo for ' + this.currency + ' stopped');
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
//console.log(trade.analyze());
//console.log(trade);

module.exports.buyPosition = buyPosition;
module.exports.sellPosition = sellPosition;
module.exports = Algorithm;