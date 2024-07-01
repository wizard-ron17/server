const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`Ron's Server is running✅ /n Current Endpoints: 'api/account/<kadenaAccount>', 'api/transfers-history/<kadenaAccount>'`);
});

router.get('/api/', (req, res) => {
  res.send("Current Endpoints: 'api/account/<kadenaAccount>', 'api/transfers-history/<kadenaAccount>'");
});

router.get('/api/account/', (req, res) => {
  res.send("Please provide a Kadena account address after '/account/'");
});

router.get('/api/account/:userAccount/:assetId?', async (req, res) => {
  try {
    const { userAccount, assetId } = req.params;

    let apiUrl = `https://backend2.euclabs.net/kadena-indexer/v1/account/${userAccount}`;
    
    if (assetId) {
      apiUrl += `/${assetId}`;
    }

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching API data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New route for Kadena transaction history
router.get('/api/transfers-history/:kadenaAccount', async (req, res) => {
  try {
    const { kadenaAccount } = req.params;
    const apiUrl = `https://backend2.euclabs.net/kadena-indexer/v3/transfers-history/${kadenaAccount}`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching transfers history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New route to proxy the pools API
router.get('/api/alph-pools', async (req, res) => {
  try {
    const apiUrl = 'https://indexer.alph.pro/api/pools';
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching pools data:', error);
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
