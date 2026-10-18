// 1. ЛОГИКА ВЫЕЗЖАЮЩЕЙ ПАНЕЛИ (Перебегание из А в Б)
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggleBtn.innerText = sidebar.classList.contains('open') ? '◀ Скрыть' : '🏙 Города';
});

// 2. ПЕРЕКЛЮЧЕНИЕ СТИЛИЗИРОВАННЫХ СТРАНИЦ ГОРОДОВ
const cityButtons = document.querySelectorAll('.city-btn');
const pageViews = document.querySelectorAll('.page-view');

cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс у кнопок
        cityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Переключаем экраны с анимацией затухания/проявления
        const targetPageId = btn.getAttribute('data-target');
        
        pageViews.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetPageId) {
                // Небольшой таймаут, чтобы анимация сработала корректно
                setTimeout(() => {
                    page.classList.add('active');
                }, 50);
            }
        });

        // Закрываем меню после выбора города (для удобства)
        sidebar.classList.remove('open');
        toggleBtn.innerText = '🏙 Города';
    });
});

// 3. ПЛАВНОЕ РАЗВОРАЧИВАНИЕ СПИСКА (АККОРДЕОН)
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const currentItem = header.parentElement;
        
        // Опционально: закрывать другие открытые элементы при открытии нового
        document.querySelectorAll('.accordion-item').forEach(item => {
            if (item !== currentItem) item.classList.remove('expanded');
        });

        // Переключаем состояние текущего элемента
        currentItem.classList.toggle('expanded');
    });
});
