// Локальный сервер для разработки
// Для продакшена используется api/index.js на Vercel

const app = require('./api/index.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Для продакшена используйте: vercel --prod`);
});
