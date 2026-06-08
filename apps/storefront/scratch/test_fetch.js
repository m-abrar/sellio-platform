const axios = require('axios');

async function testFetch() {
  try {
    console.log("Fetching http://127.0.0.1:8000/api/v1/properties...");
    const res = await axios.get('http://127.0.0.1:8000/api/v1/properties');
    console.log("Status Code:", res.status);
    console.log("Top-level Keys:", Object.keys(res.data));
    console.log("Is array or object:", Array.isArray(res.data) ? "ARRAY" : typeof res.data);
    
    if (res.data && res.data.data) {
      console.log("data key length:", res.data.data.length);
      if (res.data.data.length > 0) {
        console.log("First item sample title:", res.data.data[0].title);
        console.log("First item keys:", Object.keys(res.data.data[0]));
      }
    } else {
      console.log("Response body sample (first 500 chars):", JSON.stringify(res.data).substring(0, 500));
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

testFetch();
