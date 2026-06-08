const axios = require('axios');

async function test() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/vehicles', {
      params: { per_page: 6 }
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      if (typeof error.response.data === 'object') {
        console.error('Error Message:', error.response.data.message);
        console.error('Error Exception:', error.response.data.exception);
      } else {
        console.error('Error Body:', error.response.data.slice(0, 1000));
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

test();
