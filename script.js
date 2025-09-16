// Custom Cursor
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .service-card, .about-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(30, 58, 138, 0.3)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Code Protection - Anti Copy
document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+A
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'a')) {
        e.preventDefault();
        return false;
    }
});

// Disable right click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Disable drag
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// Advanced Analytics Tracking
class WebsiteAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageViews = 0;
        this.clicks = 0;
        this.scrollDepth = 0;
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    init() {
        this.trackPageLoad();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackMouseMovement();
        this.trackFormInteractions();
        this.trackExitIntent();
    }
    
    trackPageLoad() {
        const loadData = {
            type: 'page_load',
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: screen.width + 'x' + screen.height,
            viewportSize: window.innerWidth + 'x' + window.innerHeight,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
        
        this.sendData('/api/analytics', loadData);
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.scrollDepth = maxScroll;
                
                const scrollData = {
                    type: 'scroll_depth',
                    timestamp: new Date().toISOString(),
                    sessionId: this.sessionId,
                    scrollPercent: scrollPercent,
                    page: window.location.pathname
                };
                
                this.sendData('/api/analytics', scrollData);
            }
        });
    }
    
    trackTimeOnPage() {
        setInterval(() => {
            const timeData = {
                type: 'time_on_page',
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId,
                timeSpent: Math.round((Date.now() - this.startTime) / 1000),
                page: window.location.pathname
            };
            
            this.sendData('/api/analytics', timeData);
        }, 30000); // Every 30 seconds
    }
    
    trackMouseMovement() {
        let mouseMovements = 0;
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements % 50 === 0) { // Track every 50 movements
                const mouseData = {
                    type: 'mouse_movement',
                    timestamp: new Date().toISOString(),
                    sessionId: this.sessionId,
                    movements: mouseMovements,
                    page: window.location.pathname
                };
                
                this.sendData('/api/analytics', mouseData);
            }
        });
    }
    
    trackFormInteractions() {
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('focus', () => {
                const formData = {
                    type: 'form_interaction',
                    timestamp: new Date().toISOString(),
                    sessionId: this.sessionId,
                    action: 'focus',
                    element: element.tagName,
                    page: window.location.pathname
                };
                
                this.sendData('/api/analytics', formData);
            });
        });
    }
    
    trackExitIntent() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                const exitData = {
                    type: 'exit_intent',
                    timestamp: new Date().toISOString(),
                    sessionId: this.sessionId,
                    timeOnPage: Math.round((Date.now() - this.startTime) / 1000),
                    page: window.location.pathname
                };
                
                this.sendData('/api/analytics', exitData);
            }
        });
    }
    
    sendData(endpoint, data) {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).catch(err => console.log('Analytics error:', err));
    }
}

// Initialize analytics
const analytics = new WebsiteAnalytics();

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.stats-container');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}

// Testimonials Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Carousel controls
document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-play carousel
setInterval(nextSlide, 5000);

// Feature items animation
const featureItems = document.querySelectorAll('.feature-item');
const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
            featureObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

featureItems.forEach(item => {
    featureObserver.observe(item);
});

// UK Map animation
const mapContainer = document.querySelector('.map-container');
const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
            mapObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (mapContainer) {
    mapObserver.observe(mapContainer);
}

// Form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        const requiredFields = ['fullName', 'organisation', 'email', 'phone', 'service', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                const input = contactForm.querySelector(`[name="${field}"]`);
                input.style.borderColor = '#ef4444';
            } else {
                const input = contactForm.querySelector(`[name="${field}"]`);
                input.style.borderColor = '#e5e7eb';
            }
        });
        
        if (isValid) {
            // Show success message
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Navbar scroll effect and ensure it stays sticky
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    // Force navbar to stay at top
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.left = '0';
    navbar.style.right = '0';
    navbar.style.zIndex = '9999';
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Ensure navbar is sticky on page load and force it
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Force navbar to be sticky
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex = '9999';
        navbar.style.transform = 'translateZ(0)';
        
        // Add class for additional CSS targeting
        navbar.classList.add('force-sticky');
        
        // Force it every 100ms to ensure it stays
        setInterval(() => {
            if (navbar) {
                navbar.style.position = 'fixed';
                navbar.style.top = '0';
                navbar.style.left = '0';
                navbar.style.right = '0';
                navbar.style.width = '100%';
                navbar.style.zIndex = '9999';
                navbar.style.transform = 'translateZ(0)';
            }
        }, 100);
        
        // Test if navbar is sticky
        console.log('Navbar position:', navbar.style.position);
        console.log('Navbar top:', navbar.style.top);
    }
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// About card hover effects
document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
});

// Initialize page
document.body.style.opacity = '0';
document.body.style.transform = 'translateY(20px)';
document.body.style.transition = 'all 0.8s ease';

// Add loading states for better UX
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('click', function(e) {
        if (this.href && this.href.includes('#')) {
            // Allow smooth scrolling for anchor links
            return;
        }
        
        // Add loading state for other links
        this.style.opacity = '0.7';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.style.opacity = '1';
            this.style.pointerEvents = 'auto';
        }, 1000);
    });
});

// Add intersection observer for navbar highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
});

// Add active class styles and ensure navbar stays sticky
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #1e3a8a !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    
    /* Force navbar to be sticky */
    .navbar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        transform: translateZ(0) !important;
    }
    
    /* Ensure navbar stays on top of everything */
    .navbar * {
        position: relative;
        z-index: 10000;
    }
    
    /* Ultimate sticky navbar rules */
    nav.navbar, .navbar, nav.navbar.force-sticky {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        transform: translateZ(0) !important;
        will-change: transform !important;
    }
`;
document.head.appendChild(style);
