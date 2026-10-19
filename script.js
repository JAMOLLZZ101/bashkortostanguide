// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ И ПЕРЕМЕННЫЕ СОСТОЯНИЯ
// ==========================================
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const cityButtons = document.querySelectorAll('.city-btn');
const pageViews = document.querySelectorAll('.page-view');
const accordionHeaders = document.querySelectorAll('.accordion-header');

let oktyabrskyMapInitialized = false;
let oMapInstance = null;

// ==========================================
// 2. ЛОГИКА ВЫЕЗЖАЮЩЕЙ ПАНЕЛИ (ТЯНИ-ТОЛКАЙ)
// ==========================================
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggleBtn.innerText = sidebar.classList.contains('open') ? '◀ Скрыть' : 'Города';
});

// ==========================================
// 3. ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ КАРТЫ (ОКТЯБРЬСКИЙ)
// ==========================================
function initOktyabrskyMap() {
    // Координаты центра Октябрьского и масштаб (13)
    const map = L.map('map-oktyabrsky').setView([54.4812, 53.4710], 13);

    // Подключаем карту
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // База данных точек
    const locations = [
        {
            name: "Гора Нарыш-Тау",
            coords: [54.4988, 53.5042],
            targetId: "narysh-tau"
        },
        {
            name: "Парк им. Ю. Гагарина",
            coords: [54.4751, 53.4475],
            targetId: "gagarin-park"
        }
    ];

    // Рендерим маркеры на карте
    locations.forEach(loc => {
        const marker = L.marker(loc.coords).addTo(map);
        marker.bindTooltip(loc.name);

        // Обработка клика по точке на карте
        marker.on('click', () => {
            const targetAccordion = document.getElementById(loc.targetId);
            
            if (targetAccordion) {
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('expanded');
                });

                targetAccordion.classList.add('expanded');
                targetAccordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    return map;
}

// ==========================================
// 4. ЕДИНЫЙ КОНТРОЛЛЕР ПЕРЕКЛЮЧЕНИЯ СТРАНИЦ И КАРТ
// ==========================================
cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Меняем активный класс у кнопок меню
        cityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetPageId = btn.getAttribute('data-target');
        
        // Переключаем экраны страниц
        pageViews.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetPageId) {
                setTimeout(() => {
                    page.classList.add('active');
                }, 50);
            }
        });

        // Закрываем боковое меню
        sidebar.classList.remove('open');
        toggleBtn.innerText = 'Города';

        // ДВИЖОК КАРТЫ: Проверяем, если выбрали Октябрьский
        if (targetPageId === 'city-oktyabrsky') {
            if (!oktyabrskyMapInitialized) {
                // Если карта открывается в первый раз
                setTimeout(() => {
                    oMapInstance = initOktyabrskyMap();
                    oktyabrskyMapInitialized = true;
                }, 150); // Даем вкладке время проявиться в CSS
            } else {
                // Если карта уже была создана, просто обновляем её сетку
                setTimeout(() => {
                    if (oMapInstance) {
                        oMapInstance.invalidateSize();
                    }
                }, 150);
            }
        }
    });
});

// ==========================================
// 5. ПЛАВНЫЙ АККОРДЕОН (РАЗВОРАЧИВАНИЕ СПИСКА)
// ==========================================
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const currentItem = header.parentElement;
        
        document.querySelectorAll('.accordion-item').forEach(item => {
            if (item !== currentItem) item.classList.remove('expanded');
        });

        currentItem.classList.toggle('expanded');
    });
});


});
