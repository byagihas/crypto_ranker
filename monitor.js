// Monitor coin prices and log opportunities
// Run: node monitor.js
'use strict';

require('dotenv').config();

const AppError = require('./error.js');
const APIConnect = require('./api_conn.js');

const getBalances = async () => {
    let Balances = [];
    try {
        //console.log (bittrex.id,  await bittrex.loadMarkets ())
        //console.log (bittrex.id,  await bittrex.fetchOrderBook (bittrex.symbols[0]))
        //let LINKUSD = await bittrex.fetchTicker ('LINK/USD');
        const bittrex = await APIConnect.Connect('bittrex');
        const balance = await bittrex.fetchBalance();
        const items = balance.info;
        for(let i=0;i<items.length;i++){
            if(items[i].Balance >= 0.00001 && items[i].Currency != 'BTC' && items[i].Currency != 'BTXCRD'){
                let priceObject = (await bittrex.fetchTicker(`${items[i].Currency}/BTC`));
                Balances.push(priceObject);
            };
        };
        return Balances;
    } catch(error) {
        throw new AppError(error, 'Balance Error', '404', 'Issue with getBalances', false);
    };
};

module.exports.getBalances = getBalances;