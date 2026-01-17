/**
 * 麺工房 大番 上板橋店 - Main JavaScript
 * Mobile-first interactions and enhancements
 */

(function () {
    'use strict';

    // ========================================
    // DOM Ready
    // ========================================
    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initSmoothScroll();
        initHeroParallax();
        initScrollAnimations();
        initBusinessHoursCheck();
        initStickyVisibility();
        initMenuTabs();
    });

    // ========================================
    // Header & Hamburger Menu
    // ========================================
    function initHeader() {
        var header = document.getElementById('siteHeader');
        var hamburger = document.getElementById('hamburger');
        var mobileNav = document.getElementById('mobileNav');
        var overlay = document.getElementById('mobileNavOverlay');
        var navLinks = document.querySelectorAll('.mobile-nav-link');

        if (!hamburger || !mobileNav) return;

        var lastScrollY = 0;
        var ticking = false;

        // Toggle mobile menu
        hamburger.addEventListener('click', function () {
            var isOpen = hamburger.classList.contains('is-active');

            hamburger.classList.toggle('is-active');
            mobileNav.classList.toggle('is-active');
            overlay.classList.toggle('is-active');
            document.body.classList.toggle('nav-open');

            hamburger.setAttribute('aria-expanded', !isOpen);
            hamburger.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
        });

        // Close on overlay click
        overlay.addEventListener('click', function () {
            closeMenu();
        });

        // Close on nav link click
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        function closeMenu() {
            hamburger.classList.remove('is-active');
            mobileNav.classList.remove('is-active');
            overlay.classList.remove('is-active');
            document.body.classList.remove('nav-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'メニューを開く');
        }

        // Header hide/show on scroll
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    var currentScrollY = window.pageYOffset;

                    // Add scrolled class for darker bg
                    if (currentScrollY > 50) {
                        header.classList.add('is-scrolled');
                    } else {
                        header.classList.remove('is-scrolled');
                    }

                    // Hide header on scroll down, show on scroll up
                    if (currentScrollY > lastScrollY && currentScrollY > 300) {
                        header.classList.add('is-hidden');
                    } else {
                        header.classList.remove('is-hidden');
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ========================================
    // Smooth Scroll for anchor links
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var stickyHeight = parseInt(getComputedStyle(document.documentElement)
                        .getPropertyValue('--sticky-height')) || 0;

                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - stickyHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Hero Parallax Effect (subtle)
    // ========================================
    function initHeroParallax() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        // Only on desktop
        if (window.innerWidth < 1024) return;

        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    var scrolled = window.pageYOffset;
                    var heroHeight = hero.offsetHeight;

                    if (scrolled < heroHeight) {
                        var opacity = 1 - (scrolled / heroHeight) * 0.5;
                        var translateY = scrolled * 0.3;

                        var content = hero.querySelector('.hero-content');
                        if (content) {
                            content.style.transform = 'translateY(' + translateY + 'px)';
                            content.style.opacity = opacity;
                        }
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // ========================================
    // Scroll-triggered Animations
    // ========================================
    function initScrollAnimations() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) return;

        var animatedElements = document.querySelectorAll(
            '.feature-card, .menu-item, .info-details'
        );

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function (el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // Add CSS for animations
        var style = document.createElement('style');
        style.textContent = [
            '.animate-on-scroll {',
            '    opacity: 0;',
            '    transform: translateY(20px);',
            '    transition: opacity 0.6s ease, transform 0.6s ease;',
            '}',
            '.animate-on-scroll.is-visible {',
            '    opacity: 1;',
            '    transform: translateY(0);',
            '}',
            '.feature-card.animate-on-scroll:nth-child(2) {',
            '    transition-delay: 0.1s;',
            '}',
            '.feature-card.animate-on-scroll:nth-child(3) {',
            '    transition-delay: 0.2s;',
            '}',
            '.menu-item.animate-on-scroll:nth-child(2) {',
            '    transition-delay: 0.1s;',
            '}',
            '.menu-item.animate-on-scroll:nth-child(3) {',
            '    transition-delay: 0.2s;',
            '}',
            '.menu-item.animate-on-scroll:nth-child(4) {',
            '    transition-delay: 0.3s;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    // ========================================
    // Business Hours Check
    // ========================================
    function initBusinessHoursCheck() {
        var badge = document.querySelector('.hours-badge');
        var timeDisplay = document.querySelector('.hours-time');
        var loDisplay = document.querySelector('.hours-lo');

        if (!badge || !timeDisplay) return;

        var now = new Date();
        var day = now.getDay(); // 0 = Sunday
        var hour = now.getHours();
        var minute = now.getMinutes();
        var currentTime = hour + minute / 60;

        var isOpen = false;
        var closeTime = '';
        var loTime = '';
        var isNearClose = false;

        if (day === 0) {
            // Sunday
            if (currentTime >= 11 && currentTime < 15.5) {
                isOpen = true;
                closeTime = '15:30';
                loTime = '15:00';
                isNearClose = currentTime >= 15;
            } else if (currentTime >= 17 && currentTime < 20) {
                isOpen = true;
                closeTime = '20:00';
                loTime = '19:30';
                isNearClose = currentTime >= 19.5;
            }
        } else {
            // Monday - Saturday
            if (currentTime >= 11.5 && currentTime < 15) {
                isOpen = true;
                closeTime = '15:00';
                loTime = '14:30';
                isNearClose = currentTime >= 14.5;
            } else if (currentTime >= 17 && currentTime < 23) {
                isOpen = true;
                closeTime = '23:00';
                loTime = '22:30';
                isNearClose = currentTime >= 22;
            }
        }

        if (isOpen) {
            if (isNearClose) {
                badge.textContent = 'まもなくL.O.';
                badge.style.background = 'var(--color-accent)';
            } else {
                badge.textContent = '本日営業中';
                badge.style.background = 'var(--color-primary)';
            }
            timeDisplay.textContent = '〜' + closeTime;
            if (loDisplay) {
                loDisplay.textContent = '(L.O.' + loTime + ')';
            }
        } else {
            badge.textContent = '本日営業終了';
            badge.style.background = '#666';
            if (loDisplay) {
                loDisplay.style.display = 'none';
            }

            // Find next opening time
            if (day === 0) {
                if (currentTime < 11) {
                    timeDisplay.textContent = '11:00から営業';
                } else if (currentTime >= 15.5 && currentTime < 17) {
                    timeDisplay.textContent = '17:00から営業';
                } else {
                    timeDisplay.textContent = '明日11:30から';
                }
            } else if (day === 6) {
                // Saturday
                if (currentTime < 11.5) {
                    timeDisplay.textContent = '11:30から営業';
                } else if (currentTime >= 15 && currentTime < 17) {
                    timeDisplay.textContent = '17:00から営業';
                } else {
                    timeDisplay.textContent = '明日11:00から';
                }
            } else {
                if (currentTime < 11.5) {
                    timeDisplay.textContent = '11:30から営業';
                } else if (currentTime >= 15 && currentTime < 17) {
                    timeDisplay.textContent = '17:00から営業';
                } else {
                    timeDisplay.textContent = '明日11:30から';
                }
            }
        }
    }

    // ========================================
    // Sticky CTA Visibility
    // ========================================
    function initStickyVisibility() {
        var sticky = document.querySelector('.sticky-cta');
        var hero = document.querySelector('.hero');

        if (!sticky || !hero) return;

        var ticking = false;

        // Initial state - hide until scroll past hero
        sticky.style.transform = 'translateY(100%)';
        sticky.style.transition = 'transform 0.3s ease';

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    var heroBottom = hero.offsetHeight;
                    var scrolled = window.pageYOffset;

                    if (scrolled > heroBottom * 0.5) {
                        sticky.style.transform = 'translateY(0)';
                    } else {
                        sticky.style.transform = 'translateY(100%)';
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // ========================================
    // Phone Call Tracking (optional analytics)
    // ========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            // If Google Analytics is available
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'Contact',
                    event_label: 'Phone Call',
                    value: 1
                });
            }
        });
    });

    // ========================================
    // Menu Tabs
    // ========================================
    function initMenuTabs() {
        var tabContainer = document.querySelector('.menu-tabs');
        if (!tabContainer) return;

        // Event delegation for better performance
        tabContainer.addEventListener('click', function (e) {
            var tab = e.target.closest('.menu-tab');
            if (!tab) return;

            var tabId = tab.dataset.tab;
            if (!tabId) return;

            // Update active tab
            tabContainer.querySelectorAll('.menu-tab').forEach(function (t) {
                t.classList.remove('is-active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');

            // Update active panel
            document.querySelectorAll('.menu-panel').forEach(function (panel) {
                panel.classList.remove('is-active');
            });
            var targetPanel = document.getElementById('panel-' + tabId);
            if (targetPanel) {
                targetPanel.classList.add('is-active');
            }
        });
    }

})();
