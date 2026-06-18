/**
 * TRINITY POWER SOLUTIONS - Global Script
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('header');
  const checkHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkHeaderScroll);
  checkHeaderScroll(); // Check on init

  // --- Mobile Hamburger Navigation Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // --- Auto-detect and set Active Navbar Link ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if the current pathname matches the link's destination
    // Accounts for base folders in GitHub Pages and relative folders
    const isHome = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';
    
    if (isHome) {
      if (href === 'index.html' || href === './index.html' || href === '../index.html') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else {
      // For subpages, compare filenames
      const filename = href.substring(href.lastIndexOf('/') + 1);
      if (currentPath.endsWith(filename) && filename !== 'index.html') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // --- Scroll Reveal Animation with IntersectionObserver ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --- Animated Count-Up Counters ---
  const counterElements = document.querySelectorAll('.stat-num');
  
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetNum = target.getAttribute('data-target');
          
          if (targetNum) {
            animateCounter(target, targetNum);
          }
          observer.unobserve(target);
        }
      });
    }, {
      threshold: 0.5
    });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    // Fallback
    counterElements.forEach(el => {
      const targetNum = el.getAttribute('data-target');
      if (targetNum) el.textContent = targetNum;
    });
  }

  function animateCounter(element, targetString) {
    // Extract numbers, units (e.g. "+", "kW", "MW", "MVA")
    const numRegex = /(\d+(\.\d+)?)/;
    const match = targetString.match(numRegex);
    if (!match) {
      element.textContent = targetString;
      return;
    }

    const targetVal = parseFloat(match[1]);
    const isFloat = match[1].includes('.');
    const suffix = targetString.replace(match[0], '');
    
    let startVal = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing outQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = startVal + (targetVal - startVal) * easedProgress;
      
      if (isFloat) {
        element.textContent = currentVal.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(currentVal) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = targetString; // Ensure absolute accuracy at completion
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Contact Form mailto Trigger ---
  const contactForm = document.getElementById('tpsContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value;
      const phone = document.getElementById('formPhone').value;
      const email = document.getElementById('formEmail').value;
      const requirement = document.getElementById('formRequirement').value;
      const message = document.getElementById('formMessage').value;

      // Construct mailto URL
      const emailRecipient = 'advisor.tps@gmail.com';
      const emailSubject = `Inquiry: ${requirement} - Trinity Power Solutions`;
      
      const emailBody = `Trinity Power Solutions Inquiry details:\n\n` +
                        `Name: ${name}\n` +
                        `Phone: ${phone}\n` +
                        `Email: ${email}\n` +
                        `Requirement Type: ${requirement}\n\n` +
                        `Message:\n${message}\n\n` +
                        `Sent from Trinity Power Solutions Website.`;

      const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open default mail client
      window.location.href = mailtoUrl;

      // Show temporary confirmation status inside form
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i data-lucide="check"></i> Email Generated!';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = origText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        submitBtn.disabled = false;
        contactForm.reset();
      }, 4000);
    });
  }
});
