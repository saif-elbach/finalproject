require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});
const docClient = DynamoDBDocumentClient.from(client);

async function seedCloud() {
    const profiles = [
        { HelperID: "user_123", Name: "Alex", Skills: ["IT Support", "Moving"], Available: true },
        { HelperID: "user_456", Name: "Maria", Skills: ["Tutoring", "Italian"], Available: false }
    ];

    try {
        for (const item of profiles) {
            await docClient.send(new PutCommand({ TableName: "HelperProfiles", Item: item }));
            console.log(`Seeded profile to AWS: ${item.HelperID}`);
        }
    } catch (error) {
        console.error("Error seeding AWS tables:", error.message);
    }
}

seedCloud();