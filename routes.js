const Router = require('express-promise-router');
const ejs = require('ejs');

const Monitor = require('./monitor.js');

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
    res.send(home_html);
    res.end();
});

app.get('/balances', (req, res) => {
    Monitor.getBalances.then((data) => {
        res.send(data);
        res.end();
    });
});

module.exports = app;