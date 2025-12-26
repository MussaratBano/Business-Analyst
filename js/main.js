// main.js - Global JavaScript for Business Analyst Website

// ===== DOM Ready Handler =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation Toggle =====
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // ===== Current Year Update =====
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // ===== External Link Handling =====
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.host + '"])');
    externalLinks.forEach(function(link) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });
    });
    
    // ===== Form Validation Helper (if forms are added later) =====
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
});

// ===== Utility Functions =====
const BusinessAnalystUtils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Safe element query with null check
    safeQuery: function(selector) {
        return document.querySelector(selector) || null;
    },
    
    // Safe element query all with null check
    safeQueryAll: function(selector) {
        return document.querySelectorAll(selector) || [];
    },
    
    // Add loading state to element
    setLoading: function(element, isLoading) {
        if (element) {
            if (isLoading) {
                element.classList.add('opacity-50', 'cursor-not-allowed');
                element.disabled = true;
            } else {
                element.classList.remove('opacity-50', 'cursor-not-allowed');
                element.disabled = false;
            }
        }
    },
    
    // Copy text to clipboard
    copyToClipboard: function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    }
};

// ===== Window Load Handler =====
window.addEventListener('load', function() {
    // Remove loading states if any
    const loadingElements = document.querySelectorAll('.loading-pulse');
    loadingElements.forEach(function(element) {
        element.classList.remove('loading-pulse');
    });
});

// ===== Responsive Behavior =====
window.addEventListener('resize', BusinessAnalystUtils.debounce(function() {
    // Close mobile menu on resize to desktop
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && window.innerWidth >= 768) {
        mobileMenu.classList.add('hidden');
    }
}, 250));

// ===== Error Boundary =====
window.addEventListener('error', function(event) {
    // Prevent JavaScript errors from breaking the page
    console.warn('Non-critical error occurred:', event.error);
    return true;
}, true);