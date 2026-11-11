/* =========================================================
   WISATA LAMPUNG — interaksi beranda statis
   - Navbar scrolled + menu mobile + scrollspy
   - Hero slideshow
   - Spotlight carousel (ala ha.PNG)
   - Filter destinasi
   - Animasi reveal & tahun footer
   ========================================================= */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const topbar = document.getElementById('topbar');
    const burger = document.getElementById('burger');
    const mainNav = document.getElementById('mainNav');

    /* ================= NAVBAR + MENU MOBILE ================= */
    function setMenu(open) {
        if (!topbar || !burger || !mainNav) return;
        topbar.classList.toggle('is-open', open);
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        document.body.classList.toggle('menu-open', open);
    }

    if (burger && topbar && mainNav) {
        burger.addEventListener('click', function () {
            setMenu(!topbar.classList.contains('is-open'));
        });

        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && topbar.classList.contains('is-open')) {
                setMenu(false);
                burger.focus();
            }
        });

        document.addEventListener('click', function (event) {
            if (topbar.classList.contains('is-open') && !topbar.contains(event.target)) {
                setMenu(false);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 1000) setMenu(false);
        });
    }

    /* ================= HERO SLIDESHOW ================= */
    (function initHero() {
        const hero = document.querySelector('.hero');
        const slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        const dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        const prevBtn = document.getElementById('heroPrev');
        const nextBtn = document.getElementById('heroNext');

        if (!hero || slides.length === 0) return;

        const DELAY = 5000;
        let index = 0;
        let timer = null;

        function setSlide(next) {
            index = (next + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                const active = i === index;
                slide.classList.toggle('is-active', active);
                slide.setAttribute('aria-hidden', String(!active));
                slide.querySelectorAll('a, button').forEach(function (el) {
                    if (active) {
                        el.removeAttribute('tabindex');
                    } else {
                        el.setAttribute('tabindex', '-1');
                    }
                });
            });

            dots.forEach(function (dot, i) {
                const active = i === index;
                dot.classList.toggle('is-active', active);
                if (active) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        }

        function stopAuto() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function startAuto() {
            stopAuto();
            if (!reduceMotion && slides.length > 1) {
                timer = setInterval(function () { setSlide(index + 1); }, DELAY);
            }
        }

        function restart() {
            stopAuto();
            startAuto();
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { setSlide(index - 1); restart(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { setSlide(index + 1); restart(); });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { setSlide(i); restart(); });
        });

        hero.addEventListener('mouseenter', stopAuto);
        hero.addEventListener('mouseleave', startAuto);
        hero.addEventListener('focusin', stopAuto);
        hero.addEventListener('focusout', function (event) {
            if (!hero.contains(event.relatedTarget)) startAuto();
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stopAuto(); else startAuto();
        });

        setSlide(0);
        startAuto();
    })();

    /* ================= SPOTLIGHT CAROUSEL ================= */
    (function initSpotlight() {
        const rail = document.getElementById('spotlightRail');
        if (!rail) return;

        const track = rail.querySelector('.spotlight-track');
        const cards = track ? Array.prototype.slice.call(track.children) : [];
        const prevBtn = document.getElementById('spotPrev');
        const nextBtn = document.getElementById('spotNext');
        const currentEl = document.getElementById('spotCurrent');
        const progress = document.getElementById('spotProgress');

        if (cards.length === 0) return;

        let index = 0;
        let ticking = false;

        function step() {
            if (cards.length > 1) {
                return cards[1].offsetLeft - cards[0].offsetLeft;
            }
            return cards[0].offsetWidth || rail.clientWidth;
        }

        function paint(i) {
            index = Math.max(0, Math.min(cards.length - 1, i));

            cards.forEach(function (card, n) {
                card.classList.toggle('is-active', n === index);
            });

            if (currentEl) {
                currentEl.textContent = String(index + 1).padStart(2, '0');
            }
            if (progress) {
                progress.style.width = ((index + 1) / cards.length * 100) + '%';
            }
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === cards.length - 1;
        }

        function goTo(i) {
            const target = Math.max(0, Math.min(cards.length - 1, i));
            paint(target);
            const left = cards[target].offsetLeft - cards[0].offsetLeft;
            rail.scrollTo({
                left: left,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        }

        function syncFromScroll() {
            const distance = step();
            if (!distance) return;
            paint(Math.round(rail.scrollLeft / distance));
        }

        rail.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                syncFromScroll();
                ticking = false;
            });
        }, { passive: true });

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

        rail.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goTo(index + 1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goTo(index - 1);
            }
        });

        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () { paint(index); syncFromScroll(); }, 150);
        });

        paint(0);

        window.addEventListener('load', function () {
            syncFromScroll();
        });
    })();

    /* ================= FILTER DESTINASI ================= */
    (function initFilters() {
        const buttons = Array.prototype.slice.call(document.querySelectorAll('.filter'));
        const cards = Array.prototype.slice.call(document.querySelectorAll('.dest-card'));
        if (buttons.length === 0 || cards.length === 0) return;

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                const filter = button.dataset.filter || 'all';

                buttons.forEach(function (btn) {
                    const active = btn === button;
                    btn.classList.toggle('is-active', active);
                    btn.setAttribute('aria-pressed', String(active));
                });

                cards.forEach(function (card) {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.classList.toggle('is-hidden', !show);

                    if (show) {
                        card.classList.remove('filter-pop');
                        void card.offsetWidth;
                        card.classList.add('filter-pop');
                    }
                });
            });
        });
    })();

    /* ================= SCROLL: NAVBAR + SCROLLSPY ================= */
    (function initScroll() {
        const spyLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav .nav-link'));
        const sections = spyLinks
            .map(function (link) { return document.querySelector(link.getAttribute('href')); })
            .filter(Boolean);

        let queued = false;

        function update() {
            queued = false;

            if (topbar) {
                topbar.classList.toggle('is-scrolled', window.scrollY > 24);
            }

            if (sections.length === 0) return;

            const probe = Math.max(140, window.innerHeight * 0.34);
            let active = sections[0];

            sections.forEach(function (section) {
                if (section.getBoundingClientRect().top <= probe) active = section;
            });

            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
                active = sections[sections.length - 1];
            }

            spyLinks.forEach(function (link) {
                const on = link.getAttribute('href') === '#' + active.id;
                link.classList.toggle('active', on);
                if (on) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        function onScroll() {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    })();

    /* ================= REVEAL SAAT SCROLL ================= */
    (function initReveal() {
        const items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
        if (items.length === 0) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (item) { item.classList.add('is-visible'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        items.forEach(function (item) { observer.observe(item); });
    })();

    /* ================= TAHUN FOOTER ================= */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ================= MODAL SEJARAH MENARA SIGER ================= */
    (function initSigerModal() {
        const modal = document.getElementById('sigerModal');
        if (!modal) return;

        const dialog = modal.querySelector('.siger-modal__dialog');
        const openers = Array.prototype.slice.call(document.querySelectorAll('[data-siger-open]'));
        const closers = Array.prototype.slice.call(modal.querySelectorAll('[data-siger-close]'));
        let lastFocus = null;

        function focusableItems() {
            if (!dialog) return [];
            return Array.prototype.slice.call(
                dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            ).filter(function (el) { return el.offsetParent !== null; });
        }

        function openModal(event) {
            if (event) event.preventDefault();
            lastFocus = document.activeElement;

            modal.hidden = false;
            modal.classList.add('is-open');
            document.body.classList.add('modal-open');

            const closeBtn = modal.querySelector('.siger-modal__close');
            if (closeBtn) closeBtn.focus();
        }

        function closeModal() {
            if (modal.hidden) return;

            modal.classList.remove('is-open');
            modal.hidden = true;
            document.body.classList.remove('modal-open');

            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
            lastFocus = null;
        }

        openers.forEach(function (el) {
            el.addEventListener('click', openModal);
        });

        closers.forEach(function (el) {
            el.addEventListener('click', closeModal);
        });

        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal();
                return;
            }

            if (event.key !== 'Tab') return;

            const items = focusableItems();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    })();
})();

/* ================= MODAL SEJARAH PULAU PAHAWANG ================= */
    (function initPahawangModal() {
        const modal = document.getElementById('pahawangModal');
        if (!modal) return;

        const dialog = modal.querySelector('.siger-modal__dialog');
        const openers = Array.prototype.slice.call(document.querySelectorAll('[data-pahawang-open]'));
        const closers = Array.prototype.slice.call(modal.querySelectorAll('[data-pahawang-close]'));
        let lastFocus = null;

        function focusableItems() {
            if (!dialog) return [];
            return Array.prototype.slice.call(
                dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            ).filter(function (el) { return el.offsetParent !== null; });
        }

        function openModal(event) {
            if (event) event.preventDefault();
            lastFocus = document.activeElement;

            modal.hidden = false;
            modal.classList.add('is-open');
            document.body.classList.add('modal-open');

            const closeBtn = modal.querySelector('.siger-modal__close');
            if (closeBtn) closeBtn.focus();
        }

        function closeModal() {
            if (modal.hidden) return;

            modal.classList.remove('is-open');
            modal.hidden = true;
            document.body.classList.remove('modal-open');

            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
            lastFocus = null;
        }

        openers.forEach(function (el) {
            el.addEventListener('click', openModal);
        });

        closers.forEach(function (el) {
            el.addEventListener('click', closeModal);
        });

        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal();
                return;
            }

            if (event.key !== 'Tab') return;

            const items = focusableItems();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    })();
    

      /* ================= MODAL SEJARAH TELUK PAHAWANG ================= */
    (function initTelukPahawangModal() {
        const modal = document.getElementById('telukPahawangModal');
        if (!modal) return;

        const dialog = modal.querySelector('.siger-modal__dialog');
        const openers = Array.prototype.slice.call(document.querySelectorAll('[data-teluk-open]'));
        const closers = Array.prototype.slice.call(modal.querySelectorAll('[data-teluk-close]'));
        let lastFocus = null;

        function focusableItems() {
            if (!dialog) return [];
            return Array.prototype.slice.call(
                dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            ).filter(function (el) { return el.offsetParent !== null; });
        }

        function openModal(event) {
            if (event) event.preventDefault();
            lastFocus = document.activeElement;

            modal.hidden = false;
            modal.classList.add('is-open');
            document.body.classList.add('modal-open');

            const closeBtn = modal.querySelector('.siger-modal__close');
            if (closeBtn) closeBtn.focus();
        }

        function closeModal() {
            if (modal.hidden) return;

            modal.classList.remove('is-open');
            modal.hidden = true;
            document.body.classList.remove('modal-open');

            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
            lastFocus = null;
        }

        openers.forEach(function (el) {
            el.addEventListener('click', openModal);
        });

        closers.forEach(function (el) {
            el.addEventListener('click', closeModal);
        });

        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal();
                return;
            }

            if (event.key !== 'Tab') return;

            const items = focusableItems();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    })();

          /* ================= MODAL SEJARAH TELUK PAHAWANG ================= */
    (function mutunModal() {
        const modal = document.getElementById('mutunModal');
        if (!modal) return;

        const dialog = modal.querySelector('.siger-modal__dialog');
        const openers = Array.prototype.slice.call(document.querySelectorAll('[data-teluk-open]'));
        const closers = Array.prototype.slice.call(modal.querySelectorAll('[data-teluk-close]'));
        let lastFocus = null;

        function focusableItems() {
            if (!dialog) return [];
            return Array.prototype.slice.call(
                dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            ).filter(function (el) { return el.offsetParent !== null; });
        }

        function openModal(event) {
            if (event) event.preventDefault();
            lastFocus = document.activeElement;

            modal.hidden = false;
            modal.classList.add('is-open');
            document.body.classList.add('modal-open');

            const closeBtn = modal.querySelector('.siger-modal__close');
            if (closeBtn) closeBtn.focus();
        }

        function closeModal() {
            if (modal.hidden) return;

            modal.classList.remove('is-open');
            modal.hidden = true;
            document.body.classList.remove('modal-open');

            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
            lastFocus = null;
        }

        openers.forEach(function (el) {
            el.addEventListener('click', openModal);
        });

        closers.forEach(function (el) {
            el.addEventListener('click', closeModal);
        });

        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal();
                return;
            }

            if (event.key !== 'Tab') return;

            const items = focusableItems();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    })();