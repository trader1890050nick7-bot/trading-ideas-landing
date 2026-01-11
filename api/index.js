import mailchimp from '@mailchimp/mailchimp_marketing';

// Настройка Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Валидация
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Пожалуйста, введите корректный email'
    });
  }

  try {
    // Добавление подписчика в Mailchimp
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: 'subscribed',
      }
    );

    console.log('Successfully added contact:', email);

    return res.status(200).json({
      success: true,
      message: 'Спасибо за подписку! Проверьте email для подтверждения.'
    });

  } catch (error) {
    console.error('Mailchimp error:', error.response?.body || error);

    // Если email уже существует
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      return res.status(200).json({
        success: true,
        message: 'Вы уже подписаны на рассылку!'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Произошла ошибка. Попробуйте позже.'
    });
  }
}
