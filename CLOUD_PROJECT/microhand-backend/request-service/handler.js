require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Connect to Cloud AWS DynamoDB using environment variables
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});
const docClient = DynamoDBDocumentClient.from(client);

module.exports.createOnDemandRequest = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

        if (!body || !body.requesterId || !body.taskDescription) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing requesterId or taskDescription" })
            };
        }

        const newRequest = {
            RequestID: `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            RequesterID: body.requesterId,
            TaskDescription: body.taskDescription,
            Status: "PENDING",
            CreatedAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: "OnDemandRequests",
            Item: newRequest
        });

        await docClient.send(command);

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "On-demand request created successfully",
                request: newRequest
            })
        };
    } catch (error) {
        console.error("DynamoDB Cloud Put Error:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};