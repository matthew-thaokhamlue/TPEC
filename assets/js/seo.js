/**
 * SEO Utilities Module
 * Handles dynamic structured data injection for project pages
 */

class SEOManager {
    constructor() {
        this.baseUrl = 'https://example.com';
        this.organizationData = {
            "@type": "Organization",
            "name": "Construction Consulting Services",
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/assets/img/logo.png`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Vientiane",
                "addressCountry": "LA"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "021-732131",
                "contactType": "customer service",
                "email": "thephachanhtoto@hotmail.com",
                "availableLanguage": ["English", "Lao"]
            }
        };
    }

    /**
     * Inject project-specific structured data when a project is expanded
     * @param {Object} project - Project data object
     */
    injectProjectStructuredData(project) {
        // Remove existing project structured data
        this.removeProjectStructuredData();

        const projectData = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.summary || `${project.scope} project in ${project.location}`,
            "creator": this.organizationData,
            "dateCreated": project.year,
            "workExample": {
                "@type": "CreativeWork",
                "name": project.title,
                "description": project.summary,
                "image": project.cover ? `${this.baseUrl}${project.cover}` : undefined,
                "location": {
                    "@type": "Place",
                    "name": project.location
                },
                "additionalProperty": [
                    {
                        "@type": "PropertyValue",
                        "name": "Project Scope",
                        "value": project.scope
                    },
                    {
                        "@type": "PropertyValue",
                        "name": "Status",
                        "value": project.status
                    },
                    {
                        "@type": "PropertyValue",
                        "name": "Year",
                        "value": project.year
                    }
                ]
            },
            "url": `${this.baseUrl}/projects.html#${project.slug}`,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${this.baseUrl}/projects.html#${project.slug}`
            }
        };

        // Create and inject script tag
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'project-structured-data';
        script.textContent = JSON.stringify(projectData, null, 2);
        document.head.appendChild(script);

        // Update Open Graph meta tags for the expanded project
        this.updateProjectMetaTags(project);
    }

    /**
     * Remove project-specific structured data
     */
    removeProjectStructuredData() {
        const existingScript = document.getElementById('project-structured-data');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Reset meta tags to page defaults
        this.resetProjectMetaTags();
    }

    /**
     * Update Open Graph meta tags for specific project
     * @param {Object} project - Project data object
     */
    updateProjectMetaTags(project) {
        const projectTitle = `${project.title} - Construction Consulting Projects`;
        const projectDescription = project.summary || `${project.scope} project in ${project.location}. Professional construction consulting services.`;
        const projectUrl = `${this.baseUrl}/projects.html#${project.slug}`;
        const projectImage = project.cover ? `${this.baseUrl}${project.cover}` : `${this.baseUrl}/assets/img/og-image.jpg`;

        // Update meta tags
        this.updateMetaTag('property', 'og:title', projectTitle);
        this.updateMetaTag('property', 'og:description', projectDescription);
        this.updateMetaTag('property', 'og:url', projectUrl);
        this.updateMetaTag('property', 'og:image', projectImage);
        this.updateMetaTag('property', 'twitter:title', projectTitle);
        this.updateMetaTag('property', 'twitter:description', projectDescription);
        this.updateMetaTag('property', 'twitter:image', projectImage);

        // Update page title
        document.title = projectTitle;

        // Update canonical URL if it exists
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = projectUrl;
    }

    /**
     * Reset meta tags to page defaults
     */
    resetProjectMetaTags() {
        // Get default values from i18n if available
        const defaultTitle = window.i18n ? window.i18n.t('meta.projects.title') : 'Our Projects - Construction Consulting Portfolio';
        const defaultDescription = window.i18n ? window.i18n.t('meta.projects.description') : 'Explore our portfolio of successful construction consulting projects';
        const defaultUrl = `${this.baseUrl}/projects.html`;
        const defaultImage = `${this.baseUrl}/assets/img/og-image.jpg`;

        // Reset meta tags
        this.updateMetaTag('property', 'og:title', defaultTitle);
        this.updateMetaTag('property', 'og:description', defaultDescription);
        this.updateMetaTag('property', 'og:url', defaultUrl);
        this.updateMetaTag('property', 'og:image', defaultImage);
        this.updateMetaTag('property', 'twitter:title', defaultTitle);
        this.updateMetaTag('property', 'twitter:description', defaultDescription);
        this.updateMetaTag('property', 'twitter:image', defaultImage);

        // Reset page title
        document.title = defaultTitle;

        // Reset canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = defaultUrl;
        }
    }

    /**
     * Update a specific meta tag
     * @param {string} attribute - The attribute to match (name or property)
     * @param {string} value - The value of the attribute
     * @param {string} content - The new content value
     */
    updateMetaTag(attribute, value, content) {
        let meta = document.querySelector(`meta[${attribute}="${value}"]`);
        if (meta) {
            meta.setAttribute('content', content);
        }
    }

    /**
     * Generate breadcrumb structured data
     * @param {Array} breadcrumbs - Array of breadcrumb objects {name, url}
     */
    injectBreadcrumbStructuredData(breadcrumbs) {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };

        // Remove existing breadcrumb data
        const existingBreadcrumb = document.getElementById('breadcrumb-structured-data');
        if (existingBreadcrumb) {
            existingBreadcrumb.remove();
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'breadcrumb-structured-data';
        script.textContent = JSON.stringify(breadcrumbData, null, 2);
        document.head.appendChild(script);
    }

    /**
     * Update hreflang tags based on current language
     * @param {string} currentLang - Current language code
     */
    updateHreflangTags(currentLang) {
        const currentPath = window.location.pathname;
        const baseUrl = this.baseUrl;
        
        // Update existing hreflang tags
        const hreflangTags = document.querySelectorAll('link[hreflang]');
        hreflangTags.forEach(tag => {
            const lang = tag.getAttribute('hreflang');
            tag.href = `${baseUrl}${currentPath}`;
        });

        // Update HTML lang attribute
        document.documentElement.lang = currentLang;

        // Update Open Graph locale
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            ogLocale.content = currentLang === 'lo' ? 'lo_LA' : 'en_US';
        }
    }
}

// Initialize SEO manager
const seoManager = new SEOManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOManager;
} else {
    window.SEOManager = SEOManager;
    window.seoManager = seoManager;
}