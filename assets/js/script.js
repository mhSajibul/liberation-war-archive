// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSlider();
    initDocumentsFilter();
    initGallery();
    initLightbox();
    initFormHandlers();
});

// Navbar functionality with mobile menu toggle
function initNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar a');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            navbar.classList.remove('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to the section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Header shrink on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.padding = '5px 0';
        } else {
            header.style.padding = '15px 0';
        }
    });
}

// Hero Section Slider
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and activate its dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }

    // Previous slide button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            showSlide(currentSlide);
            resetSlideInterval();
        });
    }

    // Next slide button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
            resetSlideInterval();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetSlideInterval();
        });
    });

    // Auto slide functionality
    function startSlideInterval() {
        slideInterval = setInterval(function() {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
        }, 5000); // Change slide every 5 seconds
    }

    // Reset slide interval
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }

    // Start auto slide
    startSlideInterval();
}

// Documents Section Filtering
function initDocumentsFilter() {
    const documentTypeSelect = document.getElementById('document-type');
    const documentDateSelect = document.getElementById('document-date');
    const documentSearch = document.getElementById('document-search');
    const documentCards = document.querySelectorAll('.document-card');
    const loadMoreDocsBtn = document.querySelector('.documents .load-more .btn');
    
    // Filter documents by type, date, and search query
    function filterDocuments() {
        const typeFilter = documentTypeSelect ? documentTypeSelect.value : 'all';
        const dateFilter = documentDateSelect ? documentDateSelect.value : 'all';
        const searchQuery = documentSearch ? documentSearch.value.toLowerCase() : '';
        
        documentCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardDate = card.getAttribute('data-date');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDesc = card.querySelector('.document-description').textContent.toLowerCase();
            
            // Check if card matches all filters
            const matchesType = typeFilter === 'all' || cardType === typeFilter;
            const matchesDate = dateFilter === 'all' || cardDate === dateFilter;
            const matchesSearch = searchQuery === '' || 
                                  cardTitle.includes(searchQuery) || 
                                  cardDesc.includes(searchQuery);
            
            // Show or hide the card based on filter matches
            if (matchesType && matchesDate && matchesSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Event listeners for filters
    if (documentTypeSelect) {
        documentTypeSelect.addEventListener('change', filterDocuments);
    }
    
    if (documentDateSelect) {
        documentDateSelect.addEventListener('change', filterDocuments);
    }
    
    if (documentSearch) {
        documentSearch.addEventListener('input', filterDocuments);
        
        // Prevent form submission on enter key
        documentSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
    
    // Load more documents button (simulated)
    if (loadMoreDocsBtn) {
        loadMoreDocsBtn.addEventListener('click', function() {
            // This would typically load more documents from a server
            // For demo purposes, we'll just show an alert
            alert('In a real application, this would load more documents from the server.');
        });
    }
}

// Photograph Gallery Filtering and Interactions
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMorePhotosBtn = document.querySelector('.photographs .load-more .btn');
    
    // Filter gallery items by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show or hide gallery items based on filter
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // View button clicks to open lightbox
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                openLightbox(index);
            });
        }
    });
    
    // Load more photos button (simulated)
    if (loadMorePhotosBtn) {
        loadMorePhotosBtn.addEventListener('click', function() {
            // This would typically load more photos from a server
            // For demo purposes, we'll just show an alert
            alert('In a real application, this would load more photos from the server.');
        });
    }
}

// Lightbox functionality for photographs
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-description');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevLightbox = document.querySelector('.lightbox-nav.prev');
    const nextLightbox = document.querySelector('.lightbox-nav.next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    
    // Open lightbox with specific image
    window.openLightbox = function(index) {
        if (lightbox && galleryItems.length > 0) {
            const item = galleryItems[index];
            const img = item.querySelector('img');
            const title = item.querySelector('h3').textContent;
            const desc = item.querySelector('p').textContent;
            
            // Set lightbox content
            lightboxImg.src = img.src;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            currentImageIndex = index;
            
            // Show lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        }
    };
    
    // Close lightbox
    if (closeLightbox) {
        closeLightbox.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Navigate to previous image
    if (prevLightbox) {
        prevLightbox.addEventListener('click', function() {
            currentImageIndex--;
            if (currentImageIndex < 0) {
                currentImageIndex = galleryItems.length - 1;
            }
            updateLightboxContent();
        });
    }
    
    // Navigate to next image
    if (nextLightbox) {
        nextLightbox.addEventListener('click', function() {
            currentImageIndex++;
            if (currentImageIndex >= galleryItems.length) {
                currentImageIndex = 0;
            }
            updateLightboxContent();
        });
    }
    
    // Update lightbox content based on current index
    function updateLightboxContent() {
        const item = galleryItems[currentImageIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const desc = item.querySelector('p').textContent;
        
        // Animate image change
        lightboxImg.style.opacity = '0';
        setTimeout(function() {
            lightboxImg.src = img.src;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            lightboxImg.style.opacity = '1';
        }, 300);
    }
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            // Close lightbox on Escape key
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        } else if (e.key === 'ArrowLeft') {
            // Previous image on left arrow
            currentImageIndex--;
            if (currentImageIndex < 0) {
                currentImageIndex = galleryItems.length - 1;
            }
            updateLightboxContent();
        } else if (e.key === 'ArrowRight') {
            // Next image on right arrow
            currentImageIndex++;
            if (currentImageIndex >= galleryItems.length) {
                currentImageIndex = 0;
            }
            updateLightboxContent();
        }
    });
}

// Interview play functionality
function initInterviews() {
    const interviewCards = document.querySelectorAll('.interview-card');
    const loadMoreInterviewsBtn = document.querySelector('.interviews .load-more .btn');
    
    
    
    // Load more interviews button (simulated)
    if (loadMoreInterviewsBtn) {
        loadMoreInterviewsBtn.addEventListener('click', function() {
            alert('In a real application, this would load more interviews from the server.');
        });
    }
}

// Form submission and validation
function initFormHandlers() {
    const contactForm = document.getElementById('contribution-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const fileUpload = document.getElementById('file-upload');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Submit form (simulated)
            alert('Thank you for your message! In a real application, this would be sent to the server.');
            contactForm.reset();
        });
    }
    
    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value) {
                alert('Please enter your email address.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Submit newsletter subscription (simulated)
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
    
    // File upload handling
    if (fileUpload && uploadPlaceholder) {
        fileUpload.addEventListener('change', function() {
            const files = this.files;
            if (files.length > 0) {
                let fileNames = '';
                for (let i = 0; i < files.length; i++) {
                    fileNames += files[i].name;
                    if (i < files.length - 1) {
                        fileNames += ', ';
                    }
                }
                
                // Update placeholder text to show selected files
                const placeholder = uploadPlaceholder.querySelector('p');
                if (placeholder) {
                    placeholder.textContent = `Selected files: ${fileNames}`;
                }
                
                // Add active class to show selection
                uploadPlaceholder.classList.add('active');
            } else {
                // Reset placeholder text if no files selected
                const placeholder = uploadPlaceholder.querySelector('p');
                if (placeholder) {
                    placeholder.textContent = 'Drag files here or click to browse';
                }
                
                // Remove active class
                uploadPlaceholder.classList.remove('active');
            }
        });
        
        // Drag and drop functionality
        uploadPlaceholder.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadPlaceholder.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        uploadPlaceholder.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileUpload.files = files;
                
                // Trigger change event to update UI
                const event = new Event('change');
                fileUpload.dispatchEvent(event);
            }
        });
    }
}

// Call interview initialization (called inside DOMContentLoaded but defined here)
initInterviews();
