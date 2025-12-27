// enhanced-animations.js - Add this to js folder
(function() {
    'use strict';
    
    // Initialize enhanced animations
    function initEnhancedAnimations() {
        // Normalize navigation: remove hardcoded highlights and apply single active link
        (function normalizeNav(){
            const links = Array.from(document.querySelectorAll('nav a'));

            // Normalize current page filename (strip query/hash)
            const currentPath = (new URL(location.href)).pathname;
            const currentPage = (currentPath.split('/').pop() || 'index.html').toLowerCase();

            // Ensure links are prepared and remove any hardcoded active classes first
            links.forEach(link => {
                link.classList.add('animated-underline', 'nav-item');
                link.classList.remove('text-blue-700', 'font-medium');
                link.removeAttribute('aria-current');
            });

            // Find links whose href exactly matches the current page (filename comparison)
            const matchingLinks = links.filter(link => {
                const href = link.getAttribute('href') || '';
                try {
                    const linkUrl = new URL(href, location.href);
                    const linkPage = (linkUrl.pathname.split('/').pop() || 'index.html').toLowerCase();
                    return linkPage === currentPage || (linkPage === '' && currentPage === 'index.html');
                } catch (e) {
                    return false;
                }
            });

            // Apply active styles only to the exact matching links (desktop + mobile copies)
            if (matchingLinks.length) {
                matchingLinks.forEach(link => {
                    link.classList.add('active', 'text-blue-700', 'font-medium');
                    link.classList.remove('text-gray-600');
                    link.setAttribute('aria-current', 'page');
                });
            } else {
                // Fallback: if no exact match, ensure home is marked on index
                links.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    const linkPage = href.split('/').pop() || 'index.html';
                    if (linkPage === 'index.html' && currentPage === 'index.html') {
                        link.classList.add('active', 'text-blue-700', 'font-medium');
                        link.classList.remove('text-gray-600');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        if (!link.classList.contains('text-gray-600')) link.classList.add('text-gray-600');
                    }
                });
            }
        })();
        
        // Add staggered animations to cards
        const cards = document.querySelectorAll('.bg-white.rounded-lg');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.classList.add('reveal');
            
            setTimeout(() => {
                card.classList.add('active');
            }, 100 * index);
        });
        
        // Add floating points to hero section
        const heroSection = document.querySelector('.bg-gradient-to-r.from-blue-50.to-gray-100');
        if (heroSection) {
            heroSection.classList.add('floating-points');
        }
        
        // Scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
        
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
        
        // Add animation to hero title
        const heroTitle = document.querySelector('h1.text-4xl');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroTitle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Animate service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(' + (index % 2 === 0 ? '-20px' : '20px') + ')';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 200 * index);
        });
        
        // Enhanced hover effects for links
        document.querySelectorAll('a[href^="http"], a[href^="#"], a[href^="mailto"]').forEach(link => {
            if (!link.querySelector('svg')) {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'w-4 h-4 ml-1 transition-transform duration-300');
                svg.setAttribute('fill', 'none');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('stroke', 'currentColor');
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('stroke-linecap', 'round');
                path.setAttribute('stroke-linejoin', 'round');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('d', 'M14 5l7 7m0 0l-7 7m7-7H3');
                
                svg.appendChild(path);
                link.appendChild(svg);
            }
        });
        
        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-gradient');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        });
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedAnimations);
    } else {
        initEnhancedAnimations();
    }
    
    // Export for debugging
    window.__EnhancedAnimations = {
        init: initEnhancedAnimations
    };
})();

