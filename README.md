# Trading Ideas Landing Page

Лендинг для подписки на еженедельные торговые идеи и сигналы по фондовому рынку.

## Описание

Современный и адаптивный одностраничный сайт с возможностью подписки на рассылку торговых идей. Проект включает в себя Express.js бэкенд для обработки подписок и красивый фронтенд с анимациями и интерактивными элементами.

## Возможности

- 📈 Полностью адаптивный дизайн для всех устройств
- ✅ Двойная валидация email (на клиенте и сервере)
- 💾 Сохранение подписок в JSON файл
- 🔒 CORS защита
- ⚡ Быстрый Express.js backend
- 🎨 Современный UI с анимациями и градиентами
- 📊 Примеры торговых идей с интерактивными графиками
- ✉️ Страница благодарности после подписки
- 🚀 Готов к деплою на различные платформы

## Требования

Перед установкой убедитесь, что у вас установлены:

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0

Проверить версии можно командами:
```bash
node --version
npm --version
```

## Установка

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd trading-ideas-landing
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Создайте файл .env (опционально):**
```bash
cp .env.example .env
```

Отредактируйте `.env` файл при необходимости:
```env
PORT=3000
NODE_ENV=development
```

## Запуск локально

### Режим разработки

Запустите сервер разработки:
```bash
npm run dev
```

Или:
```bash
npm start
```

Приложение будет доступно по адресу: `http://localhost:3000`

### Изменение порта

Чтобы запустить на другом порту:
```bash
PORT=8080 npm start
```

## Структура проекта

```
trading-ideas-landing/
├── index.html          # Главная страница с формой подписки
├── thank-you.html      # Страница благодарности
├── styles.css          # Все стили приложения
├── app.js              # Клиентский JavaScript (обработка формы)
├── server.js           # Express сервер и API endpoints
├── package.json        # Зависимости и скрипты
├── emails.json         # Хранилище подписок (создается автоматически)
├── Nasdaq.jpg          # Изображение для примера торговой идеи
├── .gitignore          # Игнорируемые файлы
├── .env                # Переменные окружения (не в git)
└── README.md           # Документация
```

## API Endpoints

### POST /subscribe

Подписка на рассылку торговых идей.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (успех - 201):**
```json
{
  "success": true,
  "message": "Подписка успешно оформлена! Проверьте ваш email"
}
```

**Response (ошибка - 400):**
```json
{
  "success": false,
  "message": "Некорректный формат email"
}
```

**Response (уже подписан - 409):**
```json
{
  "success": false,
  "message": "Этот email уже подписан"
}
```

### GET /subscribers

Получить список всех подписчиков (для тестирования и администрирования).

**Response:**
```json
{
  "success": true,
  "count": 2,
  "subscribers": [
    {
      "email": "user@example.com",
      "subscribedAt": "2026-01-06T12:00:00.000Z"
    }
  ]
}
```

## Интеграция с Mailchimp API

Для отправки реальных email рассылок рекомендуется интегрировать Mailchimp API.

### Шаг 1: Создание аккаунта Mailchimp

