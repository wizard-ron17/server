const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server is running');
});

router.get('/api/account/userAccount', async (req, res) => {
    try {
        const { userAccount } = req.params;
        // Call your API to fetch account data
        const response = await axios.get(`https://backend2.euclabs.net/kadena-indexer/v1/account/${userAccount}`);
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

app.use('/.netlify/functions/server/api', router);

module.exports = app;
module.exports.handler = serverless(app);
