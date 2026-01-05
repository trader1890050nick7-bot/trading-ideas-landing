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
    form.addEventListener('submit', function(e) {
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

        // Если валидация прошла успешно
        showMessage('Спасибо! Проверьте ваш email для подтверждения подписки', 'success');

        // Очистка формы
        emailInput.value = '';
        emailInput.blur();
    });
});
