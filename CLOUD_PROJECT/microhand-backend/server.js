const express = require('express');
const app = express();
const PORT = 3000;

// Import the lambda handlers from your two microservices
const helperHandler = require('./helper-service/handler.js');
const requestHandler = require('./request-service/handler.js');

app.use(express.json());

// Route for the Read-Heavy Helper Profile Service
app.get('/profile', async (req, res) => {
    // Forward query parameter helperId if provided (e.g., /profile?helperId=user_456)
    const event = { helperId: req.query.helperId };
    const lambdaResponse = await helperHandler.getHelperProfile(event);
    
    res.status(lambdaResponse.statusCode).set(lambdaResponse.headers).send(lambdaResponse.body);
});

// Route for the Write-Heavy On-Demand Request Service
app.post('/request', async (req, res) => {
    const event = { body: JSON.stringify(req.body) };
    const lambdaResponse = await requestHandler.createOnDemandRequest(event);
    
    res.status(lambdaResponse.statusCode).set(lambdaResponse.headers).send(lambdaResponse.body);
});

app.listen(PORT, () => {
    console.log(`🚀 Local Simulation Server running at http://localhost:${PORT}`);
    console.log(`👉 GET  http://localhost:${PORT}/profile`);
    console.log(`👉 POST http://localhost:${PORT}/request`);
});