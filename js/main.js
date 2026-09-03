/* ═══════════════════════════════════════════════════
   هلا سيستم - HALA SYSTEMS
   JavaScript Interactions & Animations
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. Sticky Navbar with scroll effect ───
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar scroll effect
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top visibility
    if (scrollTopBtn) {
      if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── 2. Smooth Scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileNav = document.querySelector('.navbar-nav');
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          mobileToggle.classList.remove('active');
        }
      }
    });
  });

  // ─── 3. Scroll-to-top button ───
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── 4. Mobile menu toggle ───
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.navbar-nav');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // ─── 5. Intersection Observer for scroll animations ───
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ─── 6. Counter Animation ───
  const counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (target - startValue) * easeOut);

      element.textContent = prefix + currentValue.toLocaleString('ar-SA') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── 7. FAQ Accordion ───
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ─── 8. Active navbar link on scroll ───
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 150;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.navbar-nav a').forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ─── 9. Contact Form (Basic validation) ───
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Simple validation
      let valid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        // Show success message
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ تم إرسال رسالتك بنجاح!';
        submitBtn.style.background = '#10B981';
        submitBtn.disabled = true;

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // ─── 10. True Seamless Infinite Projects Carousel ───
  const carouselTrack = document.getElementById('projCarouselTrack');
  const carouselViewport = document.getElementById('projCarouselViewport');
  const prevBtn = document.getElementById('projPrevBtn');
  const nextBtn = document.getElementById('projNextBtn');
  const filterBtns = document.querySelectorAll('.proj-filter-btn');

  if (carouselTrack && carouselViewport) {
    let projAutoPlayTimer = null;
    let projIsAnimating = false;

    function getProjStep() {
      const card = carouselTrack.querySelector('.project-carousel-card');
      if (!card) return 0;
      const gap = 26;
      return card.offsetWidth + gap;
    }

    function nextSlide() {
      if (projIsAnimating) return;
      const step = getProjStep();
      if (!step) return;

      projIsAnimating = true;
      carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      carouselTrack.style.transform = 'translateX(' + step + 'px)';

      setTimeout(function () {
        const firstCard = carouselTrack.firstElementChild;
        if (firstCard) {
          carouselTrack.appendChild(firstCard);
        }
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = 'translateX(0)';
        projIsAnimating = false;
      }, 650);
    }

    function prevSlide() {
      if (projIsAnimating) return;
      const step = getProjStep();
      if (!step) return;

      projIsAnimating = true;
      const lastCard = carouselTrack.lastElementChild;
      if (lastCard) {
        carouselTrack.insertBefore(lastCard, carouselTrack.firstElementChild);
      }
      carouselTrack.style.transition = 'none';
      carouselTrack.style.transform = 'translateX(' + step + 'px)';

      // Force reflow
      void carouselTrack.offsetHeight;

      carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      carouselTrack.style.transform = 'translateX(0)';

      setTimeout(function () {
        projIsAnimating = false;
      }, 650);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        resetProjAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        resetProjAutoPlay();
      });
    }

    // Filter Buttons
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const allCards = carouselTrack.querySelectorAll('.project-carousel-card');

        allCards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        resetProjAutoPlay();
      });
    });

    function startProjAutoPlay() {
      if (projAutoPlayTimer) clearInterval(projAutoPlayTimer);
      projAutoPlayTimer = setInterval(nextSlide, 3600);
    }

    function resetProjAutoPlay() {
      if (projAutoPlayTimer) clearInterval(projAutoPlayTimer);
      startProjAutoPlay();
    }

    carouselViewport.addEventListener('mouseenter', function () {
      if (projAutoPlayTimer) clearInterval(projAutoPlayTimer);
    });

    carouselViewport.addEventListener('mouseleave', function () {
      startProjAutoPlay();
    });

    // Touch & Drag Support
    let projStartX = 0;
    let projIsDragging = false;

    carouselViewport.addEventListener('touchstart', function (e) {
      projStartX = e.touches[0].clientX;
      projIsDragging = true;
      if (projAutoPlayTimer) clearInterval(projAutoPlayTimer);
    }, { passive: true });

    carouselViewport.addEventListener('touchmove', function (e) {
      if (!projIsDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = currentX - projStartX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        projIsDragging = false;
      }
    }, { passive: true });

    carouselViewport.addEventListener('touchend', function () {
      projIsDragging = false;
      startProjAutoPlay();
    });

    startProjAutoPlay();
  }

  // ─── 11. True Seamless Infinite Partners Carousel ───
  const partnerTrack = document.getElementById('partnerCarouselTrack');
  const partnerViewport = document.getElementById('partnerCarouselViewport');
  const partnerPrevBtn = document.getElementById('partnerPrevBtn');
  const partnerNextBtn = document.getElementById('partnerNextBtn');

  if (partnerTrack && partnerViewport) {
    let partnerAutoPlayTimer = null;
    let partnerIsAnimating = false;

    function getPartnerStep() {
      const card = partnerTrack.querySelector('.partner-carousel-card');
      if (!card) return 0;
      const gap = 20;
      return card.offsetWidth + gap;
    }

    function nextPartnerSlide() {
      if (partnerIsAnimating) return;
      const step = getPartnerStep();
      if (!step) return;

      partnerIsAnimating = true;
      partnerTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      partnerTrack.style.transform = 'translateX(' + step + 'px)';

      setTimeout(function () {
        const firstCard = partnerTrack.firstElementChild;
        if (firstCard) {
          partnerTrack.appendChild(firstCard);
        }
        partnerTrack.style.transition = 'none';
        partnerTrack.style.transform = 'translateX(0)';
        partnerIsAnimating = false;
      }, 650);
    }

    function prevPartnerSlide() {
      if (partnerIsAnimating) return;
      const step = getPartnerStep();
      if (!step) return;

      partnerIsAnimating = true;
      const lastCard = partnerTrack.lastElementChild;
      if (lastCard) {
        partnerTrack.insertBefore(lastCard, partnerTrack.firstElementChild);
      }
      partnerTrack.style.transition = 'none';
      partnerTrack.style.transform = 'translateX(' + step + 'px)';

      // Force reflow
      void partnerTrack.offsetHeight;

      partnerTrack.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      partnerTrack.style.transform = 'translateX(0)';

      setTimeout(function () {
        partnerIsAnimating = false;
      }, 650);
    }

    if (partnerNextBtn) {
      partnerNextBtn.addEventListener('click', function () {
        nextPartnerSlide();
        resetPartnerAutoPlay();
      });
    }

    if (partnerPrevBtn) {
      partnerPrevBtn.addEventListener('click', function () {
        prevPartnerSlide();
        resetPartnerAutoPlay();
      });
    }

    function startPartnerAutoPlay() {
      if (partnerAutoPlayTimer) clearInterval(partnerAutoPlayTimer);
      partnerAutoPlayTimer = setInterval(nextPartnerSlide, 2800);
    }

    function resetPartnerAutoPlay() {
      if (partnerAutoPlayTimer) clearInterval(partnerAutoPlayTimer);
      startPartnerAutoPlay();
    }

    partnerViewport.addEventListener('mouseenter', function () {
      if (partnerAutoPlayTimer) clearInterval(partnerAutoPlayTimer);
    });

    partnerViewport.addEventListener('mouseleave', function () {
      startPartnerAutoPlay();
    });

    // Touch & Drag Support
    let partnerStartX = 0;
    let partnerIsDragging = false;

    partnerViewport.addEventListener('touchstart', function (e) {
      partnerStartX = e.touches[0].clientX;
      partnerIsDragging = true;
      if (partnerAutoPlayTimer) clearInterval(partnerAutoPlayTimer);
    }, { passive: true });

    partnerViewport.addEventListener('touchmove', function (e) {
      if (!partnerIsDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = currentX - partnerStartX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          prevPartnerSlide();
        } else {
          nextPartnerSlide();
        }
        partnerIsDragging = false;
      }
    }, { passive: true });

    partnerViewport.addEventListener('touchend', function () {
      partnerIsDragging = false;
      startPartnerAutoPlay();
    });

    startPartnerAutoPlay();
  }

});
