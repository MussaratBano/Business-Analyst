// blogs.js - Dynamic blog article loading for Business Analyst website

(function() {
    'use strict';
    
    // ===== Configuration =====
    const CONFIG = {
        dataPath: 'data/blogs.json',
        containerId: 'blogsContainer',
        fallbackMessage: 'Professional insights and articles are currently being prepared.',
        errorMessage: 'Unable to load analytical articles at this time.',
        dateFormat: {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        },
        articleStructure: {
            title: 'string',
            date: 'string',
            summary: 'string',
            category: 'string'
        }
    };
    
    // ===== DOM References =====
    let blogsContainer = null;
    
    // ===== Blog Manager =====
    const BlogManager = {
        /**
         * Initialize blog loading and rendering
         */
        init: function() {
            blogsContainer = document.getElementById(CONFIG.containerId);
            
            if (!blogsContainer) {
                console.warn(`Container element with ID "${CONFIG.containerId}" not found.`);
                return;
            }
            
            this.loadBlogs();
        },
        
        /**
         * Fetch blogs from JSON file
         */
        loadBlogs: function() {
            this.showLoadingState();
            
            fetch(CONFIG.dataPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => this.validateAndRender(data))
                .catch(error => {
                    console.error('Failed to load blogs:', error);
                    this.showErrorState();
                });
        },
        
        /**
         * Validate blog data structure and render if valid
         * @param {Array} blogs - Array of blog objects
         */
        validateAndRender: function(blogs) {
            if (!Array.isArray(blogs)) {
                console.error('Invalid blogs data format: expected array');
                this.showErrorState();
                return;
            }
            
            if (blogs.length === 0) {
                this.showEmptyState();
                return;
            }
            
            const validBlogs = blogs.filter(blog => this.validateBlog(blog));
            
            if (validBlogs.length === 0) {
                this.showErrorState();
                return;
            }
            
            // Sort blogs by date (newest first)
            validBlogs.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            
            this.renderBlogs(validBlogs);
        },
        
        /**
         * Validate individual blog structure
         * @param {Object} blog - Blog object to validate
         * @returns {boolean} - True if blog is valid
         */
        validateBlog: function(blog) {
            if (!blog || typeof blog !== 'object') return false;
            
            // Check required fields
            if (!blog.title || typeof blog.title !== 'string') return false;
            if (!blog.date || typeof blog.date !== 'string') return false;
            if (!blog.summary || typeof blog.summary !== 'string') return false;
            
            // Validate date can be parsed
            const date = new Date(blog.date);
            if (isNaN(date.getTime())) return false;
            
            return true;
        },
        
        /**
         * Render validated blogs to the container
         * @param {Array} blogs - Validated blog objects
         */
        renderBlogs: function(blogs) {
            blogsContainer.innerHTML = '';

            blogs.forEach((blog, index) => {
                const blogElement = this.createBlogElement(blog);

                if (blogElement) {
                blogElement.classList.add('reveal');
                blogsContainer.appendChild(blogElement);

                setTimeout(() => {
                    blogElement.classList.add('active');
                }, 120 * index);
                }
            });
        },

        
        /**
         * Create DOM element for a single blog article
         * @param {Object} blog - Valid blog object
         * @returns {HTMLElement|null} - Blog element or null if creation fails
         */
        createBlogElement: function(blog) {
            try {
                const articleCard = document.createElement('article');
                articleCard.className = 'bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors flex flex-col h-full';
                
                // Create header section
                const headerSection = document.createElement('div');
                headerSection.className = 'mb-4';
                
                // Create category badge if exists
                if (blog.category && blog.category.trim()) {
                    const categoryBadge = document.createElement('span');
                    categoryBadge.className = 'inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-3';
                    categoryBadge.textContent = blog.category;
                    headerSection.appendChild(categoryBadge);
                }
                
                // Create title
                const title = document.createElement('h3');
                title.className = 'text-xl font-semibold text-gray-900 mb-3 line-clamp-2';
                title.textContent = blog.title;
                headerSection.appendChild(title);
                
                // Create date
                const dateElement = document.createElement('time');
                dateElement.className = 'text-gray-600 text-sm';
                const date = new Date(blog.date);
                dateElement.textContent = date.toLocaleDateString('en-US', CONFIG.dateFormat);
                dateElement.setAttribute('datetime', date.toISOString());
                headerSection.appendChild(dateElement);
                
                // Create summary
                const summary = document.createElement('div');
                summary.className = 'mt-4 flex-grow';
                
                const summaryText = document.createElement('p');
                summaryText.className = 'text-gray-700 leading-relaxed line-clamp-3';
                summaryText.textContent = blog.summary;
                summary.appendChild(summaryText);
                
                // Create read indicator
                const readIndicator = document.createElement('div');
                readIndicator.className = 'mt-6 pt-4 border-t border-gray-100';

                const readLink = document.createElement('a');  // Changed from 'span' to 'a'
                readLink.className = 'text-blue-700 hover:text-blue-900 font-medium inline-flex items-center text-sm';
                readLink.textContent = 'Read Analysis';
                readLink.href = `blog-detail.html?slug=${blog.slug}`;  // ADD THIS LINE

                const arrowIcon = document.createElement('span');
                arrowIcon.className = 'ml-2';
                arrowIcon.innerHTML = '→';
                readLink.appendChild(arrowIcon);

                readIndicator.appendChild(readLink);
                                
                // Assemble article card
                articleCard.appendChild(headerSection);
                articleCard.appendChild(summary);
                articleCard.appendChild(readIndicator);
                
                return articleCard;
                
            } catch (error) {
                console.error('Error creating blog element:', error);
                return null;
            }
        },
        
        /**
         * Display loading state in container
         */
        showLoadingState: function() {
            if (!blogsContainer) return;
            
            blogsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500 col-span-full">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-4"></div>
                    <p>Loading professional insights...</p>
                </div>
            `;
        },
        
        /**
         * Display error state in container
         */
        showErrorState: function() {
            if (!blogsContainer) return;
            
            blogsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500 col-span-full">
                    <p>${CONFIG.errorMessage}</p>
                    <p class="text-sm mt-2">Analytical content will be available shortly.</p>
                </div>
            `;
        },
        
        /**
         * Display empty state in container
         */
        showEmptyState: function() {
            if (!blogsContainer) return;
            
            blogsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500 col-span-full">
                    <p>${CONFIG.fallbackMessage}</p>
                </div>
            `;
        },
        
        /**
         * Format date string to readable format
         * @param {string} dateString - ISO date string
         * @returns {string} - Formatted date
         */
        formatDate: function(dateString) {
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', CONFIG.dateFormat);
            } catch (error) {
                console.error('Error formatting date:', error);
                return dateString;
            }
        }
    };
    
    // ===== Initialize on DOM Ready =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => BlogManager.init());
    } else {
        BlogManager.init();
    }
    
    // ===== Export for potential debugging (dev only) =====
    if (typeof window !== 'undefined') {
        window.__BusinessAnalystBlogs = window.__BusinessAnalystBlogs || {};
        window.__BusinessAnalystBlogs.BlogManager = BlogManager;
    }
    
})();