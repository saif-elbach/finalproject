// A local mock array simulating your DynamoDB Table for tasks/requests
const mockRequestsTable = [];

exports.createOnDemandRequest = async (event) => {
    try {
        // Parse the incoming request body (simulating what API Gateway forwards)
        const body = event.body ? JSON.parse(event.body) : event;

        // Check for required input properties
        if (!body.requesterId || !body.taskDescription) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Bad Request: Missing requesterId or taskDescription." })
            };
        }

        // Create a new task item with a generated ID and timestamp
        const newRequest = {
            RequestID: "req_" + Math.random().toString(36).substr(2, 9),
            RequesterID: body.requesterId,
            TaskDescription: body.taskDescription,
            Status: "PENDING",
            Timestamp: Date.now() // Essential for your logging metrics later!
        };

        // Simulate writing/saving to DynamoDB
        mockRequestsTable.push(newRequest);

        return {
            statusCode: 201, // 201 means "Created" successfully
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "On-demand request posted successfully to Local Mock DB!",
                insertedData: newRequest
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message })
        };
    }
};