/* const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Rate limiting: 1 request per minute per URL
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // limit each URL to 1 request per windowMs
  message: 'Too many requests for this URL, please try again after a minute.',
  keyGenerator: (req, res) => req.originalUrl, // Limit by the full request URL
});

const app = express();
app.set('trust proxy', true); // Trust the first proxy
const router = express.Router();

// Middleware to log the full referer URL (including page path)
app.use((req, res, next) => {
  const referer = req.get('Referer');
  const origin = req.get('Origin');
  console.log('IP Address:', req.ip);

  if (referer) {
    console.log('Request received from URL: ', referer); // Logs full referer URL including page path
  } else if (origin) {
    console.log('Request received from domain: ', origin); // Logs only the domain if no referer is available
  } else {
    console.log('Request received from: Direct access (No referer or origin)');
  }
  
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

// Endpoints with URL-based rate limiting
router.get('/api/account/:userAccount/:assetId?', limiter, async (req, res) => {
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

router.get('/api/transfers-history/:kadenaAccount', limiter, async (req, res) => {
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

router.get('/api/txn/:requestKey', limiter, async (req, res) => {
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
app.use('/.netlify/functions/server/', router);

module.exports = app;
module.exports.handler = serverless(app); */
