// A local mock database simulating your DynamoDB Table
const mockDynamoDBTable = {
    "user_123": {
        HelperID: "user_123",
        Name: "Saifeddine",
        Skills: ["Language Tandem", "Coding Setup"],
        Availability: "Available"
    },
    "user_456": {
        HelperID: "user_456",
        Name: "Alex",
        Skills: ["Moving Help", "Groceries"],
        Availability: "Busy"
    }
};

exports.getHelperProfile = async (event) => {
    try {
        // Extracting helperId from the incoming test request, defaulting to user_123
        const helperId = event.helperId || "user_123";

        // Simulating a DynamoDB "Get" operation
        const resultItem = mockDynamoDBTable[helperId];

        if (!resultItem) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `Helper profile for ${helperId} not found.` })
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Helper profile retrieved successfully from Local Mock DB!",
                data: resultItem
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message })
        };
    }
};