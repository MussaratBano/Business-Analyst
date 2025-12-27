# Business Analyst Professional Website

## Project Overview

This static website serves as a professional platform for a Business Analyst to demonstrate analytical capabilities, share insights, and present structured business analysis work. The site emphasizes practical problem-solving, data-driven decision support, and clear stakeholder communication through a clean, maintainable technical architecture.

## Website Sections

### Home
Professional introduction highlighting business analysis experience, core competencies, and value proposition. Establishes credibility through concise expertise summaries and structured service descriptions.

### Blogs
Analytical articles and professional insights on business analysis methodologies, data interpretation, stakeholder collaboration, and decision support frameworks. Content demonstrates structured thinking and industry awareness.

### Projects
Case-style analytical work demonstrating real-world business problem-solving. Each project includes detailed descriptions of business challenges, analytical approaches, tools utilized, and outcome-focused summaries, optionally supported by visual artifacts.

### Certifications
Professional Certifications verified by credly.


### Services
Clear articulation of professional service offerings aligned with a Business Analyst responsibilities. Descriptions focus on business value delivery, analytical rigor, and practical application.

### Contact
Professional communication channels for business inquiries, analytical collaboration, and recruitment discussions. Provides direct access points for stakeholder engagement.

## Technology Stack

- **HTML5**: Semantic markup for structure and accessibility
- **CSS3**: Custom styling with Custom CSS for responsive design
- **Vanilla JavaScript**: Lightweight interactivity without frameworks
- **JSON**: Structured data storage for dynamic content

The static architecture was chosen for performance, simplicity, transparency, and hosting reliability. This approach ensures fast load times, easy maintenance, and compatibility with various hosting environments including GitHub Pages.

## Project Structure

```
ba-portfolio/
├── index.html              # Homepage
├── blogs.html              # Articles and insights
├── blog-detail.html        
├── projects.html           # Analytical case studies
├── project-detail.html    
├── certifications.html     # Professional Certificates
├── services.html           # Service offerings
├── contact.html            # Contact information
├── test-connections.html  
├── css/
│   └── style.css           # Custom styling enhancements
├── js/
│   ├── main.js             # Common functionality
│   ├── blogs.js            # Dynamic blog loading
|   ├── blog-detail.js     
│   ├── projects.js         # Dynamic project loading
|   ├── project-detail.js             
│   └── enhanced-animations.js         
├── data/
│   ├── blogs.json          # Article data
│   └── projects.json       # Project case data
└── assets/
    ├── images/             # Supporting visuals
    └── videos/             # Demonstration clips
```

## Data-Driven Design

Content is managed through JSON files in the `data/` directory:

- **projects.json**: Contains project case data including titles, descriptions, tools, GitHub links, and optional media references
- **blogs.json**: Contains article data including titles, publication dates, summaries, categories, and optional media references

JavaScript files dynamically render this content, allowing for content updates without HTML modification. This separation of content from presentation simplifies maintenance and enables easy addition of new work examples.

## Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ba-portfolio
   ```

2. Open the project in VS Code (or preferred editor)

3. Use VS Code Live Server extension:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"
   - The site will launch at `http://localhost:5500`

Direct file opening (`file://`) is discouraged due to JavaScript module restrictions and relative path resolution issues. Live Server provides proper localhost serving and automatic refresh capabilities.

## Deployment

The website is configured for deployment via GitHub Pages:

1. Push the repository to GitHub
2. Navigate to Repository Settings → Pages
3. Set source to "Deploy from a branch"
4. Select the `main` branch and `/ (root)` folder
5. The site will deploy to `https://mussaratbano.github.io/Business-Analyst/`
All paths use relative references compatible with GitHub Pages hosting. No additional configuration is required beyond the initial repository setup.

## Maintenance & Extension

### Adding New Projects
1. Edit `data/projects.json`
2. Add a new project object following the existing structure
3. Upload supporting media to `assets/images/` or `assets/videos/`
4. The project will automatically appear in the Projects section

### Adding New Blog Articles
1. Edit `data/blogs.json`
2. Add a new article object following the existing structure
3. Upload supporting media if applicable
4. The article will automatically appear in the Blogs section

### Adding Media Assets
1. Place images in `assets/images/` using descriptive filenames
2. Place videos in `assets/videos/` using compressed formats (MP4/WebM)
3. Reference assets using relative paths in JSON files

### Content Updates
- Modify JSON files for content changes
- Update `css/style.css` for styling adjustments
- Update HTML files for structural changes
- JavaScript files typically require no modification for content updates

## Accessibility & Performance Notes

- Semantic HTML5 elements ensure proper screen reader interpretation
- Responsive design supports devices from mobile to desktop
- Lightweight assets maintain fast loading times
- No external dependencies beyond Tailwind CSS CDN
- Progressive enhancement ensures functionality without JavaScript
- Images include descriptive alt text for accessibility
- Color contrast meets WCAG 2.1 AA standards

## Professional Notes

This website represents a practical implementation of business analysis principles through its structured content, clear communication, and maintainable architecture. The codebase emphasizes readability, logical organization, and professional presentation suitable for technical and non-technical stakeholders.

The site is designed for hiring managers, recruiters, business stakeholders, and analytics professionals seeking to evaluate business analysis capabilities through demonstrated work examples and structured professional communication.