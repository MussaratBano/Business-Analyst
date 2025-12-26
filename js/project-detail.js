// project-detail.js - SIMPLIFIED WORKING VERSION

(function() {
    'use strict';
    
    // Get the project slug from URL
    function getProjectSlugFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('slug');
    }
    
    // Create tools badges HTML
    function createToolsHTML(tools) {
        if (!tools || !Array.isArray(tools)) return '';
        
        return tools.map(tool => 
            `<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">${tool}</span>`
        ).join(' ');
    }
    
    // Create HTML for the project
    function createProjectHTML(project) {
        let html = `
            <article class="bg-white rounded-lg p-6 md:p-8 lg:p-10 shadow-lg">
                <!-- Back button -->
                <div class="mb-8">
                    <a href="projects.html" class="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to all projects
                    </a>
                </div>
                
                <!-- Title -->
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${project.title}</h1>
                
                <!-- Description -->
                <div class="bg-gray-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                    <p class="text-lg text-gray-700">${project.description}</p>
                </div>
        `;
        
        // Add media if exists
        if (project.mediaType && project.mediaPath) {
            if (project.mediaType === 'image') {
                html += `
                    <div class="mb-8 rounded-lg overflow-hidden shadow-xl border border-gray-200">
                        <img src="${project.mediaPath}" 
                             alt="${project.title}" 
                             class="w-full h-auto max-h-[600px] object-contain bg-white p-4"
                             loading="lazy">
                        <p class="text-center text-gray-500 text-sm p-2 bg-gray-50">Project Screenshot</p>
                    </div>
                `;
            } else if (project.mediaType === 'video') {
                // SIMPLE VIDEO PLAYER - NO COMPLEX SETTINGS
                html += `
                    <div class="mb-8 bg-black rounded-lg overflow-hidden shadow-xl">
                        <div class="relative pt-[56.25%]"> <!-- 16:9 aspect ratio -->
                            <div class="video-wrap">
                            <video controls playsinline webkit-playsinline
                                controlsList="nofullscreen nodownload noremoteplayback"
                                disablePictureInPicture
                                disableRemotePlayback
                                class="absolute top-0 left-0 w-full h-full"
                                controls
                                preload="metadata"
                                playsinline
                                src="${project.mediaPath}"
                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%231e3a8a'/%3E%3Cpath d='M500 300L300 400V200L500 300Z' fill='white'/%3E%3C/svg%3E"
                            ></video>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4 text-center">
                        <p class="text-gray-600 text-sm">
                            <i class="fas fa-info-circle mr-2"></i>
                            Click the play button above to view the project demonstration
                        </p>
                    </div>
                `;
            }
        }
        
        // Add full content
        html += `
                <!-- Full Content -->
                <div class="project-content text-gray-700 leading-relaxed space-y-6 text-lg mb-8">
                    ${project.content || '<p class="text-center py-8 text-gray-500">Detailed case study coming soon...</p>'}
                </div>
                
                <!-- Tools Section -->
                <div class="mb-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Tools & Technologies Used</h3>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${createToolsHTML(project.tools)}
                    </div>
                </div>
                
                <!-- GitHub Link -->
                <div class="bg-blue-50 p-6 rounded-lg mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Project Repository</h3>
                    <a href="${project.github}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        <i class="fab fa-github mr-3 text-xl"></i>
                        View on GitHub
                        <i class="fas fa-external-link-alt ml-2"></i>
                    </a>
                    <p class="text-gray-600 text-sm mt-2">(Opens in new tab)</p>
                </div>
                
                <!-- Navigation -->
                <div class="mt-12 pt-8 border-t border-gray-200 flex justify-between">
                    <a href="projects.html" class="text-blue-700 hover:text-blue-900 font-medium">
                        <i class="fas fa-briefcase mr-2"></i>All Projects
                    </a>
                    <a href="contact.html" class="text-blue-700 hover:text-blue-900 font-medium">
                        Request Similar Project <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </article>
        `;
        
        return html;
    }
    
    // Load and display the project
    function loadProjectArticle() {
        const slug = getProjectSlugFromURL();
        const container = document.getElementById('projectDetailContainer');
        
        if (!slug) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <h2 class="text-2xl text-gray-700 mb-4">Project not found</h2>
                    <a href="projects.html" class="text-blue-700 hover:text-blue-900">← Back to all projects</a>
                </div>
            `;
            return;
        }
        
        // Fetch all projects
        fetch('data/projects.json')
            .then(response => response.json())
            .then(projects => {
                // Find the project with matching slug
                const project = projects.find(p => p.slug === slug);
                
                if (!project) {
                    container.innerHTML = `
                        <div class="text-center py-12">
                            <h2 class="text-2xl text-gray-700 mb-4">Project not found</h2>
                            <a href="projects.html" class="text-blue-700 hover:text-blue-900">← Back to all projects</a>
                        </div>
                    `;
                    return;
                }
                
                // Create and display HTML
                container.innerHTML = createProjectHTML(project);
                
                // Add video event listeners after DOM is updated
                setTimeout(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.addEventListener('error', function(e) {
                            console.error('Video error:', video.error);
                            const videoContainer = video.parentElement.parentElement;
                            videoContainer.innerHTML = `
                                <div class="bg-red-50 border border-red-200 p-8 rounded-lg text-center">
                                    <div class="text-red-500 text-4xl mb-4">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <h3 class="text-xl font-bold text-red-700 mb-2">Video Cannot Play</h3>
                                    <p class="text-gray-700 mb-4">The video file may be:</p>
                                    <ul class="text-left inline-block text-gray-600 mb-4">
                                        <li>• Missing or wrong path</li>
                                        <li>• Wrong format (must be MP4/H.264)</li>
                                        <li>• Too large (should be < 10MB)</li>
                                    </ul>
                                    <div class="mt-6">
                                        <a href="${project.mediaPath}" 
                                           class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4">
                                            <i class="fas fa-download mr-2"></i>Download Video
                                        </a>
                                        <button onclick="location.reload()" 
                                                class="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">
                                            <i class="fas fa-redo mr-2"></i>Try Again
                                        </button>
                                    </div>
                                </div>
                            `;
                        });
                        
                        video.addEventListener('loadeddata', function() {
                            console.log('✅ Video loaded successfully');
                        });
                    }
                }, 100);
                
                // Update page title
                document.title = `${project.title} | Business Analyst Projects`;
            })
            .catch(error => {
                console.error('Error loading project:', error);
                container.innerHTML = `
                    <div class="text-center py-12">
                        <h2 class="text-2xl text-gray-700 mb-4">Error loading project</h2>
                        <p class="text-gray-600 mb-4">Please check your internet connection</p>
                        <a href="projects.html" class="text-blue-700 hover:text-blue-900">← Back to all projects</a>
                    </div>
                `;
            });
    }
    
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
        
        // Load the project
        loadProjectArticle();
    });
    
})();