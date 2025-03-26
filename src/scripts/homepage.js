/**
 * MCP Configuration Tool Homepage Interactive Elements
 * Adds smooth scrolling, FAQ accordion, and other interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
      }
    });
  });

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Toggle active class on the clicked item
      item.classList.toggle('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
    });
  });
  
  // Initialize the first FAQ item as open
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }

  // Pricing tier hover effects
  const tierCards = document.querySelectorAll('.tier-card');
  
  tierCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      tierCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.style.transform = 'scale(0.98)';
          otherCard.style.opacity = '0.8';
        }
      });
      card.style.transform = 'translateY(-10px)';
      card.style.zIndex = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      tierCards.forEach(otherCard => {
        otherCard.style.transform = '';
        otherCard.style.opacity = '';
      });
    });
  });

  // Animated counters for stats (placeholder for future implementation)
  // Will be used for future feature implementation
  // eslint-disable-next-line no-unused-vars
  function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      element.textContent = Math.floor(start);
      
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }

  // Intersection Observer for scroll animations
  const animatedElements = document.querySelectorAll('.benefit-card, .feature-card, .use-case-card, .step');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
  });

  // Mobile menu toggle (for responsive design)
  const createMobileMenu = () => {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.main-nav');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.display = 'none';
    mobileMenuBtn.style.background = 'none';
    mobileMenuBtn.style.border = 'none';
    mobileMenuBtn.style.fontSize = '1.5rem';
    mobileMenuBtn.style.cursor = 'pointer';
    mobileMenuBtn.style.color = 'var(--text)';
    
    header.querySelector('.logo').after(mobileMenuBtn);
    
    // Handle mobile menu toggle
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      
      if (isMenuOpen) {
        nav.style.display = 'block';
        mobileMenuBtn.innerHTML = '✕';
      } else {
        nav.style.display = '';
        mobileMenuBtn.innerHTML = '☰';
      }
    });
    
    // Show/hide mobile menu button based on screen width
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'block';
        nav.style.display = isMenuOpen ? 'block' : 'none';
      } else {
        mobileMenuBtn.style.display = 'none';
        nav.style.display = '';
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
  };
  
  createMobileMenu();

  // Placeholder image handling
  document.querySelectorAll('img[src$=".svg"]').forEach(img => {
    // Add placeholder text
    img.addEventListener('error', function() {
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.backgroundColor = 'var(--neutral-light)';
      this.style.color = 'var(--neutral-dark)';
      this.style.padding = '1rem';
      this.style.borderRadius = '8px';
      
      const imgType = this.getAttribute('src').split('/').pop().split('.')[0];
      this.setAttribute('alt', `${imgType} placeholder`);
      
      // Add placeholder text inside
      const placeholderText = document.createElement('span');
      placeholderText.textContent = imgType;
      this.parentNode.appendChild(placeholderText);
    });
  });
});