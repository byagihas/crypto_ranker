// Simple Nodejs program to pull top 100 cryptocurrencies from the Coinranking Public API
// Run: node data.js
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const request = require('request');
const rp = require('request-promise');

let crypto = {};

// Set request parameters here
// Add CLI functionality and more parameters in the future
const fiatType = 'USD';
const lookbackWindow = '7d';
const numberOfCoins = '100';

// Optional: use node-cron to automate request every minute
// cron.schedule('* * * * *', () => {
// Request top 100 Cryptocurrencies in the last seven days from Coinranking Public API
rp(`https://api.coinranking.com/v2?base=${fiatType}&timePeriod=${lookbackWindow}&limit=${numberOfCoins}`, (error, res) => {
    if (error) throw error
    // Create responsebody and crypto objects to parse then store the cryptocurrency data
    let responsebody = JSON.parse(res.body);
    crypto = responsebody.data.coins;
    console.log('Data ingested');
}).then(() => {
    // Write JSON file
    fs.writeFile('./coinranking.json', JSON.stringify(crypto), (err) => {
        if (err) throw err;
        console.log('JSON file saved:' + __dirname + '/coinranking.json');
    });
});
// Optional: node cron ending bracket
//})