const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const EMAILS_FILE = path.join(__dirname, '..', 'emails.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Функция для чтения emails из файла
async function readEmails() {
    try {
        const data = await fs.readFile(EMAILS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Если файл не существует, возвращаем пустой массив
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Функция для сохранения emails в файл
async function saveEmails(emails) {
    await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf8');
}

// POST endpoint для подписки
app.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Валидация email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email адрес обязателен'
            });
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный формат email'
            });
        }

        // Читаем существующие emails
        const emails = await readEmails();

        // Проверяем, не подписан ли уже этот email
        const existingEmail = emails.find(item => item.email === email);
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: 'Этот email уже подписан'
            });
        }

        // Добавляем новый email
        const newSubscription = {
            email: email,
            subscribedAt: new Date().toISOString()
        };

        emails.push(newSubscription);

        // Сохраняем в файл
        await saveEmails(emails);

        // Отправляем успешный ответ
        res.status(201).json({
            success: true,
            message: 'Подписка успешно оформлена! Проверьте ваш email'
        });

    } catch (error) {
        console.error('Ошибка при обработке подписки:', error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка сервера. Попробуйте позже'
        });
    }
});

// GET endpoint для получения всех подписок (для тестирования)
app.get('/subscribers', async (req, res) => {
    try {
        const emails = await readEmails();
        res.json({
            success: true,
            count: emails.length,
            subscribers: emails
        });
    } catch (error) {
        console.error('Ошибка при получении подписчиков:', error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка сервера'
        });
    }
});

// Экспорт для Vercel serverless
module.exports = app;
