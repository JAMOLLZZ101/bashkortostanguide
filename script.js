// 1. ЛОГИКА ВЫЕЗЖАЮЩЕЙ ПАНЕЛИ (Перебегание из А в Б)
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    // Теперь только меняем текст, физику перемещения делает один класс .open
    toggleBtn.innerText = sidebar.classList.contains('open') ? '◀ Скрыть' : 'Города';
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
        toggleBtn.innerText = 'Города';
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
// Функция инициализации карты для Октябрьского
function initOktyabrskyMap() {
    // Координаты центра Октябрьского [широта, долгота] и масштаб (13)
    const map = L.map('map-oktyabrsky').setView([54.4812, 53.4710], 13);

    // Подключаем бесплатные красивые карты (например, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // База данных маркеров для карты
    const locations = [
        {
            name: "Гора Нарыш-Тау",
            coords: [54.4988, 53.5042], // Реальные координаты горы
            targetId: "narysh-tau"       // ID аккордеона, который нужно открыть
        },
        {
            name: "Парк им. Ю. Гагарина",
            coords: [54.4751, 53.4475], // Реальные координаты парка
            targetId: "gagarin-park"     // ID аккордеона, который нужно открыть
        }
    ];

    // Рендерим маркеры на карте через цикл
    locations.forEach(loc => {
        const marker = L.marker(loc.coords).addTo(map);
        
        // Всплывашка при наведении на маркер
        marker.bindTooltip(loc.name);

        // ГЕЙМДЕВ-ЛОГИКА: Клик по маркеру открывает UI островка
        marker.on('click', () => {
            const targetAccordion = document.getElementById(loc.targetId);
            
            if (targetAccordion) {
                // 1. Закрываем все остальные открытые островки
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('expanded');
                });

                // 2. Раскрываем наш целевой островок
                targetAccordion.classList.add('expanded');

                // 3. Плавно перемещаем камеру (скроллим страницу) к этому островку
                targetAccordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Фикс для корректного рендера карты внутри скрытых SPA-вкладок
    // Карты часто ломаются, если инициализируются в невидимом блоке display:none
    return map;
}

// Запускаем инициализацию карты при клике на кнопку города в меню
let oktyabrskyMapInitialized = false;
let oMapInstance = null;

document.querySelectorAll('.city-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        
        if (target === 'city-oktyabrsky') {
            // ПРОВЕРКА: Если объект L еще не создан, ждем 200мс и пробуем снова
            if (typeof L === 'undefined') {
                console.log("Leaflet еще загружается, ждем...");
                setTimeout(() => btn.click(), 200); // Рекурсивный триггер клика
                return;
            }

            if (!oktyabrskyMapInitialized) {
                setTimeout(() => {
                    oMapInstance = initOktyabrskyMap();
                    oktyabrskyMapInitialized = true;
                }, 100);
            } else {
                setTimeout(() => {
                    if (oMapInstance) {
                        oMapInstance.invalidateSize();
                    }
                }, 300);
            }
        }
    });
});
