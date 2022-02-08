/* Algorithm */
/*
This class should sort and order cryptocurrencies by rank of buy rating.
Using data from crypto exchanges, and supplemental data from finance sources.
*/

'use strict';

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');
const Monitor = require('./monitor.js');
const Analyze = require('./Analyze.js');

class Algorithm {
    constructor(){
        this.cryptocurrencies = [];
        this.ordered_cryptocurrencies = [];
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
    getCurrencies(){
        return Monitor.getPrices.then((data) => {
            this.cryptocurrencies = data;
            return;
        });
    };
    orderCurrencies(){
        let crypto_unordered = this.cryptocurrencies;
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

module.exports = Algorithm;