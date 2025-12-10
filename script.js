/**
 * Основной скрипт для портфолио сайта
 * Оптимизирован и содержит подробные комментарии
 */

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ПЕРЕМЕННЫЕ И КОНСТАНТЫ ==========
    
    // Элементы навигации
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Кнопка "Наверх"
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Счетчики в секции "Обо мне"
    const statNumbers = document.querySelectorAll('.number');
    
    // Модальное окно для услуг
    const modal = document.getElementById('service-modal');
    const modalClose = modal.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const techTags = document.querySelector('.tech-tags');
    const galleryItems = document.querySelectorAll('.gallery-item.placeholder');
    
    // Год в футере
    const currentYearSpan = document.getElementById('current-year');
    
    // Данные для услуг (загружаем из JSON в HTML)
    const servicesData = JSON.parse(document.getElementById('services-data').textContent);
    
    
    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    
    // Функция переключения меню
    function toggleMenu() {
        navMenu.classList.toggle('active');
        
        // Меняем иконку
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Обработчик для кнопки меню
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    
    // ========== КНОПКА "НАВЕРХ" ==========
    
    // Показать/скрыть кнопку при прокрутке
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    // Прокрутка наверх
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Навешиваем обработчики
    if (backToTopBtn) {
        window.addEventListener('scroll', toggleBackToTopButton);
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    
    // ========== АНИМАЦИЯ СЧЕТЧИКОВ ==========
    
    // Функция анимации счетчиков
    function animateCounters() {
        // Проверяем видимость секции
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;
        
        const sectionPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        // Если секция видна
        if (sectionPosition < screenPosition) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                let count = 0;
                const increment = target / 100;
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        count = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(count);
                }, 20);
                
                // Убираем атрибут, чтобы не анимировать повторно
                stat.removeAttribute('data-count');
            });
            
            // Убираем обработчик
            window.removeEventListener('scroll', animateCounters);
        }
    }
    
    // Запуск анимации счетчиков
    if (statNumbers.length > 0) {
        window.addEventListener('scroll', animateCounters);
        // Проверяем сразу при загрузке
        setTimeout(animateCounters, 500);
    }
    
    
    // ========== МОДАЛЬНЫЕ ОКНА ДЛЯ УСЛУГ ==========
    
    // Функция открытия модального окна с данными услуги
    function openServiceModal(serviceId) {
        const service = servicesData[serviceId];
        
        if (!service) return;
        
        // Заполняем данные
        modalTitle.textContent = service.title;
        modalDescription.innerHTML = `<p>${service.description}</p>`;
        
        // Очищаем и добавляем теги технологий
        techTags.innerHTML = '';
        service.tech.forEach(tech => {
            const tag = document.createElement('span');
            tag.textContent = tech;
            techTags.appendChild(tag);
        });
        
        // Обновляем изображения в галерее
        galleryItems.forEach((item, index) => {
            if (service.images[index]) {
                // Если есть URL изображения, заменяем placeholder на изображение
                item.classList.remove('placeholder');
                item.innerHTML = `<img src="${service.images[index]}" alt="${service.title} ${index + 1}">`;
            } else {
                // Иначе оставляем placeholder
                item.classList.add('placeholder');
                item.innerHTML = `<i class="fas fa-image"></i><p>Ваше фото ${index + 1}</p>`;
            }
        });
        
        // Показываем модальное окно
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем прокрутку
    }
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по кнопке
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Навешиваем обработчики на карточки услуг
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            openServiceModal(serviceId);
        });
    });
    
    
    // ========== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ==========
    
    // Устанавливаем текущий год в футере
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Инициализация кнопки "Наверх" при загрузке
    toggleBackToTopButton();
    
    // Сообщение в консоль
    console.log('Портфолио успешно загружено!');
    console.log('Для изменения контента:');
    console.log('1. Замените тексты в квадратных скобках');
    console.log('2. Добавьте свои фото в теги img');
    console.log('3. Обновите данные услуг в теге script#services-data');
});