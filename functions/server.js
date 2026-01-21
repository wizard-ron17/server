const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Rate limiting: 1 request per minute per URL
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each URL to 1 request per windowMs
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

router.get('/api/historical-trades/aura', limiter, async (req, res) => {
  try {
    const { ticker, start_time } = req.params;
    const apiUrl = `https://api.elexium.finance/coingecko/historical_trades?ticker=tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq_ywWQo64HBSMXcv3XBLrm8WjY2Co43BpYJPB3YoSDd4xX&start_time=1753990195898`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical trades data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/historical-trades/abx', limiter, async (req, res) => {
  try {
    const { ticker, start_time } = req.params;
    const apiUrl = `https://api.elexium.finance/coingecko/historical_trades?ticker=tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq_258k9T6WqezTLdfGvHixXzK1yLATeSPuyhtcxzQ3V2pqV&start_time=1731471405000`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical trades data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/historical-trades/exy', limiter, async (req, res) => {
  try {
    const { ticker, start_time } = req.params;
    const apiUrl = `https://api.elexium.finance/coingecko/historical_trades?ticker=26ZZNScke9xJyVcZAktVGvwRwRd8ArVtpXK2hqpEK6UsR_28LgMeQGdvtXfsvWhpNNVx1DoSiz7TzrATv9qxMQP5is9&start_time=1731471405000`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical trades data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/historical-trades/nutty', limiter, async (req, res) => {
  try {
    const { ticker, start_time } = req.params;
    const apiUrl = `https://api.elexium.finance/coingecko/historical_trades?ticker=tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq_vAvrGnhguy8X3Njmd8ENPShxyEJhiHJcu28fw8Tnk3rP&start_time=1735957661000`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical trades data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/esp32/prices', async (req, res) => {
  try {
    // Fetch all prices concurrently
    const [btcRes, alphRes, auraRes, exyRes, abxRes, xagRes] = await Promise.all([
      axios.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC'),
      axios.get('https://api.coinpaprika.com/v1/coins/alph-alephium/ohlcv/today'),
      axios.get('https://rons-server.netlify.app/.netlify/functions/server/api/historical-trades/aura'),
      axios.get('https://rons-server.netlify.app/.netlify/functions/server/api/historical-trades/exy'),
      axios.get('https://rons-server.netlify.app/.netlify/functions/server/api/historical-trades/abx'),
      axios.get('https://api.gold-api.com/price/XAG')
    ]);

    // Extract prices
    const btcPrice = btcRes.data.data.rates.USD;
    const alphPrice = alphRes.data[0].close;
    
    // Get last trade price from arrays
    const auraPrice = auraRes.data[auraRes.data.length - 1].price;
    const exyPrice = exyRes.data[exyRes.data.length - 1].price;
    const abxPrice = abxRes.data[abxRes.data.length - 1].price;
    
    const xagPrice = xagRes.data.price;

    // Return consolidated response
    res.json({
      btc: {
        price: parseFloat(btcPrice).toFixed(2),
        unit: "USD"
      },
      alph: {
        price: alphPrice.toFixed(4),
        unit: "USD"
      },
      aura: {
        price: auraPrice.toFixed(4),
        unit: "ALPH"
      },
      exy: {
        price: exyPrice.toFixed(4),
        unit: "EX"
      },
      abx: {
        price: abxPrice.toFixed(4),
        unit: "ALPH"
      },
      xag: {
        price: xagPrice.toFixed(2),
        unit: "USD"
      }
    });
  } catch (error) {
    console.error('Error fetching ESP32 prices:', error);
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
module.exports.handler = serverless(app);
