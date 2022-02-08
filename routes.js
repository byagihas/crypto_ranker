'use strict';

const Router = require('express-promise-router');
const ejs = require('ejs');
const fs = require('fs');

const Monitor = require('./monitor.js');
const Analyze = require('./analyze.js');
const Algorithm = require('./algo.js');
const AppError = require('./error.js');

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
app.get('/', (req, res, err) => {
    try {
        Monitor.getPrices().then((data) => {
            res.render('all_crypto', { 'crypto': data });
            res.end();
        });
       // var file = fs.readFileSync('./coins.json');
    } catch(err) {
        throw new AppError(err,'/ Error', '404', 'Issue with / route', false);
    };
});

app.get('/:currency', (req, res, err) => {
    let currency = req.params.currency;
    try {
        Monitor.getPrice(currency).then((data) => {
            res.render('singular_crypto', { 'crypto': data });
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/ Error', '404', 'Issue with / route', false);
    };
});

app.get('/monitor', (req, res, err) => {
    try {
        Monitor.getBalances().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/balances Error', '404', 'Issue with /balances route', false);
    };
});

app.get('/tether', (req, res, err) => {
    try {
        Monitor.getTetherIndicator().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/tether Error', '404', 'Issue with /tether route', false);
    };
});

app.get('/buyit', (req, res, err) => {
    try {
        Analyze.getBuyCurrencies().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err, '/buycurrencies Error', '404', 'Issue with /buycurrencies route', false);
    };
});

app.get('/sellit', (req, res, err) => {
    try {
        Analyze.getSellCurrencies().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/sellcurrencies Error', '404', 'Issue with /sellcurrencies route', false);
    };
});

app.get('/algo', (req, res, err) => {
    try {
        const test = new Algorithm('LINK', 10);
        test.getBalances().then((data)=> {
            res.send(data);
        }); 
        
    } catch(err) {
        throw new AppError(err,'Algo Error', '404', 'Issue with /algo route', false);
    };
});

module.exports = app;