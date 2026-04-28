const fetch = require('node-fetch');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9QlKlw4bd75YSHjv6CKoyGsRE-q9e0VLsMOzr6lbXncYauDccXoCqlqj8-cKUVBf2xg/exec';

exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const url = SCRIPT_URL + '?' + new URLSearchParams(params);
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.toString() })
    };
  }
};
