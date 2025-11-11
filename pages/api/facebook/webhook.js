// pages/api/facebook/webhook.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { hub } = req.query;
    if (hub.verify_token === process.env.FB_VERIFY_TOKEN) {
      return res.status(200).send(hub.challenge);
    }
    return res.status(403).send('Forbidden');
  }

  if (req.method === 'POST') {
    const { entry } = req.body;
    // معالجة الرسائل هنا
    res.status(200).send('OK');
  }
}