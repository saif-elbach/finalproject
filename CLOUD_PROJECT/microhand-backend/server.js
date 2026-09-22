require('dotenv').config(); 

const express = require('express');
const app = express();
const PORT = 3000;

const helperHandler = require('./helper-service/handler.js');
const requestHandler = require('./request-service/handler.js');

app.use(express.json());

app.get('/profile', async (req, res) => {
    try {
        const event = { helperId: req.query.helperId };
        const lambdaResponse = await helperHandler.getHelperProfile(event);
        res.status(lambdaResponse.statusCode).set(lambdaResponse.headers).send(lambdaResponse.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/request', async (req, res) => {
    try {
        const event = { body: JSON.stringify(req.body) };
        const lambdaResponse = await requestHandler.createOnDemandRequest(event);
        res.status(lambdaResponse.statusCode).set(lambdaResponse.headers).send(lambdaResponse.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Local Simulation Server running at http://localhost:${PORT}`);
    console.log(`AWS Region Loaded: ${process.env.AWS_REGION}`);
});