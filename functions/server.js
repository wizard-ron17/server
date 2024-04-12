const express = require('express');
const axios = require('axios');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors());

// Root route handler
app.get('/', (req, res) => {
  res.send('Server is running');
});

// API route handler
app.get('/api/account/:account', async (req, res) => {
    try {
        const { account } = req.params;
        const response = await axios.get(`https://backend2.euclabs.net/kadena-indexer/v1/account/${account}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching API data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export your Express app as a Netlify Function handler
module.exports.handler = serverless(app);
