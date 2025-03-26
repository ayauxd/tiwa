// Simplified script with minimal animations
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle with accessibility improvements
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.getElementById('main-navigation');
    
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !mobileNavToggle.contains(e.target)) {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNavToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }
    
    // Chat functionality with suggestion buttons
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const startChatBtn = document.getElementById('start-chat');
    const suggestionBtns = document.querySelectorAll('.chat-suggestion-btn');
    
    // Responses based on user selection
    const chatResponses = {
        'automation': {
            message: "Automating repetitive tasks is a great way to save time. What specific tasks are taking up most of your time right now?",
            suggestions: ["Email management", "Data entry", "Calendar scheduling", "Document processing"]
        },
        'communication': {
            message: "Improving client communication can significantly enhance satisfaction. What aspects of client communication do you want to improve?",
            suggestions: ["Response time", "Follow-ups", "Information sharing", "Client onboarding"]
        },
        'project': {
            message: "Streamlining project management helps teams stay organized. Which area of project management needs the most improvement?",
            suggestions: ["Task tracking", "Team collaboration", "Deadline management", "Resource allocation"]
        },
        'custom': {
            message: "I'd be happy to discuss your specific needs. Please describe what you're looking to achieve with AI workflow automation.",
            suggestions: []
        }
    };
    
    // Function to add message to chat
    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = isUser ? 'chat-bubble user-bubble' : 'chat-bubble ai-bubble';
        messageElement.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to add suggestion buttons after AI response
    function addSuggestions(suggestions) {
        if (suggestions && suggestions.length > 0) {
            const suggestionsElement = document.createElement('div');
            suggestionsElement.className = 'chat-quick-suggestions';
            
            suggestions.forEach(suggestion => {
                const suggestionBtn = document.createElement('button');
                suggestionBtn.className = 'chat-quick-suggestion-btn';
                suggestionBtn.textContent = suggestion;
                suggestionBtn.addEventListener('click', function() {
                    addMessage(suggestion, true);
                    // Remove suggestion buttons after selection
                    chatMessages.removeChild(suggestionsElement);
                    
                    // Add AI response after user selection
                    setTimeout(() => {
                        addMessage("Thanks for sharing that. I recommend scheduling a consultation with our specialist who can provide personalized solutions for your specific needs.");
                    }, 500);
                });
                
                suggestionsElement.appendChild(suggestionBtn);
            });
            
            chatMessages.appendChild(suggestionsElement);
        }
    }
    
    // Handle suggestion button clicks
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const option = this.dataset.option;
            const userMessage = this.textContent;
            
            // Add user message
            addMessage(userMessage, true);
            
            // Add AI response based on option
            setTimeout(() => {
                if (chatResponses[option]) {
                    addMessage(chatResponses[option].message);
                    
                    // Add suggestion buttons if available
                    setTimeout(() => {
                        addSuggestions(chatResponses[option].suggestions);
                    }, 300);
                }
            }, 500);
            
            // Hide the main suggestion buttons after selection
            document.querySelector('.chat-suggestions').style.display = 'none';
        });
    });
    
    // Handle send button click
    if (startChatBtn && chatInput) {
        startChatBtn.addEventListener('click', function() {
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, true);
                chatInput.value = '';
                
                // Hide suggestion buttons if still visible
                const suggestionContainer = document.querySelector('.chat-suggestions');
                if (suggestionContainer && suggestionContainer.style.display !== 'none') {
                    suggestionContainer.style.display = 'none';
                }
                
                // Generic AI response for text input
                setTimeout(() => {
                    addMessage("Thank you for sharing that. I recommend scheduling a consultation with our AI integration specialist who can provide personalized solutions for your specific needs.");
                }, 500);
            }
        });
        
        // Allow pressing Enter to send message
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                startChatBtn.click();
            }
        });
    }
    
    // Enhanced smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Don't scroll for empty hash or href="#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state in navigation
                updateActiveNavLink(targetId);
                
                // Update URL hash without triggering scroll
                history.pushState(null, null, targetId);
                
                // If clicking the consultation CTA button, focus on the chat input after scrolling
                if (this.id === 'start-consultation') {
                    setTimeout(() => {
                        const chatInput = document.querySelector('.chat-input');
                        if (chatInput) chatInput.focus();
                    }, 1000); // Wait for the scroll to complete
                }
            }
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink(targetId) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        // Add active class to the link pointing to current section
        const activeLink = document.querySelector(`.main-nav a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }
    
    // Set active nav link on page load based on URL hash
    function setInitialActiveNavLink() {
        const hash = window.location.hash;
        if (hash) {
            updateActiveNavLink(hash);
        } else {
            // Default to first nav link
            const firstNavLink = document.querySelector('.main-nav a');
            if (firstNavLink) {
                firstNavLink.classList.add('active');
                firstNavLink.setAttribute('aria-current', 'page');
            }
        }
    }
    
    // Call on page load
    setInitialActiveNavLink();
    
    // Update active nav link on scroll
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(handleScroll, 100);
        }
    });
    
    function handleScroll() {
        // Find which section is currently visible
        const sections = document.querySelectorAll('section[id]');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop - 150 && 
                window.pageYOffset < sectionTop + sectionHeight - 150) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            updateActiveNavLink(currentSectionId);
        }
        
        isScrolling = false;
    }
    
    // Check for dark mode preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
        // Toggle dark mode
        body.classList.toggle('dark-mode');
        
            // Save preference to localStorage
        if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
        } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    }

    // Solution card selection
    const solutionCards = document.querySelectorAll('.solutions .card');
    
    solutionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selection from all cards
            solutionCards.forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.dot').classList.remove('selected');
            });
            
            // Add selection to clicked card
            this.classList.add('selected');
            this.querySelector('.dot').classList.add('selected');
        });
    });

    // Approach tabs functionality
    const approachItems = document.querySelectorAll('.approach-item');
    const approachDescription = document.querySelector('.approach-description');
    const approachImage = document.querySelector('.approach-image img');
    
    // Define content for each approach with enhanced descriptions and list format
    const approachContent = {
        'Workflow Audit': {
            description: `
                <p>We start by understanding what you do and where the friction is. Together, we'll identify your highest-leverage tasks for automation.</p>
                <p>Based on your needs, we map out a phased plan using the right mix of tools—intuitive, powerful, and tailored to your level of comfort with tech.</p>
                
                <h4 class="use-cases-title">Use Cases We've Helped With:</h4>
                <ul class="use-cases-list">
                    <li><i class="ph ph-check-circle"></i> Automated scheduling and reminders for busy entrepreneurs</li>
                    <li><i class="ph ph-check-circle"></i> Smart customer service bots for WhatsApp or social media queries</li>
                    <li><i class="ph ph-check-circle"></i> Intelligent document generation for contracts, forms, or reports</li>
                </ul>
            `,
            image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=500&auto=format&fit=crop&q=80&crop=entropy'
        },
        'Custom AI Blueprint': {
            description: `
                <p>Based on our workflow audit findings, we design a customized AI strategy that's tailored to your specific needs:</p>
                <ul class="use-cases-list">
                    <li><i class="ph ph-check-circle"></i> Prioritized AI tools selection based on your specific workflows</li>
                    <li><i class="ph ph-check-circle"></i> Integration plan that works with your existing tools and platforms</li>
                    <li><i class="ph ph-check-circle"></i> Clear metrics to measure success and ROI of your AI implementations</li>
                    <li><i class="ph ph-check-circle"></i> AI-assisted social media systems that plan, post, and optimize content</li>
                </ul>
                <p>Our blueprint approach ensures that every AI solution we recommend fits naturally into your existing workflow and delivers immediate value.</p>
            `,
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80&crop=entropy'
        },
        'Implementation & Training': {
            description: `
                <p>We don't just recommend tools—we help you implement them and train your team for maximum adoption and impact:</p>
                <ul class="use-cases-list">
                    <li><i class="ph ph-check-circle"></i> Hands-on setup and configuration of all recommended AI tools</li>
                    <li><i class="ph ph-check-circle"></i> Clear, practical training tailored to different learning styles</li>
                    <li><i class="ph ph-check-circle"></i> AI-enhanced sales funnels that never miss a lead</li>
                    <li><i class="ph ph-check-circle"></i> Custom prompt libraries and templates for your specific use cases</li>
                    <li><i class="ph ph-check-circle"></i> AI dashboards for tracking productivity and client activity</li>
                </ul>
                <p>Our implementation process focuses on getting you comfortable and confident with the new tools, ensuring you get maximum value from day one.</p>
            `,
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&auto=format&fit=crop&q=80&crop=entropy'
        }
    };
    
    approachItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selection from all items
            approachItems.forEach(i => {
                i.classList.remove('selected');
                i.querySelector('.dot').classList.remove('selected');
            });
            
            // Add selection to clicked item
            this.classList.add('selected');
            this.querySelector('.dot').classList.add('selected');
            
            // Update content based on selected approach
            const approachName = this.querySelector('h3').textContent;
            approachDescription.innerHTML = approachContent[approachName].description;
            approachImage.src = approachContent[approachName].image;
            approachImage.alt = approachName + ' Process';
        });
    });

    // Add hover effect to single testimonial
    const testimonialCard = document.querySelector('.testimonial-card');
    if (testimonialCard) {
        testimonialCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05), 0 6px 10px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.1)';
        });
        
        testimonialCard.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }

    // Create AI consultation form
    function createConsultationForm() {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'tiwa-modal';
        modal.style.display = 'block'; // Show immediately
        
        const modalContent = document.createElement('div');
        modalContent.className = 'tiwa-modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'tiwa-close';
        closeBtn.innerHTML = '&times;';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'tiwa-modal-header';
        modalHeader.innerHTML = '<h2>AI Adoption Consultation</h2>';
        
        const modalBody = document.createElement('div');
        modalBody.className = 'tiwa-modal-body';
        
        // Create consultation form container
        const formContainer = document.createElement('div');
        formContainer.className = 'consultation-form-container';
        
        const formIntro = document.createElement('div');
        formIntro.className = 'consultation-form-intro';
        formIntro.innerHTML = `
            <p>Our AI Adoption Specialist is ready to help you find the right AI solutions for your needs.</p>
            <p>Please fill out the form below to get started with your free consultation.</p>
        `;
        
        const form = document.createElement('form');
        form.className = 'consultation-form';
        form.innerHTML = `
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email address" required>
            </div>
            <div class="form-group">
                <label for="businessType">Business Type</label>
                <select id="businessType" name="businessType" required>
                    <option value="" disabled selected>Select your business type</option>
                    <option value="solo">Solo Professional/Freelancer</option>
                    <option value="small">Small Business (1-10 employees)</option>
                    <option value="medium">Medium Business (11-50 employees)</option>
                    <option value="large">Large Business (50+ employees)</option>
                    <option value="personal">Personal Use</option>
                </select>
            </div>
            <div class="form-group">
                <label for="aiChallenge">What's your biggest challenge that AI could help with?</label>
                <select id="aiChallenge" name="aiChallenge" required>
                    <option value="" disabled selected>Select your biggest challenge</option>
                    <option value="automation">Automating repetitive tasks</option>
                    <option value="customerService">Customer service/support</option>
                    <option value="contentCreation">Content creation</option>
                    <option value="dataAnalysis">Data analysis</option>
                    <option value="processOptimization">Process optimization</option>
                    <option value="other">Something else</option>
                </select>
            </div>
            <div class="form-group" id="otherChallengeGroup" style="display: none;">
                <label for="otherChallenge">Please describe your challenge</label>
                <textarea id="otherChallenge" name="otherChallenge" rows="3" placeholder="Describe how AI could help your business"></textarea>
            </div>
            <div class="form-group">
                <label for="aiExperience">How familiar are you with using AI tools?</label>
                <select id="aiExperience" name="aiExperience" required>
                    <option value="" disabled selected>Select your experience level</option>
                    <option value="beginner">Complete beginner</option>
                    <option value="some">Some experience</option>
                    <option value="regular">Regular user</option>
                    <option value="advanced">Advanced user</option>
                </select>
            </div>
            <div class="form-group">
                <label for="message">Any additional information you'd like to share?</label>
                <textarea id="message" name="message" rows="3" placeholder="Tell us more about your AI adoption goals"></textarea>
            </div>
            <button type="submit" class="cta-button">Submit Consultation Request</button>
        `;
        
        // Append elements to DOM
        formContainer.appendChild(formIntro);
        formContainer.appendChild(form);
        
        modalBody.appendChild(formContainer);
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // Add event listener for "other" challenge option
        const aiChallengeSelect = document.getElementById('aiChallenge');
        const otherChallengeGroup = document.getElementById('otherChallengeGroup');
        
        aiChallengeSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherChallengeGroup.style.display = 'block';
            } else {
                otherChallengeGroup.style.display = 'none';
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="ph ph-check-circle" style="font-size: 48px; color: var(--primary); margin-bottom: 20px;"></i>
                    <h3>Thank You for Your Consultation Request!</h3>
                    <p>Your request has been received. One of our AI Adoption Specialists will reach out to you shortly to discuss how we can help implement AI solutions tailored to your specific needs.</p>
                    <p style="margin-top: 20px;">In the meantime, feel free to explore our website to learn more about our approach and success stories.</p>
                </div>
            `;
            
            // Close modal after 8 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                // Remove modal after fade out
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 500);
            }, 8000);
        });
        
        // Add event listeners for modal closing
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            // Remove modal after fade out
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 500);
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                // Remove modal after fade out
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 500);
            }
        });
        
        return modal;
    }
    
    // Create human demo request form
    function createDemoRequestModal() {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'tiwa-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'tiwa-modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'tiwa-close';
        closeBtn.innerHTML = '&times;';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'tiwa-modal-header';
        modalHeader.innerHTML = '<h2>Schedule a Human Demo</h2>';
        
        const modalBody = document.createElement('div');
        modalBody.className = 'tiwa-modal-body';
        
        // Create form interface
        const formContainer = document.createElement('div');
        formContainer.className = 'tiwa-form-container';
        
        const formIntro = document.createElement('div');
        formIntro.className = 'tiwa-form-intro';
        formIntro.innerHTML = `
            <p>Experience a personalized demo with one of our AI adoption specialists.</p>
            <p>Fill out the form below to schedule a one-on-one session where we can discuss your specific needs and demonstrate our solutions.</p>
        `;
        
        const form = document.createElement('form');
        form.className = 'tiwa-demo-form';
        form.innerHTML = `
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email address" required>
            </div>
            <div class="form-group">
                <label for="company">Company Name</label>
                <input type="text" id="company" placeholder="Enter your company name" required>
            </div>
            <div class="form-group">
                <label for="industry">Industry</label>
                <select id="industry" required>
                    <option value="" disabled selected>Select your industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="message">What would you like to discuss in the demo?</label>
                <textarea id="message" rows="4" placeholder="Tell us about your specific needs or challenges"></textarea>
            </div>
            <button type="submit" class="cta-button">Request Demo</button>
        `;
        
        // Append elements to DOM
        formContainer.appendChild(formIntro);
        formContainer.appendChild(form);
        
        modalBody.appendChild(formContainer);
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // Add event listeners
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            formContainer.innerHTML = `
                <div class="success-message">
                    <i class="ph ph-check-circle" style="font-size: 48px; color: var(--primary); margin-bottom: 20px;"></i>
                    <h3>Thank You for Your Request!</h3>
                    <p>Your demo request has been received. A member of our team will contact you shortly to schedule your personalized demonstration.</p>
                </div>
            `;
            
            // Close modal after 5 seconds
            setTimeout(() => {
                modal.style.display = 'none';
            }, 5000);
        });
        
        return modal;
    }
    
    // Create the modal
    const demoModal = createDemoRequestModal();
    
    // Debug logging
    console.log('Script loaded and running');
    
    // Check if elements exist
    const heroCta = document.querySelector('.hero .cta-button');
    const tiwaChatCta = document.querySelector('#try-tiwa-chat');
    const tiwaDemo = document.querySelector('#try-tiwa-demo');
    
    console.log('Hero CTA button exists:', !!heroCta);
    console.log('Try Tiwa Chat button exists:', !!tiwaChatCta);
    console.log('Try Tiwa Demo button exists:', !!tiwaDemo);
    
    // Consultation form handling
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formContainer = document.querySelector('.consultation-form-container');
            
            // Display success message (in a real app, you would send data to server)
            formContainer.innerHTML = `
                <div class="success-message" style="text-align: center; padding: 30px 20px;">
                    <i class="ph ph-check-circle" style="font-size: 64px; color: var(--primary); margin-bottom: 20px; display: block;"></i>
                    <h3 style="font-family: 'Space Mono', monospace; font-size: 24px; margin-bottom: 20px;">Consultation Request Sent!</h3>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 15px;">Thank you for your interest in TIWA.AI. One of our specialists will contact you within 24 hours to schedule your consultation.</p>
                    <p style="font-size: 16px; color: var(--text-secondary);">In the meantime, feel free to explore our AI solutions further or try our interactive assistant.</p>
                </div>
            `;
        });
    }

    // Add collapsible form functionality
    const toggleFormBtn = document.querySelector('.toggle-form-btn');
    const collapsibleContent = document.querySelector('.collapsible-content');
    
    if (toggleFormBtn && collapsibleContent) {
        toggleFormBtn.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            if (!expanded) {
                collapsibleContent.classList.add('expanded');
                this.querySelector('.btn-text').textContent = 'Hide consultation form';
                    } else {
                collapsibleContent.classList.remove('expanded');
                this.querySelector('.btn-text').textContent = 'Show consultation form';
            }
        });
    }
});
