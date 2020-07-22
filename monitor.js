// Monitor coin prices and log opportunities
// Run: node monitor.js
'use strict';

const fs = require('fs');
const path = require('path');
const ccxt = require('ccxt');

(async function () {
    // CREATE BITTREX OBJECT
    let bittrex = new ccxt.bittrex ({
        apiKey: '',
        secret: '',
    })

    // CREATE BINANCE OBJECT
    const exchangeId = 'binance'
        , exchangeClass = ccxt[exchangeId]
        , exchange = new exchangeClass ({
            'apiKey': '',
            'secret': '',
            'timeout': 30000,
            'enableRateLimit': true,
        })

    //console.log (bittrex.id,  await bittrex.loadMarkets ())
   // console.log (bittrex.id,  await bittrex.fetchOrderBook (bittrex.symbols[0]))
    let LINKUSD = await bittrex.fetchTicker ('LINK/USD');
   // console.log (bittrex.id, await bittrex.fetchBalance ())
    console.log(LINKUSD.last);

    // sell 1 BTC/USD for market price, sell a bitcoin for dollars immediately
   // console.log (okcoinusd.id, await okcoinusd.createMarketSellOrder ('BTC/USD', 1))


    // buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
   // console.log (okcoinusd.id, await okcoinusd.createLimitBuyOrder ('BTC/USD', 1, 2500.00))

    // pass/redefine custom exchange-specific order params: type, amount, price or whatever
    // use a custom order type

//  bitfinex.createLimitSellOrder ('BTC/USD', 1, 10, { 'type': 'trailing-stop' })

    

}) ();