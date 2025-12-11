document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const navMenu = document.querySelector('.nav-menu');
    const menuIcon = document.querySelector('.menu-toggle i');
    const backToTop = document.getElementById('back-to-top');
    const modal = document.getElementById('service-modal');
    
    // Data
    const services = JSON.parse(document.getElementById('services-data').textContent);

    // 1. Mobile Menu
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuIcon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.className = 'fas fa-bars';
        });
    });

    // 2. Scroll Logic (Counters + BackToTop)
    let countersStarted = false;
    window.addEventListener('scroll', () => {
        // Back To Top
        backToTop.classList.toggle('show', window.scrollY > 300);

        // Counters
        const stats = document.querySelector('.stats');
        if (stats && !countersStarted && window.scrollY + window.innerHeight > stats.offsetTop) {
            startCounters();
            countersStarted = true;
        }
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    function startCounters() {
        document.querySelectorAll('.number').forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const step = target / 50;
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.ceil(current);
                }
            }, 30);
        });
    }

    // 3. Modal Logic
    const openModal = (id) => {
        const data = services[id];
        if (!data) return;

        document.getElementById('m-title').textContent = data.title;
        document.getElementById('m-desc').textContent = data.desc;
        
        // Tags
        const tagsContainer = document.getElementById('m-tags');
        tagsContainer.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');

        // Gallery
        const gallery = document.getElementById('m-gallery');
        gallery.innerHTML = data.imgs.map((src, i) => `
            <div class="gallery-item">
                ${src ? `<img src="${src}" alt="img-${i}" loading="lazy">` : '<i class="fas fa-image"></i>'}
            </div>
        `).join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.service-card').forEach(c => c.addEventListener('click', () => openModal(c.dataset.service)));
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

    // Footer Year
    document.getElementById('year').textContent = new Date().getFullYear();
});