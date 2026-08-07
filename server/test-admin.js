const testAdmin = async () => {
  const baseUrl = "http://localhost:5000/api";
  let cookie = "";

  console.log("0. Logging in as Admin...");
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@store.com",
      password: "Password@123",
    }),
  });
  
  if (!loginRes.ok) {
    console.error("Failed to login as admin", await loginRes.json());
    return;
  }
  cookie = loginRes.headers.get("set-cookie").split(";")[0];
  console.log("Logged in successfully!");

  console.log("\n1. Testing GET /admin/dashboard...");
  const dashRes = await fetch(`${baseUrl}/admin/dashboard`, { headers: { cookie } });
  console.log(await dashRes.json());

  console.log("\n2. Testing POST /admin/users (Create OWNER)...");
  const ownerRes = await fetch(`${baseUrl}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      name: "New Store Owner 12345",
      email: `owner${Date.now()}@test.com`,
      password: "Password@123!",
      address: "Owner City",
      role: "OWNER"
    }),
  });
  const ownerData = await ownerRes.json();
  console.log(ownerData);
  const ownerId = ownerData.data.user.id;

  console.log("\n3. Testing POST /admin/stores...");
  const storeRes = await fetch(`${baseUrl}/admin/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      name: "Super Mart",
      email: `store${Date.now()}@mart.com`,
      address: "Downtown",
      ownerId: ownerId
    }),
  });
  console.log(await storeRes.json());

  console.log("\n4. Testing GET /admin/users with Pagination, Search, & Filter...");
  const usersRes = await fetch(`${baseUrl}/admin/users?page=1&limit=2&search=Store&role=OWNER`, { headers: { cookie } });
  console.log(await usersRes.json());

  console.log(`\n5. Testing GET /admin/users/${ownerId}...`);
  const userDetailRes = await fetch(`${baseUrl}/admin/users/${ownerId}`, { headers: { cookie } });
  console.log(await userDetailRes.json());

  console.log("\n6. Testing GET /admin/stores...");
  const storesRes = await fetch(`${baseUrl}/admin/stores?sortBy=name&sortOrder=desc`, { headers: { cookie } });
  console.log(JSON.stringify(await storesRes.json(), null, 2));

};

testAdmin().catch(console.error);
