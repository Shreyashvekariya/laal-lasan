// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const contactForm = document.getElementById('contact-form');
    const teamMembers = document.querySelectorAll('.team-member');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');

    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For this demo, we'll simulate a successful submission
            simulateFormSubmission(name, email, message);
        });
    }

    // Team member hover effect
    if (teamMembers.length > 0) {
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', function() {
                this.querySelector('.team-member-bio').style.opacity = '1';
            });
            
            member.addEventListener('mouseleave', function() {
                this.querySelector('.team-member-bio').style.opacity = '0';
            });
        });
    }

    // Testimonial slider functionality
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide
        if (testimonialSlides[index]) {
            testimonialSlides[index].style.display = 'block';
        }
        
        // Add active class to current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        // Update current slide index
        currentSlide = index;
    }

    // Function to show next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Function to show previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Add event listeners to navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    // Add event listeners to dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
            });
        });
    }

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance when hovering over testimonials
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Initialize the slider
    if (testimonialSlides.length > 0) {
        showSlide(0);
    }

    // Function to simulate form submission
    function simulateFormSubmission(name, email, message) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API delay
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
        }, 1500);
    }

    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Check if element is in view
            if (
                (elementBottomPosition >= windowTopPosition && elementTopPosition <= windowBottomPosition) ||
                (elementTopPosition <= windowBottomPosition && elementBottomPosition >= windowTopPosition)
            ) {
                element.classList.add('animated');
            }
        });
    }
    
    // Check elements on load
    window.addEventListener('load', checkIfInView);
    
    // Check elements on scroll
    window.addEventListener('scroll', checkIfInView);
});