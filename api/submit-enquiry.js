/**
 * Vercel serverless handler for enquiry form POST (preview / static deploy).
 */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end('Method not allowed');
  }

  const raw = await readBody(req);
  const params = new URLSearchParams(raw);

  if (params.get('website_url')) {
    res.statusCode = 400;
    return res.end('Spam detected.');
  }

  const refId = `GK-${Math.floor(100000 + Math.random() * 900000)}`;
  res.statusCode = 302;
  res.setHeader('Location', `/thank-you/?ref=${refId}`);
  return res.end();
};