1. Зарегистрируйтесь на [Mailchimp](https://mailchimp.com/)
2. Создайте новый Audience (список рассылки)
3. Получите API ключ в разделе Account → Extras → API keys

### Шаг 2: Установка Mailchimp SDK

```bash
npm install @mailchimp/mailchimp_marketing
```

### Шаг 3: Настройка переменных окружения

Добавьте в `.env` файл:
```env
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your_audience_id_here
```

Где:
- `MAILCHIMP_API_KEY` - ваш API ключ из Mailchimp
- `MAILCHIMP_SERVER_PREFIX` - префикс сервера (например, us1, us2, и т.д.)
- `MAILCHIMP_AUDIENCE_ID` - ID вашего списка рассылки

### Шаг 4: Обновление server.js

Добавьте в начало `server.js`:

```javascript
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});
```

Обновите endpoint `/subscribe`:

```javascript
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Валидация email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email адрес обязателен'
            });
        }

        // Добавление в Mailchimp
        const response = await mailchimp.lists.addListMember(
            process.env.MAILCHIMP_AUDIENCE_ID,
            {
                email_address: email,
                status: 'subscribed'
            }
        );

        // Также сохраняем в локальный файл для резервной копии
        const emails = await readEmails();
        emails.push({
            email: email,
            subscribedAt: new Date().toISOString(),
            mailchimpId: response.id
        });
        await saveEmails(emails);

        res.status(201).json({
            success: true,
            message: 'Подписка успешно оформлена! Проверьте ваш email'
        });

    } catch (error) {
        console.error('Ошибка при обработке подписки:', error);

        // Обработка ошибки "уже подписан"
        if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
            return res.status(409).json({
                success: false,
                message: 'Этот email уже подписан'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Произошла ошибка сервера. Попробуйте позже'
        });
    }
});
```

### Получение Audience ID

1. Войдите в Mailchimp
2. Перейдите в Audience → All contacts
3. Нажмите Settings → Audience name and defaults
4. Скопируйте Audience ID (похож на `a1b2c3d4e5`)

## Деплой

### Деплой на Heroku

1. Установите [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. Войдите в Heroku:
```bash
heroku login
```

3. Создайте приложение:
```bash
heroku create your-app-name
```

4. Настройте переменные окружения:
```bash
heroku config:set NODE_ENV=production
heroku config:set MAILCHIMP_API_KEY=your_key
heroku config:set MAILCHIMP_SERVER_PREFIX=us1
heroku config:set MAILCHIMP_AUDIENCE_ID=your_id
```

5. Задеплойте:
```bash
git push heroku master
```

6. Откройте приложение:
```bash
heroku open
```

### Деплой на Vercel

1. Установите [Vercel CLI](https://vercel.com/download):
```bash
npm i -g vercel
```

2. Задеплойте:
```bash
vercel
```

3. Настройте переменные окружения в панели Vercel

### Деплой на Railway

1. Создайте аккаунт на [Railway.app](https://railway.app/)
2. Подключите GitHub репозиторий
3. Railway автоматически определит Node.js проект
4. Добавьте переменные окружения в настройках
5. Деплой произойдет автоматически

### Деплой на VPS (Ubuntu)

1. Установите Node.js и npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Склонируйте и настройте проект:
```bash
git clone <repository-url>
cd trading-ideas-landing
npm install
```

3. Установите PM2:
```bash
sudo npm install -g pm2
```

4. Запустите приложение:
```bash
pm2 start server.js --name "trading-ideas"
pm2 save
pm2 startup
```

5. Настройте Nginx как reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Технологии

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations, Gradients)
- Vanilla JavaScript (ES6+)

### Backend
- Node.js
- Express.js 5.x
- CORS middleware

### Рекомендуемые интеграции
- Mailchimp API (для email рассылок)
- Google Analytics (для аналитики)
- Hotjar (для анализа поведения пользователей)

## Тестирование

### Тестирование API локально

Используйте curl или Postman:

```bash
# Подписка
curl -X POST http://localhost:3000/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Получение подписчиков
curl http://localhost:3000/subscribers
```

### Тестирование в браузере

1. Откройте `http://localhost:3000`
2. Введите email в форму
3. Проверьте редирект на страницу благодарности
4. Откройте `http://localhost:3000/subscribers` для просмотра списка

## Решение проблем

### Порт занят

Если порт 3000 уже используется:
```bash
PORT=8080 npm start
```

### Ошибка EADDRINUSE

Найдите и остановите процесс:
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Не устанавливаются зависимости

Очистите кэш npm:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Безопасность

- Используйте HTTPS в продакшене
- Настройте rate limiting для защиты от спама
- Регулярно обновляйте зависимости: `npm audit fix`
- Не коммитьте `.env` файл в git
- Используйте environment variables для секретов

## Производительность

Для улучшения производительности в продакшене:

1. Включите сжатие:
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. Добавьте кэширование статических файлов в `server.js`:
```javascript
app.use(express.static(__dirname, {
  maxAge: '1d',
  etag: true
}));
```

## TODO / Будущие улучшения

- [ ] Интеграция с Mailchimp API
- [ ] Rate limiting для защиты от спама
- [ ] Админ панель для управления подписчиками
- [ ] Email подтверждение (double opt-in)
- [ ] Добавление Google Analytics
- [ ] Unit и integration тесты
- [ ] CI/CD pipeline
- [ ] Docker контейнеризация
- [ ] База данных вместо JSON файла

## Лицензия

ISC

## Поддержка

Если у вас возникли вопросы или проблемы, создайте issue в репозитории.

---

Создано с ❤️ для трейдеров
