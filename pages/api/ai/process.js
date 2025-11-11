// pages/api/ai/process.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    // هنا هنضيف كود OpenAI لاحقاً
    return res.status(200).json({
      success: true,
      response: 'تم استلام الرسالة: ' + message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'فشل معالجة الطلب'
    });
  }
}