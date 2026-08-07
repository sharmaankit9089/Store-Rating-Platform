

const baseUrl = "http://localhost:5000/api";
let cookie = "";

const runTests = async () => {
  try {
    // 1. Signup and login as a normal user to get a cookie
    const email = `testuser_${Date.now()}@test.com`;
    const signupRes = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Normal User 123456789",
        email,
        password: "Password@123",
        address: "Test Address",
      }),
    });
    if (!signupRes.ok) {
        console.error("Signup failed:", await signupRes.json());
        return;
    }

    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "Password@123" }),
    });
    
    const setCookieHeader = loginRes.headers.get("set-cookie");
    if (!setCookieHeader) {
        console.error("Login failed, response:", await loginRes.json());
        return;
    }
    cookie = setCookieHeader.split(";")[0];
    console.log("0. Logged in as User...");

    // 2. GET /user/stores
    console.log("\n1. Testing GET /user/stores...");
    const storesRes = await fetch(`${baseUrl}/user/stores?limit=5`, { headers: { cookie } });
    const stores = await storesRes.json();
    console.log(stores);
    
    const firstStoreId = stores.data.items[0]?.id;
    if (!firstStoreId) return console.log("No stores to test ratings on.");

    // 3. POST /user/ratings
    console.log(`\n2. Testing POST /user/ratings on Store ID ${firstStoreId}...`);
    const rateRes = await fetch(`${baseUrl}/user/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({ storeId: firstStoreId, rating: 4 }),
    });
    console.log(await rateRes.json());

    // 4. PUT /user/ratings/:storeId
    console.log(`\n3. Testing PUT /user/ratings/${firstStoreId}...`);
    const updateRes = await fetch(`${baseUrl}/user/ratings/${firstStoreId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({ rating: 5 }),
    });
    console.log(await updateRes.json());

    // 5. GET /user/stores/:id (should show myRating as 5)
    console.log(`\n4. Testing GET /user/stores/${firstStoreId} to verify myRating...`);
    const storeDetails = await fetch(`${baseUrl}/user/stores/${firstStoreId}`, { headers: { cookie } });
    console.log(await storeDetails.json());

  } catch (err) {
    console.error("Test failed:", err);
  }
};

runTests();
