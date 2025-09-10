/**
 * Main Application Module
 * Coordinates all modules and handles page-specific functionality
 */

class App {
  constructor() {
    this.initialized = false;
    this.projects = null;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Initialize i18n system first with error handling
      try {
        await i18n.init();
      } catch (i18nError) {
        console.warn('i18n initialization failed, using fallbacks:', i18nError);
        this.enableI18nFallbacks();
      }

      // Initialize motion system (GSAP animations) with error handling
      try {
        if (window.Motion) {
          await window.Motion.init();
        }
      } catch (motionError) {
        console.warn('Motion system initialization failed, using CSS fallbacks:', motionError);
        document.body.classList.add('no-gsap', 'no-animations');
      }

      // Initialize other modules after core systems are ready
      this.bindGlobalEvents();
      this.handlePageSpecificInit();

      this.initialized = true;
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      
      // Enable all fallback systems
      this.enableAllFallbacks();
      
      // Continue with basic functionality even if some modules fail
      try {
        this.handlePageSpecificInit();
      } catch (pageError) {
        console.error('Page initialization also failed:', pageError);
        this.showBasicContent();
      }
    }
  }

  bindGlobalEvents() {
    // Handle external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[target="_blank"]');
      if (link) {
        // Ensure external links have proper security attributes
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Handle contact method clicks
    document.addEventListener('click', (e) => {
      this.handleContactClick(e);
    });

    // Handle form submissions (if any forms are added later)
    document.addEventListener('submit', (e) => {
      this.handleFormSubmit(e);
    });

    // Handle window events
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle scroll events for animations (will be used with GSAP later)
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Handle language changes
    window.addEventListener('languageChanged', (e) => {
      this.handleLanguageChange(e.detail.language);
    });
  }

  handlePageSpecificInit() {
    const currentPage = this.getCurrentPage();

    switch (currentPage) {
      case 'home':
        this.initHomePage();
        break;
      case 'about':
        this.initAboutPage();
        break;
      case 'projects':
        this.initProjectsPage();
        break;
      case 'contact':
        this.initContactPage();
        break;
      default:
        console.log('No specific initialization for this page');
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      return 'home';
    } else if (path.includes('about')) {
      return 'about';
    } else if (path.includes('projects')) {
      return 'projects';
    } else if (path.includes('contact')) {
      return 'contact';
    }
    return 'unknown';
  }

  initHomePage() {
    console.log('Initializing home page');
    this.renderServices();
    this.renderFeaturedProjects();
    this.initCounters();
    this.setupParallaxEffects();
  }

  initAboutPage() {
    console.log('Initializing about page');
    this.renderApproachTimeline();
    this.renderCapabilities();
    // Skip team rendering - about.html has its own comprehensive team system
    // this.renderLeadershipTeam();
    this.renderCertifications();
    this.setupAnchorNavigation();
  }

  initProjectsPage() {
    console.log('Initializing projects page');
    this.setupProjectTabs();
    this.loadProjects();
    this.setupProjectDeepLinking();
  }

  initContactPage() {
    console.log('Initializing contact page');
    this.setupContactMethods();
  }

  setupContactMethods() {
    // Setup email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Add subject line if not present
        const href = link.getAttribute('href');
        if (!href.includes('subject=')) {
          const subject = encodeURIComponent(i18n.t('contact.email.subject', 'Construction Consulting Inquiry'));
          link.setAttribute('href', `${href}?subject=${subject}`);
        }
      });
    });

    // Setup WhatsApp links
    const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Add default message if not present
        const href = link.getAttribute('href');
        if (!href.includes('text=')) {
          const message = encodeURIComponent(i18n.t('contact.whatsapp.message', 'Hello, I would like to inquire about your construction consulting services.'));
          const separator = href.includes('?') ? '&' : '?';
          link.setAttribute('href', `${href}${separator}text=${message}`);
        }
      });
    });
  }

  handleContactClick(e) {
    const contactElement = e.target.closest('[data-contact-method]');
    if (!contactElement) return;

    const method = contactElement.getAttribute('data-contact-method');
    const value = contactElement.getAttribute('data-contact-value');

    switch (method) {
      case 'email':
        this.openEmail(value);
        break;
      case 'whatsapp':
        this.openWhatsApp(value);
        break;
      case 'facebook':
        this.openFacebook(value);
        break;
    }
  }

  openEmail(email) {
    const subject = encodeURIComponent(i18n.t('contact.email.subject', 'Construction Consulting Inquiry'));
    const body = encodeURIComponent(i18n.t('contact.email.body', 'Hello,\n\nI would like to inquire about your construction consulting services.\n\nBest regards'));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  openWhatsApp(phone) {
    const message = encodeURIComponent(i18n.t('contact.whatsapp.message', 'Hello, I would like to inquire about your construction consulting services.'));
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
  }

  openFacebook(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  handleFormSubmit(e) {
    // Form handling will be implemented if forms are added later
    console.log('Form submitted:', e.target);
  }

  handleResize() {
    // Handle responsive adjustments
    this.updateViewportHeight();
  }

  handleScroll() {
    // Scroll handling for animations
    if (window.Motion && window.Motion.scrollTriggerLoaded) {
      // ScrollTrigger handles scroll events automatically
      return;
    }
    
    // Fallback intersection observer for reveal animations when GSAP is not available
    this.handleScrollFallback();
  }

  handleScrollFallback() {
    // Simple intersection observer fallback for reveal animations
    if (!this.intersectionObserver) {
      this.setupIntersectionObserver();
    }
  }

  setupIntersectionObserver() {
    // Only setup if GSAP is not available
    if (window.Motion && window.Motion.gsapLoaded) {
      return;
    }

    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -20% 0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Observe reveal elements
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  updateViewportHeight() {
    // Update CSS custom property for mobile viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Home page specific methods
  renderServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    const services = i18n.t('services.items', []);
    if (!Array.isArray(services) || services.length === 0) {
      console.warn('No services data found');
      return;
    }

    servicesGrid.innerHTML = '';
    
    services.forEach((service, index) => {
      const serviceCard = document.createElement('div');
      serviceCard.className = 'card reveal-up';
      serviceCard.style.setProperty('--delay', `${index * 0.1}s`);
      serviceCard.setAttribute('role', 'listitem');
      serviceCard.setAttribute('aria-label', `Service: ${service.title}`);
      
      serviceCard.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${service.title}</h3>
          <p class="card-description">${service.description}</p>
        </div>
      `;
      
      servicesGrid.appendChild(serviceCard);
    });

    console.log(`Rendered ${services.length} service cards`);
  }

  async renderFeaturedProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    try {
      const data = await this.loadProjectsWithRetry();
      const featuredProjects = data.projects.filter(project => project.featured);
      
      if (featuredProjects.length === 0) {
        console.warn('No featured projects found');
        this.showFallbackProjects(projectsGrid);
        return;
      }

      projectsGrid.innerHTML = '';
      
      featuredProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'card reveal-up';
        projectCard.style.setProperty('--delay', `${index * 0.15}s`);
        projectCard.setAttribute('role', 'listitem');
        projectCard.setAttribute('tabindex', '0');
        projectCard.setAttribute('aria-label', `Featured project: ${project.title} in ${project.location}`);
        
        const summary = this.getSafeTranslation(project.summary_i18n_key, 'Project description not available');
        
        projectCard.innerHTML = `
          <div class="card-header">
            <h3 class="card-title">${this.escapeHtml(project.title)}</h3>
            <p class="card-description">${this.escapeHtml(summary)}</p>
            <div style="margin-top: var(--space-lg); display: flex; justify-content: space-between; align-items: center; font-size: var(--font-size-sm); color: var(--text-muted);">
              <span aria-label="Location: ${project.location}">${this.escapeHtml(project.location)}</span>
              <span aria-label="Year: ${project.year}">${this.escapeHtml(project.year)}</span>
            </div>
          </div>
        `;
        
        // Make the card clickable to go to projects page
        projectCard.style.cursor = 'pointer';
        
        const handleClick = () => {
          try {
            window.location.href = `projects.html#${project.slug}`;
          } catch (navError) {
            console.error('Navigation failed:', navError);
            // Fallback to basic navigation
            window.location.href = 'projects.html';
          }
        };
        
        projectCard.addEventListener('click', handleClick);
        projectCard.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        });
        
        projectsGrid.appendChild(projectCard);
      });

      console.log(`Rendered ${featuredProjects.length} featured project cards`);
    } catch (error) {
      console.error('Failed to load featured projects:', error);
      this.showFallbackProjects(projectsGrid);
    }
  }

  initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    // If GSAP is available, use it for smooth counter animation
    if (window.Motion && window.Motion.gsapLoaded) {
      this.initCountersWithGSAP(counters);
    } else {
      // Fallback to intersection observer
      this.initCountersWithIntersectionObserver(counters);
    }
  }

  initCountersWithGSAP(counters) {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
      const duration = 2;
      
      // Set initial value
      counter.textContent = '0';
      
      // Create GSAP animation that will be triggered by ScrollTrigger
      const animation = window.gsap.to(counter, {
        duration: duration,
        ease: "power2.out",
        onUpdate: function() {
          const current = Math.round(this.progress() * target);
          counter.textContent = current.toLocaleString();
        },
        onComplete: function() {
          counter.textContent = target.toLocaleString();
        }
      });
      
      // Pause the animation initially
      animation.pause();
      
      // Use ScrollTrigger to start the animation when the element comes into view
      if (window.ScrollTrigger) {
        window.ScrollTrigger.create({
          trigger: counter,
          start: "top 80%",
          onEnter: () => animation.play(),
          once: true
        });
      }
    });
  }

  initCountersWithIntersectionObserver(counters) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
          
          this.animateCounterFallback(counter, target);
          counterObserver.unobserve(counter);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -20% 0px'
    });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  animateCounterFallback(counter, target) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeOut);
      
      counter.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  setupParallaxEffects() {
    // Only setup parallax if GSAP is available and user doesn't prefer reduced motion
    if (!window.Motion || !window.Motion.gsapLoaded) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parallaxElements = document.querySelectorAll('.parallax-y');
    
    parallaxElements.forEach(element => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.create({
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: self => {
            const y = self.progress * 50; // Adjust parallax intensity
            window.gsap.set(element, { y: y });
          }
        });
      }
    });

    console.log(`Setup parallax effects for ${parallaxElements.length} elements`);
  }

  handleLanguageChange(language) {
    console.log(`Handling language change to: ${language}`);
    
    // Re-render dynamic content that depends on translations
    const currentPage = this.getCurrentPage();
    if (currentPage === 'home') {
      this.renderServices();
      this.renderFeaturedProjects();
    } else if (currentPage === 'about') {
      this.renderApproachTimeline();
      this.renderCapabilities();
      // Skip team rendering - about.html has its own comprehensive team system
      // this.renderLeadershipTeam();
      this.renderCertifications();
    } else if (currentPage === 'projects') {
      this.renderProjectTabs();
    }
  }

  // About page specific methods
  renderApproachTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const steps = i18n.t('about.approach.steps', []);
    if (!Array.isArray(steps) || steps.length === 0) {
      console.warn('No approach steps data found');
      return;
    }

    timeline.innerHTML = '';
    
    steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'timeline-step reveal-up';
      stepElement.setAttribute('data-step', index + 1);
      stepElement.setAttribute('role', 'listitem');
      stepElement.setAttribute('aria-label', `Step ${index + 1}: ${step.title}`);
      stepElement.style.setProperty('--delay', `${index * 0.2}s`);
      
      stepElement.innerHTML = `
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      `;
      
      timeline.appendChild(stepElement);
    });

    console.log(`Rendered ${steps.length} timeline steps`);
  }

  renderCapabilities() {
    const capabilitiesGrid = document.querySelector('.capabilities-grid');
    if (!capabilitiesGrid) return;

    const capabilities = i18n.t('about.capabilities.items', []);
    if (!Array.isArray(capabilities) || capabilities.length === 0) {
      console.warn('No capabilities data found');
      return;
    }

    capabilitiesGrid.innerHTML = '';
    
    capabilities.forEach((capability, index) => {
      const capabilityElement = document.createElement('div');
      capabilityElement.className = 'capability-item reveal-up';
      capabilityElement.setAttribute('role', 'listitem');
      capabilityElement.style.setProperty('--delay', `${index * 0.1}s`);
      
      capabilityElement.innerHTML = `
        <span>${capability}</span>
      `;
      
      capabilitiesGrid.appendChild(capabilityElement);
    });

    console.log(`Rendered ${capabilities.length} capabilities`);
  }

  renderLeadershipTeam() {
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    // Get team data from i18n - all 3 team members
    const founderData = {
      name: i18n.t('team.founder.name', 'Mr. Bounlieng Thephachanh'),
      title: i18n.t('team.founder.title', 'Founder & Managing Director'),
      bio: i18n.t('team.founder.bio', 'With over 30 years of experience in public works engineering...'),
      photo: '/assets/img/team/founder.jpg'
    };

    const vicePresidentData = {
      name: i18n.t('team.vice_president.name', 'Ms. Sengdavanh Thepphachanh'),
      title: i18n.t('team.vice_president.title', 'Vice President'),
      bio: i18n.t('team.vice_president.bio', 'Dr. Sengdavanh Thepphachanh brings advanced expertise in hydraulic and environmental engineering...'),
      photo: '/assets/img/team/vice%20president.jpg'
    };

    const technologyAdvisorData = {
      name: i18n.t('team.technology_advisor.name', 'Mr. Matthew Thaokhamlue'),
      title: i18n.t('team.technology_advisor.title', 'Technology Advisor'),
      bio: i18n.t('team.technology_advisor.bio', 'Technical Product Manager with 5+ years in B2B SaaS, focusing on AI features...'),
      photo: '/assets/img/team/technology%20advisor.jpg'
    };

    const teamMembers = [founderData, vicePresidentData, technologyAdvisorData];

    teamGrid.innerHTML = '';
    
    teamMembers.forEach((member, index) => {
      const memberElement = document.createElement('div');
      memberElement.className = 'team-member team-card reveal-up';
      memberElement.setAttribute('role', 'listitem');
      memberElement.setAttribute('tabindex', '0');
      memberElement.setAttribute('aria-label', `Team member: ${member.name}, ${member.title}`);
      memberElement.style.setProperty('--delay', `${index * 0.2}s`);
      
      // Get initials for placeholder
      const initials = member.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);
      const photoContent = member.photo
        ? `<img src="${member.photo}" alt="Photo of ${member.name}" loading="lazy" width="120" height="120" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="team-avatar" style="display: none;"><span class="team-initials">${initials}</span></div>`
        : `<div class="team-avatar"><span class="team-initials">${initials}</span></div>`;
      
      memberElement.innerHTML = `
        ${photoContent}
        <div class="team-info">
          <h3 class="team-name">${member.name}</h3>
          <p class="team-title">${member.title}</p>
          <p class="team-bio">${member.bio.substring(0, 120)}...</p>
        </div>
      `;
      
      // Add click handler for modal
      memberElement.addEventListener('click', () => {
        if (window.showTeamModal) {
          // Determine member key based on name
          let memberKey = 'founder';
          if (member.name.includes('Sengdavanh')) {
            memberKey = 'vice_president';
          } else if (member.name.includes('Matthew')) {
            memberKey = 'technology_advisor';
          }

          const fullMemberData = {
            key: memberKey,
            name: member.name,
            title: member.title,
            bio: i18n.t(`team.${memberKey}.bio`, member.bio),
            education: i18n.t(`team.${memberKey}.education`, ''),
            experience: i18n.t(`team.${memberKey}.experience`, []),
            description: i18n.t(`team.${memberKey}.description`, ''),
            image: member.photo
          };
          window.showTeamModal(fullMemberData);
        }
      });

      memberElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          memberElement.click();
        }
      });
      
      teamGrid.appendChild(memberElement);
    });

    console.log(`Rendered ${teamMembers.length} team members from i18n data`);
  }

  renderCertifications() {
    const certificationsList = document.querySelector('.certifications-list');
    if (!certificationsList) return;

    const certifications = i18n.t('about.certifications.items', []);
    if (!Array.isArray(certifications) || certifications.length === 0) {
      console.warn('No certifications data found');
      return;
    }

    certificationsList.innerHTML = '';
    
    certifications.forEach((certification, index) => {
      const certificationElement = document.createElement('div');
      certificationElement.className = 'certification-item reveal-up';
      certificationElement.setAttribute('role', 'listitem');
      certificationElement.style.setProperty('--delay', `${index * 0.1}s`);
      
      certificationElement.innerHTML = `
        <span>${certification}</span>
      `;
      
      certificationsList.appendChild(certificationElement);
    });

    console.log(`Rendered ${certifications.length} certifications`);
  }

  setupAnchorNavigation() {
    const anchorNav = document.getElementById('anchor-nav');
    const anchorLinks = document.querySelectorAll('.anchor-nav-link');
    
    if (!anchorNav || anchorLinks.length === 0) return;

    // Handle anchor link clicks
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Simple scroll to element using scrollIntoView with error handling
          try {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          } catch (error) {
            // Fallback to basic scrolling if scrollIntoView fails
            console.warn('scrollIntoView failed, using fallback:', error);
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo(0, offsetTop);
          }
          
          // Update active state
          this.updateAnchorNavActive(link);
        }
      });
    });

    // Handle scroll to update active anchor link
    let ticking = false;
    const updateActiveOnScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateAnchorNavOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateActiveOnScroll);
    
    // Initial active state
    this.updateAnchorNavOnScroll();

    console.log('Setup anchor navigation with', anchorLinks.length, 'links');
  }

  updateAnchorNavActive(activeLink) {
    const anchorLinks = document.querySelectorAll('.anchor-nav-link');
    anchorLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  updateAnchorNavOnScroll() {
    try {
      const anchorLinks = document.querySelectorAll('.anchor-nav-link');
      const sections = Array.from(anchorLinks).map(link => {
        const targetId = link.getAttribute('href').substring(1);
        return {
          link,
          element: document.getElementById(targetId)
        };
      }).filter(item => item.element);

      if (sections.length === 0) return;

      const scrollPosition = window.scrollY;
      const header = document.querySelector('header');
      const anchorNav = document.getElementById('anchor-nav');
      
      if (!header || !anchorNav) return;
      
      const headerHeight = header.offsetHeight || 0;
      const anchorNavHeight = anchorNav.offsetHeight || 0;
      const offset = headerHeight + anchorNavHeight + 100; // Extra offset for better UX

      let activeSection = null;

      // Find the section that's currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section.element) continue;
        
        const sectionTop = section.element.offsetTop - offset;
        
        if (scrollPosition >= sectionTop) {
          activeSection = section;
          break;
        }
      }

      // Update active state
      if (activeSection) {
        this.updateAnchorNavActive(activeSection.link);
      }
    } catch (error) {
      console.warn('Error in updateAnchorNavOnScroll:', error);
    }
  }

  // Projects page specific methods
  async loadProjects() {
    try {
      console.log('Starting to load projects...');
      this.showProjectsLoading();
      
      const response = await fetch('/assets/data/projects.json');
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status}`);
      }
      
      const data = await response.json();
      this.projects = data.projects || [];
      
      console.log(`Loaded ${this.projects.length} projects`);
      
      // Render projects immediately
      this.renderProjectTabs();
      this.hideProjectsLoading();
      
      // Handle initial hash if present (with timeout to prevent blocking)
      if (this.initialHash) {
        const project = this.projects.find(p => p.slug === this.initialHash);
        if (project) {
          setTimeout(() => {
            try {
              this.showProjectDetail(project);
            } catch (error) {
              console.warn('Error showing project detail:', error);
            }
          }, 500);
        }
      }
      
      console.log(`Successfully loaded and rendered ${this.projects.length} projects`);
    } catch (error) {
      console.error('Failed to load projects:', error);
      this.projects = []; // Set empty array as fallback
      
      try {
        this.showProjectsError('Failed to load projects. Please try again.');
        this.hideProjectsLoading();
      } catch (renderError) {
        console.error('Error showing projects error:', renderError);
      }
    }
  }

  renderProjectTabs() {
    try {
      const ongoingGrid = document.getElementById('ongoing-projects');
      const completedGrid = document.getElementById('completed-projects');
      
      console.log('renderProjectTabs called', { ongoingGrid: !!ongoingGrid, completedGrid: !!completedGrid, projectsCount: this.projects?.length });
      
      if (!ongoingGrid || !completedGrid) {
        console.error('Missing grid elements:', { ongoingGrid: !!ongoingGrid, completedGrid: !!completedGrid });
        return;
      }

      if (!this.projects || !Array.isArray(this.projects)) {
        console.error('Projects not loaded or invalid:', this.projects);
        return;
      }

      // Filter projects by status
      const ongoingProjects = this.projects.filter(project => project && project.status === 'ongoing');
      const completedProjects = this.projects.filter(project => project && project.status === 'completed');

      console.log('Filtered projects:', { ongoingCount: ongoingProjects.length, completedCount: completedProjects.length });

      // Render ongoing projects
      this.renderProjectGrid(ongoingGrid, ongoingProjects);
      
      // Render completed projects
      this.renderProjectGrid(completedGrid, completedProjects);

      console.log(`Successfully rendered ${ongoingProjects.length} ongoing and ${completedProjects.length} completed projects`);
    } catch (error) {
      console.error('Error in renderProjectTabs:', error);
    }
  }

  renderProjectGrid(container, projects) {
    console.log('renderProjectGrid called', { container: container?.id, projectsCount: projects?.length });
    
    if (!container || !projects) {
      console.error('Missing container or projects:', { container, projects });
      return;
    }

    container.innerHTML = '';

    if (projects.length === 0) {
      console.log('No projects found, showing empty state');
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-state';
      emptyMessage.innerHTML = `
        <p>${i18n.t('projects.empty', 'No projects found in this category.')}</p>
      `;
      container.appendChild(emptyMessage);
      return;
    }

    console.log(`Rendering ${projects.length} project cards`);
    projects.forEach((project, index) => {
      const projectCard = this.createProjectCard(project, index);
      container.appendChild(projectCard);
    });
    
    console.log(`Successfully rendered ${projects.length} project cards in ${container.id}`);
  }

  createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card reveal-up';
    card.style.setProperty('--delay', `${index * 0.1}s`);
    card.setAttribute('data-project-slug', project.slug);

    const summary = i18n.t(project.summary_i18n_key, 'Project description not available');
    
    card.innerHTML = `
      <div class="project-card-image">
        <img 
          src="${project.cover}" 
          alt="Project image for ${project.title} - ${project.scope} in ${project.location}"
          loading="lazy"
          width="400"
          height="250"
          style="aspect-ratio: 16/10; object-fit: cover;"
          onerror="this.style.display='none'"
        >
        <div class="project-card-overlay">
          <button class="project-view-btn" data-i18n="projects.details.view_details" aria-label="View details for ${project.title}">View Details</button>
        </div>
      </div>
      <div class="project-card-content">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-summary">${summary}</p>
        <div class="project-card-meta">
          <span class="project-location" aria-label="Location: ${project.location}">${project.location}</span>
          <span class="project-year" aria-label="Year: ${project.year}">${project.year}</span>
        </div>
        <div class="project-card-scope" aria-label="Scope: ${project.scope}">${project.scope}</div>
      </div>
    `;

    // Add click handler for project details
    card.addEventListener('click', (e) => {
      e.preventDefault();
      this.showProjectDetail(project);
    });

    return card;
  }

  setupProjectTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0 || tabContents.length === 0) return;

    const switchTab = (targetButton) => {
      const targetTab = targetButton.getAttribute('data-tab');
      
      // Update active button and ARIA states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      
      targetButton.classList.add('active');
      targetButton.setAttribute('aria-selected', 'true');
      targetButton.setAttribute('tabindex', '0');
      
      // Update active content and ARIA states
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
        if (content.id === `${targetTab}-projects`) {
          content.classList.add('active');
          content.setAttribute('aria-hidden', 'false');
        }
      });

      console.log(`Switched to ${targetTab} projects tab`);
    };

    tabButtons.forEach((button, index) => {
      // Set initial ARIA states
      if (index === 0) {
        button.setAttribute('tabindex', '0');
      } else {
        button.setAttribute('tabindex', '-1');
      }
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(button);
      });

      // Add keyboard navigation
      button.addEventListener('keydown', (e) => {
        let targetIndex = Array.from(tabButtons).indexOf(button);
        
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            targetIndex = targetIndex > 0 ? targetIndex - 1 : tabButtons.length - 1;
            tabButtons[targetIndex].focus();
            switchTab(tabButtons[targetIndex]);
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            targetIndex = targetIndex < tabButtons.length - 1 ? targetIndex + 1 : 0;
            tabButtons[targetIndex].focus();
            switchTab(tabButtons[targetIndex]);
            break;
          case 'Home':
            e.preventDefault();
            tabButtons[0].focus();
            switchTab(tabButtons[0]);
            break;
          case 'End':
            e.preventDefault();
            tabButtons[tabButtons.length - 1].focus();
            switchTab(tabButtons[tabButtons.length - 1]);
            break;
        }
      });
    });

    console.log('Setup project tabs with', tabButtons.length, 'buttons');
  }

  showProjectDetail(project) {
    const detailSection = document.getElementById('project-detail');
    if (!detailSection) return;

    // Update URL hash for deep linking
    window.history.pushState(null, null, `#${project.slug}`);

    const summary = i18n.t(project.summary_i18n_key, 'Project description not available');
    
    detailSection.innerHTML = `
      <div class="project-detail-header">
        <button class="project-detail-close" aria-label="${i18n.t('projects.details.close_details', 'Close Details')}" title="${i18n.t('projects.details.close_details', 'Close Details')}">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="project-detail-hero parallax-y">
        <img 
          src="${project.cover}" 
          alt="${project.title}"
          loading="eager"
          style="object-fit: cover;"
          onerror="this.style.display='none'"
        >
        <div class="project-detail-hero-content">
          <h1 id="project-detail-title" class="project-detail-title reveal-up">${project.title}</h1>
          <p class="project-detail-location reveal-up">${project.location}</p>
        </div>
      </div>
      <div class="project-detail-content">
        <div class="container">
          <div class="project-detail-info reveal-up">
            <div class="project-info-grid">
              <div class="project-info-item">
                <h3 data-i18n="projects.details.scope">${i18n.t('projects.details.scope', 'Project Scope')}</h3>
                <p>${project.scope}</p>
              </div>
              <div class="project-info-item">
                <h3 data-i18n="projects.details.location">${i18n.t('projects.details.location', 'Location')}</h3>
                <p>${project.location}</p>
              </div>
              <div class="project-info-item">
                <h3 data-i18n="projects.details.year">${i18n.t('projects.details.year', 'Year')}</h3>
                <p>${project.year}</p>
              </div>
              <div class="project-info-item">
                <h3 data-i18n="projects.details.status">${i18n.t('projects.details.status', 'Status')}</h3>
                <p class="project-status project-status-${project.status}">${project.status}</p>
              </div>
            </div>
          </div>
          <div class="project-detail-summary reveal-up">
            <h2>Project Overview</h2>
            <p>${summary}</p>
          </div>
          ${project.gallery && project.gallery.length > 0 ? this.renderProjectGallery(project.gallery) : ''}
        </div>
      </div>
    `;

    // Show the detail section
    detailSection.classList.remove('hidden');
    detailSection.setAttribute('role', 'dialog');
    detailSection.setAttribute('aria-modal', 'true');
    detailSection.setAttribute('aria-labelledby', 'project-detail-title');
    
    // Scroll to detail section with error handling
    try {
      detailSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.warn('scrollIntoView failed, using fallback:', error);
      const offsetTop = detailSection.offsetTop - 80;
      window.scrollTo(0, offsetTop);
    }
    
    // Focus management for accessibility
    setTimeout(() => {
      const closeBtn = detailSection.querySelector('.project-detail-close');
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 300);

    // Setup close button
    const closeBtn = detailSection.querySelector('.project-detail-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideProjectDetail();
      });
    }

    // Setup keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.hideProjectDetail();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Setup parallax and animations if GSAP is available
    if (window.Motion && window.Motion.gsapLoaded) {
      this.setupProjectDetailAnimations(detailSection);
    }

    // Inject project-specific structured data and update meta tags
    if (window.seoManager) {
      window.seoManager.injectProjectStructuredData(project);
    }

    console.log(`Showing details for project: ${project.title}`);
  }

  renderProjectGallery(gallery) {
    if (!gallery || gallery.length === 0) return '';

    const galleryItems = gallery.map((image, index) => `
      <div class="project-gallery-item reveal-up" style="--delay: ${index * 0.1}s">
        <img 
          src="${image}" 
          alt="Project gallery image ${index + 1}"
          loading="lazy"
          style="aspect-ratio: 4/3; object-fit: cover;"
          onerror="this.style.display='none'"
        >
      </div>
    `).join('');

    return `
      <div class="project-detail-gallery reveal-up">
        <h2>Project Gallery</h2>
        <div class="project-gallery-grid">
          ${galleryItems}
        </div>
      </div>
    `;
  }

  hideProjectDetail() {
    const detailSection = document.getElementById('project-detail');
    if (!detailSection) return;

    detailSection.classList.add('hidden');
    detailSection.removeAttribute('role');
    detailSection.removeAttribute('aria-modal');
    detailSection.removeAttribute('aria-labelledby');
    
    // Clear URL hash
    window.history.pushState(null, null, window.location.pathname);

    // Remove project-specific structured data and reset meta tags
    if (window.seoManager) {
      window.seoManager.removeProjectStructuredData();
    }

    console.log('Hidden project detail');
  }

  setupProjectDeepLinking() {
    // Store initial hash for later processing
    this.initialHash = window.location.hash.substring(1);
    
    // Handle initial hash on page load (will be processed after projects load)
    if (this.initialHash && this.projects) {
      const project = this.projects.find(p => p.slug === this.initialHash);
      if (project) {
        // Delay showing detail to ensure projects are rendered first
        setTimeout(() => {
          this.showProjectDetail(project);
        }, 500);
      }
    }

    // Handle hash changes (back/forward navigation)
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.substring(1);
      if (!newHash) {
        this.hideProjectDetail();
      } else if (this.projects) {
        const project = this.projects.find(p => p.slug === newHash);
        if (project) {
          this.showProjectDetail(project);
        }
      }
    });

    console.log('Setup project deep linking');
  }

  setupProjectDetailAnimations(detailSection) {
    if (!window.Motion || !window.Motion.gsapLoaded) return;

    // Parallax effect for hero image
    const heroImage = detailSection.querySelector('.project-detail-hero img');
    if (heroImage && window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: heroImage,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: self => {
          const y = self.progress * 50;
          window.gsap.set(heroImage, { y: y });
        }
      });
    }

    // Reveal animations for content sections
    const revealElements = detailSection.querySelectorAll('.reveal-up');
    revealElements.forEach((element, index) => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          onEnter: () => {
            window.gsap.fromTo(element, 
              { y: 24, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.6, 
                ease: "power2.out",
                delay: index * 0.1
              }
            );
          },
          once: true
        });
      }
    });

    console.log('Setup project detail animations');
  }

  showProjectsLoading() {
    const ongoingGrid = document.getElementById('ongoing-projects');
    const completedGrid = document.getElementById('completed-projects');
    
    if (ongoingGrid) {
      ongoingGrid.innerHTML = '<div class="projects-loading">Loading projects...</div>';
    }
    if (completedGrid) {
      completedGrid.innerHTML = '<div class="projects-loading">Loading projects...</div>';
    }
  }

  hideProjectsLoading() {
    // Loading will be replaced by actual content in renderProjectTabs
  }

  showProjectsError(message) {
    const ongoingGrid = document.getElementById('ongoing-projects');
    const completedGrid = document.getElementById('completed-projects');
    
    const errorHtml = `<div class="projects-error">${message}</div>`;
    
    if (ongoingGrid) {
      ongoingGrid.innerHTML = errorHtml;
    }
    if (completedGrid) {
      completedGrid.innerHTML = errorHtml;
    }
  }

  /**
   * Load projects data with retry logic
   */
  async loadProjectsWithRetry() {
    try {
      const response = await fetch('assets/data/projects.json');
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load projects data:', error);
      // Return fallback data structure
      return {
        projects: []
      };
    }
  }

  /**
   * Get translation with fallback handling
   */
  getSafeTranslation(key, fallback = '[MISSING]') {
    try {
      if (typeof i18n !== 'undefined' && i18n.t) {
        return i18n.t(key, fallback);
      }
      return fallback;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return fallback;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Show fallback projects when data loading fails
   */
  showFallbackProjects(container) {
    const fallbackProjects = [
      {
        title: 'Commercial Development',
        description: 'Professional construction consulting services',
        location: 'Vientiane',
        year: '2024'
      },
      {
        title: 'Infrastructure Project',
        description: 'Expert guidance for infrastructure development',
        location: 'Luang Prabang',
        year: '2023'
      }
    ];

    container.innerHTML = '';
    
    fallbackProjects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'card';
      projectCard.setAttribute('role', 'listitem');
      
      projectCard.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-description">${project.description}</p>
          <div style="margin-top: var(--space-lg); display: flex; justify-content: space-between; align-items: center; font-size: var(--font-size-sm); color: var(--text-muted);">
            <span>${project.location}</span>
            <span>${project.year}</span>
          </div>
        </div>
      `;
      
      container.appendChild(projectCard);
    });

    console.log('Rendered fallback projects');
  }

  /**
   * Enable i18n fallbacks
   */
  enableI18nFallbacks() {
    // Create a minimal i18n fallback
    if (typeof window.i18n === 'undefined') {
      window.i18n = {
        t: (key, fallback = '[MISSING]') => {
          // Convert key to readable text
          const parts = key.split('.');
          const lastPart = parts[parts.length - 1];
          return lastPart
            .replace(/[_-]/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, l => l.toUpperCase());
        },
        getCurrentLang: () => 'en'
      };
    }

    // Apply fallback translations to existing elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (!element.textContent.trim()) {
        element.textContent = window.i18n.t(key);
      }
    });
  }

  /**
   * Enable all fallback systems
   */
  enableAllFallbacks() {
    document.body.classList.add('fallback-mode', 'no-gsap', 'no-animations');
    this.enableI18nFallbacks();
    
    // Disable complex features
    this.intersectionObserver = null;
  }

  /**
   * Show basic content when everything fails
   */
  showBasicContent() {
    console.log('Showing basic content fallback');
    
    // Ensure basic navigation works
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.style.display = 'block';
    }

    // Show basic text content
    const main = document.querySelector('main');
    if (main && !main.textContent.trim()) {
      main.innerHTML = `
        <section class="section">
          <div class="container">
            <h1>Construction Consulting Services</h1>
            <p>Professional construction consulting services in Laos.</p>
            <p>Please refresh the page or contact us directly if you continue to experience issues.</p>
          </div>
        </section>
      `;
    }
  }

  // Utility methods
  showLoading(message = null) {
    const loadingMessage = message || this.getSafeTranslation('loading.default', 'Loading...');
    console.log(loadingMessage);
    // Loading UI will be implemented in later tasks
  }

  hideLoading() {
    console.log('Loading complete');
    // Loading UI will be implemented in later tasks
  }

  showError(message) {
    const errorMessage = message || this.getSafeTranslation('loading.error', 'An error occurred. Please try again.');
    console.error(errorMessage);
    
    // Create or update error container
    let errorContainer = document.querySelector('.error-message');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'error-message';
      errorContainer.style.cssText = `
        background: #ff6b6b;
        color: white;
        padding: 16px;
        margin: 16px 0;
        border-radius: 4px;
        text-align: center;
      `;
      
      const main = document.querySelector('main');
      if (main) {
        main.insertBefore(errorContainer, main.firstChild);
      }
    }
    
    errorContainer.textContent = errorMessage;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorContainer.parentNode) {
        errorContainer.remove();
      }
    }, 5000);
  }
}

// Initialize app when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
} else {
  app.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

// Make app available globally for debugging
window.app = app;