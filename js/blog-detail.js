// blog-detail.js - Load individual blog articles

(function() {
    'use strict';
    
    // Get the blog slug from URL (e.g., blog-detail.html?slug=ai-in-business-analytics)
    function getBlogSlugFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('slug');
    }
    
    // Format date nicely
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Create HTML for the blog article
    function createBlogHTML(blog) {
        let html = `
            <article class="bg-white rounded-lg p-6 md:p-8 lg:p-10">
                <!-- Back button -->
                <div class="mb-8">
                    <a href="blogs.html" class="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to all blogs
                    </a>
                </div>
                
                <!-- Category badge -->
                ${blog.category ? `
                    <span class="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                        ${blog.category}
                    </span>
                ` : ''}
                
                <!-- Title -->
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-2">${blog.title}</h1>
                
                <!-- Date -->
                <div class="flex items-center text-gray-600 mb-8">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    <time datetime="${blog.date}">${formatDate(blog.date)}</time>
                </div>
        `;
        
        // Add media if exists
        if (blog.mediaType && blog.mediaPath) {
            if (blog.mediaType === 'image') {
                html += `
                    <div class="mb-8 rounded-lg overflow-hidden shadow-lg">
                        <img src="${blog.mediaPath}" 
                             alt="${blog.title}" 
                             class="w-full h-auto max-h-[500px] object-cover"
                             loading="lazy">
                    </div>
                `;
            } else if (blog.mediaType === 'video') {
                html += `
                    <div class="mb-8 rounded-lg overflow-hidden shadow-lg">
                        <video controls class="w-full h-auto" poster="${blog.mediaPath.replace('.mp4', '.jpg')}">
                            <source src="${blog.mediaPath}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            }
        }
        
        // Add content
        html += `
                <!-- Summary -->
                <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                    <p class="text-lg text-gray-700 italic">${blog.summary}</p>
                </div>
                
                <!-- Full Content -->
                <div class="blog-content text-gray-700 leading-relaxed space-y-6 text-lg">
                    ${blog.content || '<p class="text-center py-8 text-gray-500">Full content coming soon...</p>'}
                </div>
                
                <!-- Share buttons -->
                <div class="mt-12 pt-8 border-t border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                    <div class="flex space-x-4">
                        <button onclick="shareOnTwitter('${blog.title}')" class="text-blue-500 hover:text-blue-700">
                            <i class="fab fa-twitter text-xl"></i>
                        </button>
                        <button onclick="shareOnLinkedIn('${blog.title}')" class="text-blue-700 hover:text-blue-900">
                            <i class="fab fa-linkedin text-xl"></i>
                        </button>
                        <button onclick="shareOnFacebook('${blog.title}')" class="text-blue-800 hover:text-blue-900">
                            <i class="fab fa-facebook text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="mt-12 pt-8 border-t border-gray-200 flex justify-between">
                    <a href="blogs.html" class="text-blue-700 hover:text-blue-900 font-medium">
                        <i class="fas fa-list mr-2"></i>All Blogs
                    </a>
                    <a href="contact.html" class="text-blue-700 hover:text-blue-900 font-medium">
                        Contact Me <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </article>
        `;
        
        return html;
    }
    
    // Load and display the blog
    function loadBlogArticle() {
        const slug = getBlogSlugFromURL();
        const container = document.getElementById('blogDetailContainer');
        
        if (!slug) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <h2 class="text-2xl text-gray-700 mb-4">Blog article not found</h2>
                    <a href="blogs.html" class="text-blue-700 hover:text-blue-900">← Back to all blogs</a>
                </div>
            `;
            return;
        }
        
        // Fetch all blogs
        fetch('data/blogs.json')
            .then(response => response.json())
            .then(blogs => {
                // Find the blog with matching slug
                const blog = blogs.find(b => b.slug === slug);
                
                if (!blog) {
                    container.innerHTML = `
                        <div class="text-center py-12">
                            <h2 class="text-2xl text-gray-700 mb-4">Blog article not found</h2>
                            <a href="blogs.html" class="text-blue-700 hover:text-blue-900">← Back to all blogs</a>
                        </div>
                    `;
                    return;
                }
                
                // Create and display HTML
                container.innerHTML = createBlogHTML(blog);
                
                // Update page title
                document.title = `${blog.title} | Business Analyst`;
            })
            .catch(error => {
                console.error('Error loading blog:', error);
                container.innerHTML = `
                    <div class="text-center py-12">
                        <h2 class="text-2xl text-gray-700 mb-4">Error loading article</h2>
                        <p class="text-gray-600 mb-4">Please check your internet connection</p>
                        <a href="blogs.html" class="text-blue-700 hover:text-blue-900">← Back to all blogs</a>
                    </div>
                `;
            });
    }
    
    // Share functions
    window.shareOnTwitter = function(title) {
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    };
    
    window.shareOnLinkedIn = function(title) {
        const url = window.location.href;
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
    };
    
    window.shareOnFacebook = function(title) {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };
    
    // Start when page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Set current year in footer
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
        
        // Load the blog article
        loadBlogArticle();
    });
    
})();