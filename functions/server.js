const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Rate limiting: 1 request per minute per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // limit each IP to 1 request per windowMs
  message: 'Too many requests, please try again after a minute.',
});

const app = express();
const router = express.Router();

// Middleware to log the domain (Referer or Origin)
app.use((req, res, next) => {
  const referer = req.get('Referer');
  const origin = req.get('Origin');
  console.log('Request received from domain: ', referer || origin || 'Direct access (No origin or referer)');
  next();
});

router.get('/', (req, res) => {
  res.send(`Ron's Server is running✅ \n Current Endpoints: 'api/account/<kadenaAccount>', 'api/transfers-history/<kadenaAccount>', 'api/txn/<requestKey>'`);
});

router.get('/api/', (req, res) => {
  res.send("Current Endpoints: 'api/account/<kadenaAccount>', 'api/transfers-history/<kadenaAccount>'");
});

router.get('/api/account/', (req, res) => {
  res.send("Please provide a Kadena account address after '/account/'");
});

router.get('/api/transfers-history/', (req, res) => {
  res.send("Please provide a Kadena account address after '/transfers-history/'");
});

router.get('/api/txn/', (req, res) => {
  res.send("Please provide a Kadena txn request key after '/txn/'");
});

// Endpoints
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

router.get('/api/txn/:requestKey', async (req, res) => {
  try {
    const { requestKey } = req.params;
    const apiUrl = `https://backend2.euclabs.net/kadena-indexer/v2/tx-details/${requestKey}`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching txn details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Apply rate limiting to all routes
app.use('/.netlify/functions/server/', limiter, router);

module.exports = app;
module.exports.handler = serverless(app);
