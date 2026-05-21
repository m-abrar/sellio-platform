const axios = require('axios');

async function test() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/themes/active', {
      headers: { 'X-Theme-Key': 'autos_luxury' }
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
  }
}

test();
