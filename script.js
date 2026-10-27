// 1. ЛОГИКА ВЫЕЗЖАЮЩЕЙ ПАНЕЛИ (ТЯНИ-ТОЛКАЙ)
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggleBtn.innerText = sidebar.classList.contains('open') ? '◀ Скрыть' : 'Города';
});

// ГЕЙМДЕВ-ПЕРЕМЕННЫЕ ДЛЯ КОНТРОЛЯ КАРТЫ
let oktyabrskyMapInitialized = false;
let oMapInstance = null;

// Функция создания карты Октябрьского
function initOktyabrskyMap() {
    // Координаты центра Октябрьского и зум
    const map = L.map('map-oktyabrsky').setView([54.4812, 53.4710], 13);

    // Подгружаем текстуры карты
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Точки на карте
    const locations = [
        { name: "Гора Нарыш-Тау", coords: [54.4988, 53.5042], targetId: "narysh-tau" },
        { name: "Парк им. Ю. Гагарина", coords: [54.4751, 53.4475], targetId: "gagarin-park" }
    ];

    // Отрисовываем маркеры
    locations.forEach(loc => {
        const marker = L.marker(loc.coords).addTo(map);
        marker.bindTooltip(loc.name);

        // Клик по маркеру открывает нужный аккордеон и скроллит к нему
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

// 2. ПЕРЕКЛЮЧЕНИЕ СТИЛИЗИРОВАННЫХ СТРАНИЦ ГОРОДОВ
const cityButtons = document.querySelectorAll('.city-btn');
const pageViews = document.querySelectorAll('.page-view');

cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        cityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetPageId = btn.getAttribute('data-target');
        
        pageViews.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetPageId) {
                setTimeout(() => {
                    page.classList.add('active');
                }, 50);
            }
        });

        sidebar.classList.remove('open');
        toggleBtn.innerText = 'Города';

        // ИНТЕГРАЦИЯ КАРТЫ: Если игрок выбрал Октябрьский
        if (targetPageId === 'city-oktyabrsky') {
            if (!oktyabrskyMapInitialized) {
                // Инициализируем карту через 200мс, когда страница точно сменила дисплей на block
                setTimeout(() => {
                    oMapInstance = initOktyabrskyMap();
                    oktyabrskyMapInitialized = true;
                }, 200);
            } else {
                // Если карта уже была создана, принудительно пересчитываем её сетку (фикс серого экрана)
                setTimeout(() => {
                    if (oMapInstance) oMapInstance.invalidateSize();
                }, 200);
            }
        }
    });
});

// 3. ПЛАВНОЕ РАЗВОРАЧИВАНИЕ СПИСКА (АККОРДЕОН)
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const currentItem = header.parentElement;
        
        document.querySelectorAll('.accordion-item').forEach(item => {
            if (item !== currentItem) item.classList.remove('expanded');
        });

        currentItem.classList.toggle('expanded');
    });
});


