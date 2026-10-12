/**
 * Global Kids Preschool - Main Client Bundle (Vanilla ES6, < 15 KB)
 * Adheres to WCAG 2.2 AA accessibility and PRD/DESIGN requirements
 */

(function () {
  'use strict';

  // 1. Sticky Header Shadow
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Accessible Mobile Navigation Sheet
  const menuToggle = document.querySelector('.btn-menu-toggle');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const menuDrawer = document.querySelector('.mobile-menu-drawer');
  const menuCloseBtn = document.querySelector('.btn-menu-close');

  if (menuToggle && menuDrawer && menuOverlay) {
    const openMenu = () => {
      menuOverlay.classList.add('open');
      menuDrawer.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (menuCloseBtn) menuCloseBtn.focus();
    };

    const closeMenu = () => {
      menuOverlay.classList.remove('open');
      menuDrawer.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuToggle.focus();
    };

    menuToggle.addEventListener('click', openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // 3. Mobile Sticky Action Bar - Hide on Input Focus
  const stickyBar = document.querySelector('.sticky-action-bar');
  if (stickyBar) {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        stickyBar.classList.add('hidden-keyboard');
      });
      input.addEventListener('blur', () => {
        stickyBar.classList.remove('hidden-keyboard');
      });
    });
  }

  // 4. Announcement Bar Dismissal
  const announcementBar = document.querySelector('.announcement-bar');
  const announcementDismiss = document.querySelector('.announcement-dismiss');
  if (announcementBar && announcementDismiss) {
    const dismissedKey = 'gk_announcement_dismissed';
    if (localStorage.getItem(dismissedKey) === 'true') {
      announcementBar.style.display = 'none';
    }
    announcementDismiss.addEventListener('click', () => {
      announcementBar.style.display = 'none';
      localStorage.setItem(dismissedKey, 'true');
    });
  }

  // 5. Native <dialog> Lightbox
  const lightbox = document.querySelector('.gk-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close-btn');

    document.querySelectorAll('[data-lightbox-src]').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-lightbox-src');
        const alt = thumb.getAttribute('data-lightbox-alt') || '';
        if (lightboxImg) {
          lightboxImg.src = src;
          lightboxImg.alt = alt;
        }
        if (lightboxCaption) {
          lightboxCaption.textContent = alt;
        }
        lightbox.showModal();
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.close();
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.close();
      }
    });
  }

  // 6. Reveal-on-Scroll with IntersectionObserver
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal-item').forEach((item) => {
      observer.observe(item);
    });
  } else {
    document.querySelectorAll('.reveal-item').forEach((item) => {
      item.classList.add('revealed');
    });
  }

  // 7. Privacy-Gated Consent Banner & GA4 Hook
  const consentBanner = document.querySelector('.consent-banner');
  if (consentBanner) {
    const consentChoice = localStorage.getItem('gk_cookie_consent');
    if (!consentChoice) {
      consentBanner.classList.remove('hidden');
    } else {
      consentBanner.classList.add('hidden');
    }

    const acceptBtn = consentBanner.querySelector('[data-consent-action="accept"]');
    const declineBtn = consentBanner.querySelector('[data-consent-action="decline"]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('gk_cookie_consent', 'accepted');
        consentBanner.classList.add('hidden');
        window.dispatchEvent(new CustomEvent('gk-consent-granted'));
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        localStorage.setItem('gk_cookie_consent', 'declined');
        consentBanner.classList.add('hidden');
      });
    }
  }

  // 8. Analytics Event Tracking
  const trackEvent = (eventName, params = {}) => {
    if (localStorage.getItem('gk_cookie_consent') === 'accepted' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  };

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => trackEvent('call_click', { phone: link.href }));
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    link.addEventListener('click', () => trackEvent('whatsapp_click', { url: link.href }));
  });

  document.querySelectorAll('a[data-track="brochure_download"]').forEach((link) => {
    link.addEventListener('click', () => trackEvent('brochure_download'));
  });

  document.querySelectorAll('a[data-track="directions_click"]').forEach((link) => {
    link.addEventListener('click', () => trackEvent('directions_click'));
  });

  // 9. Interactive Form Validation (Progressive Enhancement)
  const forms = document.querySelectorAll('form[data-gk-validate="true"]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      let hasError = false;
      const phoneInput = form.querySelector('input[name="phone"]');
      const consentCheckbox = form.querySelector('input[name="consent"]');
      const nameInput = form.querySelector('input[name="parent_name"]');

      if (nameInput && !nameInput.value.trim()) {
        hasError = true;
        nameInput.closest('.form-group')?.classList.add('has-error');
      } else if (nameInput) {
        nameInput.closest('.form-group')?.classList.remove('has-error');
      }

      if (phoneInput) {
        const cleaned = phoneInput.value.replace(/[^0-9]/g, '');
        if (cleaned.length !== 10) {
          hasError = true;
          phoneInput.closest('.form-group')?.classList.add('has-error');
        } else {
          phoneInput.closest('.form-group')?.classList.remove('has-error');
        }
      }

      if (consentCheckbox && !consentCheckbox.checked) {
        hasError = true;
        consentCheckbox.closest('.consent-checkbox-row')?.classList.add('has-error');
      } else if (consentCheckbox) {
        consentCheckbox.closest('.consent-checkbox-row')?.classList.remove('has-error');
      }

      if (hasError) {
        e.preventDefault();
        const firstErr = form.querySelector('.has-error input, .has-error');
        if (firstErr) firstErr.focus();
      } else {
        trackEvent('visit_form_submit');
      }
    });
  });

})();
