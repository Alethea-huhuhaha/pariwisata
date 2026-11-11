const panels  = document.querySelectorAll('.hero-panel');
const dots    = document.querySelectorAll('.dot');
const nextBtn = document.querySelector('.slide-btn.next');
const prevBtn = document.querySelector('.slide-btn.prev');

let current = 0;
let animating = false;
let timer;

function showSlide(index) {
    if (animating || index === current) return;
    animating = true;

    panels[index].classList.add('active');
    dots[index].classList.add('active');
    panels[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;

    setTimeout(() => { animating = false; }, 850);
}

function nextSlide() { showSlide((current + 1) % panels.length); }
function prevSlide() { showSlide((current - 1 + panels.length) % panels.length); }

// Ganti otomatis setiap 5 detik
function startAuto() {
    clearInterval(timer);
    if (panels.length > 1) timer = setInterval(nextSlide, 5000);
}

nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });
prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startAuto(); }));

startAuto();

// ===== MENU MOBILE NAVBAR =====
const navHeader = document.querySelector('.topbar');
const navToggle = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

if (navHeader && navToggle && navMenu) {
    function closeNav() {
        navHeader.classList.remove('nav-open');
        document.body.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Buka menu');
        navToggle.innerHTML = '&#9776;';
    }

    navToggle.addEventListener('click', () => {
        const open = navHeader.classList.toggle('nav-open');
        document.body.classList.toggle('menu-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        navToggle.innerHTML = open ? '&times;' : '&#9776;';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', (event) => {
        if (navHeader.classList.contains('nav-open') && !navHeader.contains(event.target)) {
            closeNav();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000) closeNav();
    });
}
