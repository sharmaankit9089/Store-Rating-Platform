
const baseUrl = "http://localhost:5000/api";
let adminCookie = "";
let ownerCookie = "";
let userCookie = "";
let ownerEmail = `owner_${Date.now()}@test.com`;
let ownerId = null;
let storeId = null;

const runTests = async () => {
  try {
    // 1. Admin login to create Owner and Store
    const adminLogin = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@store.com", password: "Password@123" }),
    });
    const setCookieHeader = adminLogin.headers.get("set-cookie");
    if (!setCookieHeader) {
        console.error("Admin login failed:", await adminLogin.json());
        return;
    }
    adminCookie = setCookieHeader.split(";")[0];

    // Create Owner
    const createOwnerRes = await fetch(`${baseUrl}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({
        name: "Test Owner 1234567890",
        email: ownerEmail,
        password: "Password@123",
        address: "Owner Street",
        role: "OWNER",
      }),
    });
    if (!createOwnerRes.ok) {
        console.error("Owner creation failed:", await createOwnerRes.json());
        return;
    }
    const ownerData = await createOwnerRes.json();
    ownerId = ownerData.data.user.id;

    // Create Store
    const createStoreRes = await fetch(`${baseUrl}/admin/stores`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({
        name: "Test Store",
        email: `store_${Date.now()}@test.com`,
        address: "Store Street",
        ownerId,
      }),
    });
    const storeData = await createStoreRes.json();
    storeId = storeData.data.store.id;

    console.log("0. Admin created Owner and Store...");

    // 2. Login as Owner
    const ownerLogin = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ownerEmail, password: "Password@123" }),
    });
    ownerCookie = ownerLogin.headers.get("set-cookie").split(";")[0];
    console.log("\n1. Logged in as Owner...");

    // 3. Test GET /owner/dashboard
    console.log("\n2. Testing GET /owner/dashboard...");
    const dashboardRes = await fetch(`${baseUrl}/owner/dashboard`, { headers: { cookie: ownerCookie } });
    console.log(await dashboardRes.json());

    // 4. Test GET /owner/store
    console.log("\n3. Testing GET /owner/store...");
    const storeDetails = await fetch(`${baseUrl}/owner/store`, { headers: { cookie: ownerCookie } });
    console.log(await storeDetails.json());

    // 5. Normal User rates the store
    const userEmail = `user_${Date.now()}@test.com`;
    await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Normal User 123456789",
        email: userEmail,
        password: "Password@123",
        address: "User Street",
      }),
    });
    const userLogin = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: "Password@123" }),
    });
    userCookie = userLogin.headers.get("set-cookie").split(";")[0];

    await fetch(`${baseUrl}/user/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: userCookie },
      body: JSON.stringify({ storeId, rating: 5 }),
    });
    console.log("\n4. Normal user submitted a 5-star rating...");

    // 6. Test GET /owner/ratings
    console.log("\n5. Testing GET /owner/ratings...");
    const ratingsRes = await fetch(`${baseUrl}/owner/ratings`, { headers: { cookie: ownerCookie } });
    console.log(JSON.stringify(await ratingsRes.json(), null, 2));

  } catch (err) {
    console.error("Test failed:", err);
  }
};

runTests();
