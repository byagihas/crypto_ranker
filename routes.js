const Router = require('express-promise-router');
const ejs = require('ejs');

const Monitor = require('./monitor.js');
const Analyze = require('./analyze.js');
const { AppError } = require('./error.js');

//const db = require('./testdb.js');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const app = new Router();

let home_html = '<!doctype html><html lang="en">' + 
'<head><meta charset="utf-8"><title>CryptoMon</title><meta name="description" content="CryptoMon">' + 
'<meta name="author" content="CryptoMon"></head>' + 
'<body><div>CryptoMon</div><br/><div id=\'nav\'><a href=\'/balances\'>Balances</a></body></html>';

// Start Routes

app.get('/', (req, res) => {
    try {
        res.send(home_html);
        res.end();
    } catch(err) {
        throw new AppError(err,'/ Error', '404', 'Issue with / route', false);
    };
});

app.get('/balances', (req, res) => {
    try {
        Monitor.getBalances().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/balances Error', '404', 'Issue with /balances route', false);
    };
});

app.get('/buycurrencies', (req, res, err) => {
    try {
        Analyze.getBuyCurrencies().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err, '/buycurrencies Error', '404', 'Issue with /buycurrencies route', false);
    };
});

app.get('/sellcurrencies', (req, res) => {
    try {
        Analyze.getSellCurrencies().then((data) => {
        res.send(data);
        res.end();
        });
    } catch(err) {
        throw new AppError(err,'/sellcurrencies Error', '404', 'Issue with /sellcurrencies route', false);
    };
});

module.exports = app;