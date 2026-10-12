const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9QlKlw4bd75YSHjv6CKoyGsRE-q9e0VLsMOzr6lbXncYauDccXoCqlqj8-cKUVBf2xg/exec';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  const method = event.httpMethod;
  let url = SCRIPT_URL;
  let options = {
    method: method,
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'application/json'
    }
  };

  if (method === 'GET') {
    const params = event.queryStringParameters || {};
    if (Object.keys(params).length > 0) {
      url += '?' + new URLSearchParams(params);
    }
  } else if (method === 'POST') {
    options.body = event.body;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  options.signal = controller.signal;

  try {
    const res = await fetch(url, options);
    clearTimeout(timeoutId);
    const text = await res.text();
    
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: text
    };
  } catch(e) {
    clearTimeout(timeoutId);
    const esTimeout = e.name === 'AbortError';
    return {
      statusCode: esTimeout ? 504 : 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: esTimeout ? 'Timeout esperando respuesta del backend' : e.toString() })
    };
  }
};
