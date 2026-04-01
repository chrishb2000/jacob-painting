/**
 * Jacob Brothers Painting - Main JavaScript
 * Modern functionality for the website
 */

// ============================================
// DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initMobileMenu();
    initScrollEffects();
    initPortfolioModal();
    initFAQ();
    initSmoothScroll();
    initLanguageSwitcher();
});

// ============================================
// Carousel / Slider
// ============================================
let currentSlide = 0;
let slideInterval;
const SLIDE_DURATION = 5000;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    if (slides.length === 0) return;
    
    // Auto play
    startAutoPlay();
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            changeSlide(-1);
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            changeSlide(1);
            resetAutoPlay();
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });
    
    // Pause on hover
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function startAutoPlay() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, SLIDE_DURATION);
}

function stopAutoPlay() {
    clearInterval(slideInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!toggle || !navMenu) return;
    
    toggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

// ============================================
// Scroll Effects
// ============================================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            if (navbar) navbar.classList.add('scrolled');
            if (scrollTopBtn) scrollTopBtn.classList.add('visible');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
            if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top button
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Portfolio Modal / Lightbox
// ============================================
let currentImageIndex = 0;
let portfolioImages = [];

function initPortfolioModal() {
    const modal = document.querySelector('.portfolio-modal');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    const modalImg = document.querySelector('.modal-content img');
    
    if (!modal) return;
    
    // Get all portfolio images
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            portfolioImages.push(img.src);
            
            item.addEventListener('click', () => {
                currentImageIndex = index;
                openModal(img.src);
            });
        }
    });
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeModalImage(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeModalImage(1);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') changeModalImage(-1);
        if (e.key === 'ArrowRight') changeModalImage(1);
    });
}

function openModal(src) {
    const modal = document.querySelector('.portfolio-modal');
    const modalImg = document.querySelector('.modal-content img');
    
    if (modal && modalImg) {
        modalImg.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.querySelector('.portfolio-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function changeModalImage(direction) {
    const modalImg = document.querySelector('.modal-content img');
    if (!modalImg || portfolioImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex + direction + portfolioImages.length) % portfolioImages.length;
    modalImg.src = portfolioImages[currentImageIndex];
}

// ============================================
// FAQ Accordion
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Language Switcher
// ============================================
let currentLanguage = 'en';

const translations = {
    en: {
        nav_home: 'Home',
        nav_about: 'About Us',
        nav_services: 'Services',
        nav_portfolio: 'Portfolio',
        nav_contact: 'Contact',
        nav_faq: 'FAQ',
        hero_title: 'Professional Painting Services',
        hero_subtitle: 'Over 20 years of European Craftsmanship in Southern California',
        hero_cta_primary: 'Get Free Estimate',
        hero_cta_secondary: 'View Our Work',
        about_title: 'About Jacob Brothers Painting',
        about_subtitle: 'Family Owned & Operated Since 1985',
        services_title: 'Our Services',
        services_subtitle: 'Comprehensive painting solutions for residential and commercial properties',
        portfolio_title: 'Our Portfolio',
        portfolio_subtitle: 'Browse our recent projects and see the quality of our work',
        testimonials_title: 'Client Testimonials',
        testimonials_subtitle: 'See what our satisfied customers have to say',
        contact_title: 'Get In Touch',
        contact_subtitle: 'Free estimates and consultations',
        faq_title: 'Frequently Asked Questions',
        footer_about: 'About Us',
        footer_services: 'Services',
        footer_contact: 'Contact Info',
        footer_follow: 'Follow Us'
    },
    es: {
        nav_home: 'Inicio',
        nav_about: 'Quiénes Somos',
        nav_services: 'Servicios',
        nav_portfolio: 'Portafolio',
        nav_contact: 'Contacto',
        nav_faq: 'FAQ',
        hero_title: 'Servicios Profesionales de Pintura',
        hero_subtitle: 'Más de 20 años de artesanía europea en el Sur de California',
        hero_cta_primary: 'Obtener Presupuesto',
        hero_cta_secondary: 'Ver Trabajos',
        about_title: 'Sobre Jacob Brothers Painting',
        about_subtitle: 'Empresa Familiar desde 1985',
        services_title: 'Nuestros Servicios',
        services_subtitle: 'Soluciones integrales de pintura para propiedades residenciales y comerciales',
        portfolio_title: 'Nuestro Portafolio',
        portfolio_subtitle: 'Explora nuestros proyectos recientes y mira la calidad de nuestro trabajo',
        testimonials_title: 'Testimonios de Clientes',
        testimonials_subtitle: 'Mira lo que dicen nuestros clientes satisfechos',
        contact_title: 'Contáctanos',
        contact_subtitle: 'Presupuestos y consultas gratuitas',
        faq_title: 'Preguntas Frecuentes',
        footer_about: 'Sobre Nosotros',
        footer_services: 'Servicios',
        footer_contact: 'Información de Contacto',
        footer_follow: 'Síguenos'
    }
};

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang && lang !== currentLanguage) {
                setLanguage(lang);
                
                // Update active state
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
}

function setLanguage(lang) {
    currentLanguage = lang;
    const texts = translations[lang];
    
    if (!texts) return;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (texts[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                element.textContent = texts[key];
            } else {
                element.textContent = texts[key];
            }
        }
    });
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Load saved language preference
function loadSavedLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
        
        // Update active state on buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
        });
    }
}

// ============================================
// Form Validation
// ============================================
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = 'red';
            }
        }
    });
    
    return isValid;
}

// ============================================
// WhatsApp Button
// ============================================
function openWhatsApp() {
    const phoneNumber = '18003570775';
    const message = 'Hello, I would like to request a free estimate for painting services.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ============================================
// Utility Functions
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize saved language
loadSavedLanguage();
