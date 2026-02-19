/**
 * Tecebot Website - Main JavaScript
 * Interactive functionality for the product website
 */

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const demoForm = document.getElementById('demoForm');
    const toast = document.getElementById('toast');

    /**
     * Initialize all functionality
     */
    function init() {
        initNavbar();
        initMobileNav();
        initSmoothScroll();
        initCounters();
        initFormHandler();
        initScrollAnimations();
    }

    /**
     * Navbar scroll effect
     */
    function initNavbar() {
        if (!navbar) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state
    }

    /**
     * Mobile navigation toggle
     */
    function initMobileNav() {
        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Animated number counters for stats
     */
    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        if (!statNumbers.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'));
                    animateCounter(target, countTo);
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    }

    /**
     * Form submission handler
     */
    function initFormHandler() {
        if (!demoForm) return;

        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>提交中...</span>';
            
            setTimeout(() => {
                showToast('演示预约成功！我们会尽快与您联系。');
                demoForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    function showToast(message) {
        if (!toast) return;
        
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    /**
     * Scroll animations using Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .solution-item, .stat-item, .custom-item');
        
        if (!animatedElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
