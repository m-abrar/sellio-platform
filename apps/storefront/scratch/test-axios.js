const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Use interceptors to print the final resolved request URL
client.interceptors.request.use((config) => {
  console.log('Resolved request URL:', axios.getUri(config));
  return config;
});

client.get('/v1/properties').catch(() => {});
client.get('v1/properties').catch(() => {});
