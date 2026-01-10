export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get email from body
  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Пожалуйста, введите корректный email'
    });
  }

  // Log subscription (в продакшене здесь будет Mailchimp)
  console.log('New subscription:', email);

  // Success response
  return res.status(200).json({
    success: true,
    message: 'Спасибо за подписку! Мы свяжемся с вами.'
  });
}
