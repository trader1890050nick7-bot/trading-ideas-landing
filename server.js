// Локальный сервер для разработки
// Эмулирует Vercel serverless окружение

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Эмуляция Vercel serverless функции
app.post('/api', async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Пожалуйста, введите корректный email'
    });
  }

  // Log subscription (в локальной разработке без Mailchimp)
  console.log('New subscription:', email);
  console.log('NOTE: Mailchimp integration is disabled in local development');

  // Success response
  return res.status(200).json({
    success: true,
    message: 'Спасибо за подписку! Проверьте email для подтверждения.'
  });
});

// Handle OPTIONS for CORS preflight
app.options('/api', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Локальный сервер запущен на http://localhost:${PORT}`);
  console.log(`Для продакшена используйте: vercel --prod`);
  console.log(`NOTE: Mailchimp API не используется локально`);
});
