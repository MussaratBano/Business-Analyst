// projects.js - Dynamic project loading for Business Analyst website

(function() {
    'use strict';
    
    // ===== Configuration =====
    const CONFIG = {
        dataPath: 'data/projects.json',
        containerId: 'projectsContainer',
        fallbackMessage: 'Analytical case studies are currently being prepared for review.',
        errorMessage: 'Unable to load project details at this time.',
        projectStructure: {
            title: 'string',
            description: 'string',
            tools: 'array',
            github: 'string',
            mediaType: 'string',
            mediaPath: 'string'
        },
        media: {
            image: {
                element: 'img',
                attributes: {
                    loading: 'lazy',
                    decoding: 'async'
                }
            },
            video: {
                element: 'video',
                attributes: {
                    controls: true,
                    muted: true,
                    playsinline: true,
                    preload: 'metadata',
                    // ✅ disable buttons/options
                    controlsList: 'nofullscreen nodownload noremoteplayback noplaybackrate',
                    disablepictureinpicture: true,
                    disableremoteplayback: true
                                    
                }
            }
        }
    };
    
    // ===== DOM References =====
    let projectsContainer = null;
    
    // ===== Project Manager =====
    const ProjectManager = {
        /**
         * Initialize the project loading and rendering
         */
        init: function() {
            projectsContainer = document.getElementById(CONFIG.containerId);
            
            if (!projectsContainer) {
                console.warn(`Container element with ID "${CONFIG.containerId}" not found.`);
                return;
            }
            
            this.loadProjects();
        },
        
        /**
         * Fetch projects from JSON file
         */
        loadProjects: function() {
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
                    console.error('Failed to load projects:', error);
                    this.showErrorState();
                });
        },
        
        /**
         * Validate project data structure and render if valid
         * @param {Array} projects - Array of project objects
         */
        validateAndRender: function(projects) {
            if (!Array.isArray(projects)) {
                console.error('Invalid projects data format: expected array');
                this.showErrorState();
                return;
            }
            
            if (projects.length === 0) {
                this.showEmptyState();
                return;
            }
            
            const validProjects = projects.filter(project => this.validateProject(project));
            
            if (validProjects.length === 0) {
                this.showErrorState();
                return;
            }
            
            this.renderProjects(validProjects);
        },
        
        /**
         * Validate individual project structure
         * @param {Object} project - Project object to validate
         * @returns {boolean} - True if project is valid
         */
        validateProject: function(project) {
            if (!project || typeof project !== 'object') return false;
            
            // Check required fields
            if (!project.title || typeof project.title !== 'string') return false;
            if (!project.description || typeof project.description !== 'string') return false;
            
            // Validate tools array if present
            if (!project.tools || !Array.isArray(project.tools)) return false;
            
            // Validate GitHub URL
            if (!project.github || typeof project.github !== 'string') return false;
            
            // Validate media if present
            if (project.mediaType && !['image', 'video'].includes(project.mediaType)) return false;
            if (project.mediaType && (!project.mediaPath || typeof project.mediaPath !== 'string')) return false;
            
            return true;
        },
        
        /**
         * Render validated projects to the container
         * @param {Array} projects - Validated project objects
         */
        renderProjects: function(projects) {
        projectsContainer.innerHTML = '';

            projects.forEach((project, index) => {
                const projectElement = this.createProjectElement(project);

                if (projectElement) {
                projectElement.classList.add('reveal');
                projectsContainer.appendChild(projectElement);

                // stagger animation (services jaisa feel)
                setTimeout(() => {
                    projectElement.classList.add('active');
                }, 120 * index);
                }
            });
        },

        
        /**
         * Create DOM element for a single project
         * @param {Object} project - Valid project object
         * @returns {HTMLElement|null} - Project element or null if creation fails
         */
        createProjectElement: function(project) {
            try {
                const projectCard = document.createElement('article');
                projectCard.className = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors overflow-hidden flex flex-col h-full';
                
                // Create media section if exists
                let mediaSection = null;
                if (project.mediaType && project.mediaPath) {
                    mediaSection = this.createMediaElement(project);
                    if (mediaSection) {
                        projectCard.appendChild(mediaSection);
                    }
                }
                
                // Create content section
                const contentSection = document.createElement('div');
                contentSection.className = 'p-8 flex-grow flex flex-col';
                
                // Create title
                const title = document.createElement('h3');
                title.className = 'text-xl font-semibold text-blue-800 mb-4';
                title.textContent = project.title;
                contentSection.appendChild(title);
                
                // Create description
                const description = document.createElement('p');
                description.className = 'text-gray-700 mb-6 flex-grow';
                description.textContent = project.description;
                contentSection.appendChild(description);
                
                // Create tools section
                if (project.tools && project.tools.length > 0) {
                    const toolsSection = this.createToolsElement(project.tools);
                    if (toolsSection) {
                        contentSection.appendChild(toolsSection);
                    }
                }
                
                 // Create Case Study link (NEW)
                const caseStudyLink = this.createCaseStudyElement(project.slug);
                if (caseStudyLink) {
                    contentSection.appendChild(caseStudyLink);
                }

                // Create GitHub link
                // const githubLink = this.createGitHubElement(project.github);
                // if (githubLink) {
                //     contentSection.appendChild(githubLink);
                // }

               
                                
                // Assemble project card
                projectCard.appendChild(contentSection);
                
                return projectCard;
                
            } catch (error) {
                console.error('Error creating project element:', error);
                return null;
            }
        },
        
        /**
         * Create media element (image or video) for project
         * @param {Object} project - Project object with media
         * @returns {HTMLElement|null} - Media element or null
         */
        createMediaElement: function(project) {
            try {
                const mediaConfig = CONFIG.media[project.mediaType];
                if (!mediaConfig) return null;
                
                const mediaContainer = document.createElement('div');
                mediaContainer.className = 'bg-gray-100 overflow-hidden';
                
                const mediaElement = document.createElement(mediaConfig.element);
                mediaElement.className = 'w-full h-48 object-cover';
                mediaElement.src = project.mediaPath;
                
                // Set additional attributes
                Object.entries(mediaConfig.attributes).forEach(([key, value]) => {
                    if (value) {
                        if (typeof value === 'boolean') {
                            if (value) mediaElement.setAttribute(key, '');
                        } else {
                            mediaElement.setAttribute(key, value);
                        }
                    }
                });
                
                // Set alt text for images
                if (project.mediaType === 'image') {
                    mediaElement.alt = `${project.title} - Analytical Output`;
                }
                
                // Add poster for videos
                if (project.mediaType === 'video') {
                    mediaElement.poster = project.mediaPath.replace('.mp4', '.jpg').replace('.webm', '.jpg');
                }
                
                mediaContainer.appendChild(mediaElement);
                return mediaContainer;
                
            } catch (error) {
                console.error('Error creating media element:', error);
                return null;
            }
        },
        
        /**
         * Create tools section for project
         * @param {Array} tools - Array of tools/techniques
         * @returns {HTMLElement|null} - Tools element or null
         */
        createToolsElement: function(tools) {
            try {
                const toolsSection = document.createElement('div');
                toolsSection.className = 'mb-6';
                
                const toolsLabel = document.createElement('h4');
                toolsLabel.className = 'font-medium text-gray-900 mb-2';
                toolsLabel.textContent = 'Tools & Techniques';
                
                const toolsList = document.createElement('div');
                toolsList.className = 'flex flex-wrap gap-2';
                
                tools.forEach(tool => {
                    if (tool && tool.trim()) {
                        const toolBadge = document.createElement('span');
                        toolBadge.className = 'px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full';
                        toolBadge.textContent = tool;
                        toolsList.appendChild(toolBadge);
                    }
                });
                
                if (toolsList.children.length > 0) {
                    toolsSection.appendChild(toolsLabel);
                    toolsSection.appendChild(toolsList);
                    return toolsSection;
                }
                
                return null;
                
            } catch (error) {
                console.error('Error creating tools element:', error);
                return null;
            }
        },
        
        /**
         * Create GitHub link element
         * @param {string} githubUrl - GitHub repository URL
         * @returns {HTMLElement|null} - GitHub link element or null
         */
        createGitHubElement: function(githubUrl) {
            try {
                const githubLink = document.createElement('a');
                githubLink.href = githubUrl;
                githubLink.className = 'inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mt-auto';
                githubLink.target = '_blank';
                githubLink.rel = 'noopener noreferrer';
                githubLink.textContent = 'View Analysis Repository';
                
                const githubIcon = document.createElement('span');
                githubIcon.className = 'ml-2';
                githubIcon.innerHTML = '→';
                githubLink.appendChild(githubIcon);
                
                return githubLink;
                
            } catch (error) {
                console.error('Error creating GitHub element:', error);
                return null;
            }
        },

        /**
         * Create Case Study link element
         * @param {string} slug - Project slug
         * @returns {HTMLElement|null} - Case Study link element or null
         */
        createCaseStudyElement: function(slug) {
            try {
                const caseStudyLink = document.createElement('a');
                caseStudyLink.href = `project-detail.html?slug=${slug}`;
                caseStudyLink.className = 'inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mt-2';
                caseStudyLink.textContent = 'View Case Study';
                
                const arrowIcon = document.createElement('span');
                arrowIcon.className = 'ml-2';
                arrowIcon.innerHTML = '→';
                caseStudyLink.appendChild(arrowIcon);
                
                return caseStudyLink;
                
            } catch (error) {
                console.error('Error creating case study element:', error);
                return null;
            }
        },
        
        /**
         * Display loading state in container
         */
        showLoadingState: function() {
            if (!projectsContainer) return;
            
            projectsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500 col-span-full">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-4"></div>
                    <p>Loading analytical case studies...</p>
                </div>
            `;
        },
        
        /**
         * Display error state in container
         */
        showErrorState: function() {
            if (!projectsContainer) return;
            
            projectsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500 col-span-full">
                    <p>${CONFIG.errorMessage}</p>
                    <p class="text-sm mt-2">Please try again later or contact for direct case examples.</p>
                </div>
            `;
        },
        
        /**
         * Display empty state in container
         */
        showEmptyState: function() {
            if (!projectsContainer) return;
            
            projectsContainer.innerHTML = `
                <div class="text-center py-12 text-gray-500 col-span-full">
                    <p>${CONFIG.fallbackMessage}</p>
                </div>
            `;
        }
    };
    
    // ===== Initialize on DOM Ready =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProjectManager.init());
    } else {
        ProjectManager.init();
    }
    
    // ===== Export for potential debugging (dev only) =====
    if (typeof window !== 'undefined') {
        window.__BusinessAnalystProjects = window.__BusinessAnalystProjects || {};
        window.__BusinessAnalystProjects.ProjectManager = ProjectManager;
    }
    
})();