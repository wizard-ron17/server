const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`Rons Server is running✅/nCurrent Endpoints: 'api/account/<kadenaAccount>'`)
});

router.get('/api/', (req, res) => {
  res.send("Current Endpoints: 'api/account/<kadenaAccount>'")
});

router.get('/api/account/', (req, res) => {
  res.send("Please provide a Kadena account address after '/account/'")
});

router.get('/api/account/:userAccount/:assetId?', async (req, res) => {
    try {
        const { userAccount, assetId } = req.params;

        let apiUrl = `https://backend2.euclabs.net/kadena-indexer/v1/account/${userAccount}`;
        
        // If assetId is provided, append it to the API URL
        if (assetId) {
            apiUrl += `/${assetId}`;
        }

        // Call your API to fetch account data using userAccount and optionally assetId
        const response = await axios.get(apiUrl);
        // Extract and send the response data back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching API data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/.netlify/functions/server/', router);

module.exports = app;
module.exports.handler = serverless(app);
