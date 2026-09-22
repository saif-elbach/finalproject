require("dotenv").config();
const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

async function createTables() {
    const helperTableParams = {
        TableName: "HelperProfiles",
        KeySchema: [{ AttributeName: "HelperID", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "HelperID", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST"
    };

    const requestTableParams = {
        TableName: "OnDemandRequests",
        KeySchema: [{ AttributeName: "RequestID", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "RequestID", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST"
    };

    try {
        console.log("Creating 'HelperProfiles' table in real AWS...");
        await client.send(new CreateTableCommand(helperTableParams));
        console.log("'HelperProfiles' created in AWS Cloud!");

        console.log("Creating 'OnDemandRequests' table in real AWS...");
        await client.send(new CreateTableCommand(requestTableParams));
        console.log("'OnDemandRequests' created in AWS Cloud!");
    } catch (error) {
        console.error("Error creating AWS tables:", error.message);
    }
}

createTables();