const testAuth = async () => {
  const baseUrl = "http://localhost:5000/api/auth";
  let cookie = "";

  console.log("1. Testing Signup...");
  const signupRes = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User From Script",
      email: `test${Date.now()}@test.com`,
      password: "Password@123",
      address: "123 Test St",
    }),
  });
  const signupData = await signupRes.json();
  console.log(signupData);

  console.log("\n2. Testing Login...");
  const loginRes = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: signupData.data.user.email,
      password: "Password@123",
    }),
  });
  const loginData = await loginRes.json();
  console.log(loginData);
  
  // Extract cookie
  cookie = loginRes.headers.get("set-cookie").split(";")[0];

  console.log("\n3. Testing Get Current User (me)...");
  const meRes = await fetch(`${baseUrl}/me`, {
    method: "GET",
    headers: { cookie },
  });
  const meData = await meRes.json();
  console.log(meData);

  console.log("\n4. Testing Change Password...");
  const cpRes = await fetch(`${baseUrl}/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      oldPassword: "Password@123",
      newPassword: "NewPassword@123",
    }),
  });
  const cpData = await cpRes.json();
  console.log(cpData);

  console.log("\n5. Testing Logout...");
  const logoutRes = await fetch(`${baseUrl}/logout`, {
    method: "POST",
    headers: { cookie },
  });
  const logoutData = await logoutRes.json();
  console.log(logoutData);
};

testAuth().catch(console.error);
