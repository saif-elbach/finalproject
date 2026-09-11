const handler = require('./handler.js');

async function runTests() {
    console.log("--- TEST 1: Submitting a valid task request ---");
    const validPayload = { requesterId: "student_abc", taskDescription: "Need help moving a couch near Piazza Walther" };
    const res1 = await handler.createOnDemandRequest(validPayload);
    console.log(JSON.stringify(res1, null, 2));

    console.log("\n--- TEST 2: Submitting an invalid request (Missing Data) ---");
    const invalidPayload = { requesterId: "student_abc" }; // Missing taskDescription
    const res2 = await handler.createOnDemandRequest(invalidPayload);
    console.log(JSON.stringify(res2, null, 2));
}

runTests();