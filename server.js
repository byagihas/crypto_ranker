'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lessMiddleware = require('less-middleware');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const rp = require('request-promise');
const encoding_f = require('encoding');
const Routes = require('./routes.js');
const config = require('./config.js');
const app = express();

app.enable('trust proxy'); // Enable for reverse proxy
app.set('view engine', 'ejs');

// Set up limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300 // limit each IP to 100 requests per windowMs
});

// Apply limiter to all requests
app.use(limiter);

// Start main server code
app.use(helmet());
app.use(helmet.referrerPolicy({
    policy: 'same-origin'
}));

// Compression
app.use(compression());

// EJS and Content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(lessMiddleware(__dirname + '/views'));
app.use(express.static(__dirname + '/views'));
app.use('/media', express.static(__dirname + '/media'));

// ./routes.js
app.use(Routes);

app.listen(process.env.PORT, process.env.IP, () => console.log(`Server running on port ${process.env.PORT}`));