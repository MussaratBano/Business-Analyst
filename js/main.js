// main.js - Global JavaScript for Business Analyst Website

// ===== DOM Ready Handler =====
// main.js - Mobile menu fix version
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Main.js loaded");
    
    // ===== MOBILE MENU FIX =====
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        console.log("✅ Mobile menu elements found");
        
        mobileMenuButton.addEventListener('click', function(e) {
            console.log("🟢 Mobile menu button clicked!");
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && 
                !mobileMenuButton.contains(event.target) && 
                !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    } else {
        console.error("❌ Mobile menu elements NOT found!");
    }
    
    // ===== CURRENT YEAR UPDATE =====
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
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