// ===== PROFESSIONAL BUSINESS ICON ANIMATIONS FOR HERO BACKGROUND =====
function addBusinessIconAnimations() {
    const heroSection = document.querySelector('.hero-gradient');
    if (!heroSection) return;
    
    // Create icons container
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'business-icons-container';
    iconsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
    `;
    
    // Professional business icons (using emojis for simplicity)
    const businessIcons = ['📊', '📈', '📉', '💼', '📋', '🎯', '🔍', '📌', '📎', '📁', '📑', '📊', '📈', '📉'];
    
    // Define positions for icons in the layout (based on your image)
    const positions = [
        { top: '20%', left: '15%' },
        { top: '15%', left: '75%' },
        { top: '35%', left: '10%' },
        { top: '30%', left: '85%' },
        { top: '50%', left: '20%' },
        { top: '45%', left: '80%' },
        { top: '65%', left: '25%' },
        { top: '60%', left: '90%' },
        { top: '80%', left: '15%' },
        { top: '75%', left: '70%' },
        { top: '90%', left: '30%' },
        { top: '85%', left: '60%' },
        { top: '25%', left: '50%' },
        { top: '70%', left: '50%' }
    ];
    
    // Create and animate each icon
    businessIcons.forEach((icon, index) => {
        const iconElement = document.createElement('div');
        iconElement.textContent = icon;
        
        // Style for faded business icon
        iconElement.style.cssText = `
            position: absolute;
            font-size: 2rem;
            opacity: 0.25;
            transform: scale(0.8) rotate(0deg);
            transition: all 15s linear;
            animation-duration: ${20 + (index % 10)}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        `;
        
        // Position the icon
        if (positions[index]) {
            iconElement.style.top = positions[index].top;
            iconElement.style.left = positions[index].left;
        } else {
            // Random fallback positioning
            iconElement.style.top = `${Math.random() * 80 + 10}%`;
            iconElement.style.left = `${Math.random() * 80 + 10}%`;
        }
        
        // Different animations for visual variety
        switch (index % 4) {
            case 0:
                iconElement.style.animationName = 'floatVertical';
                break;
            case 1:
                iconElement.style.animationName = 'floatHorizontal';
                break;
            case 2:
                iconElement.style.animationName = 'floatCircular';
                break;
            case 3:
                iconElement.style.animationName = 'floatPulse';
                break;
        }
        
        iconsContainer.appendChild(iconElement);
        
        // Add hover effect (very subtle)
        iconElement.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) { // Desktop only
                iconElement.style.opacity = '0.15';
                iconElement.style.transform = 'scale(1.1)';
                iconElement.style.transition = 'all 0.3s ease';
            }
        });
        
        iconElement.addEventListener('mouseleave', () => {
            iconElement.style.opacity = '0.08';
            iconElement.style.transform = 'scale(0.8)';
            iconElement.style.transition = 'all 1s ease';
        });
    });
    
    // Add to hero section
    heroSection.appendChild(iconsContainer);
    
    // Add CSS animations for icons
    if (!document.querySelector('#business-icon-animations')) {
        const style = document.createElement('style');
        style.id = 'business-icon-animations';
        style.textContent = `
            @keyframes floatVertical {
                0%, 100% {
                    transform: translateY(0) scale(0.8) rotate(0deg);
                }
                25% {
                    transform: translateY(-20px) scale(0.85) rotate(5deg);
                }
                50% {
                    transform: translateY(-40px) scale(0.9) rotate(0deg);
                }
                75% {
                    transform: translateY(-20px) scale(0.85) rotate(-5deg);
                }
            }
            
            @keyframes floatHorizontal {
                0%, 100% {
                    transform: translateX(0) scale(0.8);
                }
                33% {
                    transform: translateX(30px) scale(0.85);
                }
                66% {
                    transform: translateX(-30px) scale(0.85);
                }
            }
            
            @keyframes floatCircular {
                0% {
                    transform: rotate(0deg) translateX(40px) rotate(0deg) scale(0.8);
                }
                100% {
                    transform: rotate(360deg) translateX(40px) rotate(-360deg) scale(0.8);
                }
            }
            
            @keyframes floatPulse {
                0%, 100% {
                    transform: scale(0.8);
                    opacity: 0.08;
                }
                50% {
                    transform: scale(0.9);
                    opacity: 0.12;
                }
            }
            
            /* Mobile optimization */
            @media (max-width: 768px) {
                .business-icons-container div {
                    font-size: 1.5rem !important;
                    opacity: 0.05 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add parallax effect to icons on scroll
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateIconParallax() {
        const scrolled = window.scrollY;
        const icons = iconsContainer.querySelectorAll('div');
        
        icons.forEach((icon, index) => {
            const speed = 0.03 + (index * 0.002);
            const yOffset = scrolled * speed;
            icon.style.transform += ` translateY(${yOffset}px)`;
        });
        
        lastScrollY = scrolled;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateIconParallax);
            ticking = true;
        }
    });
}

// ===== DATA FLOW ANIMATIONS (Connecting dots between icons) =====
function addDataFlowAnimations() {
    const heroSection = document.querySelector('.hero-gradient');
    if (!heroSection) return;
    
    // Create canvas for connecting lines
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.03;
    `;
    
    heroSection.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const points = [];
    
    // Create random points
    for (let i = 0; i < 8; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
        });
    }
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        // Update points
        points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;
            
            // Bounce off edges
            if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
            
            // Draw connections
            points.forEach(otherPoint => {
                const dx = point.x - otherPoint.x;
                const dy = point.y - otherPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.lineTo(otherPoint.x, otherPoint.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
}

// ===== CALL THESE FUNCTIONS IN YOUR INIT FUNCTION =====
// Add to your existing initEnhancedAnimations() function:

/*
function initEnhancedAnimations() {
    // ... existing code ...
    
    // Add professional business icon animations
    addBusinessIconAnimations();
    
    // Add subtle data flow animations (optional)
    setTimeout(addDataFlowAnimations, 1000);
    
    // ... rest of existing code ...
}
*/

// Or if you want to call them separately, add this to DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addBusinessIconAnimations, 500);
    setTimeout(addDataFlowAnimations, 1500);
});