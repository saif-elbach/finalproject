const handler = require('./handler.js');

async function runTests() {
    console.log("--- TEST 1: Fetching existing user_123 ---");
    const res1 = await handler.getHelperProfile({ helperId: "user_123" });
    console.log(JSON.stringify(res1, null, 2));

    console.log("\n--- TEST 2: Fetching non-existent user_999 ---");
    const res2 = await handler.getHelperProfile({ helperId: "user_999" });
    console.log(JSON.stringify(res2, null, 2));
}

runTests();