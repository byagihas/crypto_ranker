# Crytpocurrency Data Ingester

Pulls top 100 crypto from Coinranking.com Public API and writes the data to a .json file.

The previous(cmcap.js) data scraper/mood determiner is currently deprecated as significant formatting and memory rework is needed. Future plans to implement a better ranking and mood determiner.

Todo:
+Fix/rework cmcap.js scraper.
+Implement CLI functionality for Coinranking data request module
+Implement additional parameters for Coinranking API request pull
+Automate/add data viewer
+Create daily alert email for coins that have dropped or increase by 10 %
+Create Automated trader that buys in at decreases, sells at mass increase.

Use: 
a .env file is required with BITTREX_API_KEY and BITTREX_SECRET credentials for the monitor. See bittrex API docs for more info. After placing .env:

> npm install

> node data.js

