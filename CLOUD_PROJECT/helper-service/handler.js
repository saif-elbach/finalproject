require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

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

module.exports.getHelperProfile = async (event) => {
    const helperId = event.helperId || (event.queryStringParameters && event.queryStringParameters.helperId);

    if (!helperId) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Missing helperId query parameter" })
        };
    }

    try {
        const command = new GetCommand({
            TableName: "HelperProfiles",
            Key: { HelperID: helperId }
        });

        const response = await docClient.send(command);

        if (!response.Item) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: `Helper with ID '${helperId}' not found.` })
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Profile retrieved successfully", profile: response.Item })
        };
    } catch (error) {
        console.error("DynamoDB Cloud Get Error:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};