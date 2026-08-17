const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9QlKlw4bd75YSHjv6CKoyGsRE-q9e0VLsMOzr6lbXncYauDccXoCqlqj8-cKUVBf2xg/exec';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const url = SCRIPT_URL + '?' + new URLSearchParams(params);

  // Corta el pedido a los 20s en vez de dejarlo colgado hasta que Netlify
  // mate la función por su cuenta (eso generaba fallos "sin motivo aparente").
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    clearTimeout(timeoutId);
    const text = await res.text();
    JSON.parse(text); // validar que es JSON
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
      headers: CORS_HEADERS, // sin esto el navegador bloquea la lectura del error por CORS
      body: JSON.stringify({ error: esTimeout ? 'Timeout esperando respuesta del backend' : e.toString() })
    };
  }
};
