document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button[type="submit"]');

    // Регулярное выражение для валидации email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Создаем элемент для сообщений
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    form.appendChild(messageDiv);

    // Функция показа сообщения
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Функция скрытия сообщения
    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.className = 'form-message';
    }

    // Валидация при вводе
    emailInput.addEventListener('input', function() {
        hideMessage();
    });

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailValue = emailInput.value.trim();

        // Проверка на пустое поле
        if (!emailValue) {
            showMessage('Пожалуйста, введите email адрес', 'error');
            emailInput.focus();
            return;
        }

        // Проверка корректности email
        if (!emailRegex.test(emailValue)) {
            showMessage('Пожалуйста, введите корректный email адрес', 'error');
            emailInput.focus();
            return;
        }

        // Блокируем кнопку во время отправки
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        try {
            // Отправляем данные на сервер
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailValue })
            });

            const data = await response.json();

            if (response.ok) {
                // Успешная подписка - редирект на страницу благодарности
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 500);
            } else {
                // Ошибка от сервера
                showMessage(data.message || 'Произошла ошибка. Попробуйте позже', 'error');
            }
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            showMessage('Ошибка подключения к серверу. Попробуйте позже', 'error');
        } finally {
            // Разблокируем кнопку
            submitButton.disabled = false;
            submitButton.textContent = 'Подписаться';
        }
    });
});
