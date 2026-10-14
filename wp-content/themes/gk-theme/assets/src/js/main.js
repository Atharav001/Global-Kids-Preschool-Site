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

  // 2b. Mobile Navigation Sub-menu Accordion
  document.querySelectorAll('.mobile-nav-group-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const group = toggle.closest('.mobile-nav-group');
      if (!group) return;
      const isOpen = group.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

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

  // 10. Interactive Campus Spaces Explorer Tabs
  const spaceTabBtns = document.querySelectorAll('.space-tab-btn');
  const spacePanels = document.querySelectorAll('.space-panel-content');
  if (spaceTabBtns.length > 0 && spacePanels.length > 0) {
    spaceTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target-panel');
        spaceTabBtns.forEach(b => b.classList.remove('active'));
        spacePanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const activePanel = document.getElementById(targetId);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  // 11. Interactive Child Milestone Calculator
  const calcSelect = document.getElementById('calc-age-select');
  const calcResultBox = document.getElementById('calc-result-display');
  if (calcSelect && calcResultBox) {
    const milestoneData = {
      'toddler': {
        prog: 'Toddler Explorers (1.5 – 2.5 yrs)',
        ratio: '1:5 Educator Ratio',
        timings: '09:00 AM – 11:30 AM',
        milestones: 'Sensory tactile exploration, receptive vocabulary, finger grasp, and gentle separation confidence.',
        settling: '3-day gradual settling sessions with parent in lounge.'
      },
      'playgroup': {
        prog: 'Playgroup Pioneers (2.0 – 3.0 yrs)',
        ratio: '1:7 Educator Ratio',
        timings: '09:00 AM – 12:00 PM',
        milestones: 'Phonemic rhythm songs, 2-word phrase sentences, shape sorting, independent handwashing, and peer sharing.',
        settling: '4-day staggered transition with dedicated settling buddy educator.'
      },
      'nursery': {
        prog: 'Nursery Discoverers (3.0 – 4.0 yrs)',
        ratio: '1:8 Educator Ratio',
        timings: '08:45 AM – 12:30 PM',
        milestones: 'Jolly Phonics letter sounds, number concepts (1–20), scissor control, pencil grasp, and theme-based inquiries.',
        settling: '5-day confidence building program with morning circle games.'
      },
      'kindergarten': {
        prog: 'Kindergarten Leaders (4.0 – 6.0 yrs)',
        ratio: '1:10 Educator Ratio',
        timings: '08:30 AM – 01:00 PM',
        milestones: 'Independent reading, sentence formation, mental math, STEM curiosity, public speaking, and primary school readiness.',
        settling: 'Immediate engagement with team STEM discovery activities.'
      },
      'daycare': {
        prog: 'Full-Day Daycare & Extended Care (1.5 – 10 yrs)',
        ratio: '1:6 Attendant Ratio',
        timings: '08:30 AM – 06:30 PM',
        milestones: 'Warm home-cooked hot meals, supervised sanitized nap suites, evening storytelling, chess, and homework guidance.',
        settling: 'Personalized sleep and dietary schedule matching home routine.'
      }
    };

    calcSelect.addEventListener('change', () => {
      const selected = calcSelect.value;
      const data = milestoneData[selected];
      if (data) {
        calcResultBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line); padding-bottom: 0.75rem;">
            <strong style="font-family: var(--font-head); font-size: 1.15rem; color: var(--blue);">${data.prog}</strong>
            <span class="sticker-badge" style="transform:none;">${data.ratio}</span>
          </div>
          <div style="font-size: var(--fs-sm); color: var(--ink); margin-top: 0.5rem;">
            <strong>Classroom Timings:</strong> ${data.timings}
          </div>
          <div style="font-size: var(--fs-sm); color: var(--ink-soft); margin-top: 0.25rem;">
            <strong>Key Milestone Focus:</strong> ${data.milestones}
          </div>
          <div style="font-size: var(--fs-xs); color: var(--ok); font-weight: 600; margin-top: 0.4rem;">
            ✔ Gentle Settling Protocol: ${data.settling}
          </div>
          <div style="margin-top: 1rem;">
            <a href="/admissions/?programme=${encodeURIComponent(data.prog)}#visit" class="btn btn-primary btn-sm">Schedule Visit for this Batch →</a>
          </div>
        `;
      }
    });
  }

})();
