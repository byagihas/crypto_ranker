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

// Start Routes

app.get('/', (req, res, err) => {
    try {
        res.render('all_crypto');
        res.end();
       // var file = fs.readFileSync('./coins.json');
    } catch(err) {
        throw new AppError(err,'/ Error', '404', 'Issue with / route', false);
    };
});

app.get('/currencies', (req, res, err) => {
    try {
        Monitor.getPrices().then((data) => {
            res.send(data);
            res.end();
        });
       // var file = fs.readFileSync('./coins.json');
    } catch(err) {
        throw new AppError(err,'/currencies Error', '404', 'Issue with /currencies route', false);
    };
});

app.get('/currencies/:currency', (req, res, err) => {
    let currency = req.params.currency;
    try {
        Monitor.getPrice(currency).then((data) => {
            res.send(data)
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/currencies/:currency Error', '404', 'Issue with /currencies/:currency route', false);
    };
});

app.get('/markets', (req, res, err) => {
    try {
        Monitor.getMarkets().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/markets Error', '404', 'Issue with /markets route', false);
    };
});

app.get('/monitor', (req, res, err) => {
    try {
        Monitor.getBalances().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/monitor Error', '404', 'Issue with /monitor route', false);
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
        throw new AppError(err, '/buyit Error', '404', 'Issue with /buyit route', false);
    };
});

app.get('/sellit', (req, res, err) => {
    try {
        Analyze.getSellCurrencies().then((data) => {
            res.send(data);
            res.end();
        });
    } catch(err) {
        throw new AppError(err,'/sellit Error', '404', 'Issue with /sellit route', false);
    };
});

app.get('/algo', (req, res, err) => {
    try {
        res.send('Under construction');
        res.end();
    } catch(err) {
        throw new AppError(err,'Algo Error', '404', 'Issue with /algo route', false);
    };
});

module.exports = app;