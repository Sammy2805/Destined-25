// Wedding Website Interactivity
// Edit this file for all interactive features. See comments for customization.

// --- NAVIGATION ---
// Hamburger menu logic
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }
  // Hamburger menu logic for mobile navigation
  if (navToggle && navList && navOverlay) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('open');
      navList.classList.toggle('open');
      navOverlay.classList.toggle('open');
    });

    navOverlay.addEventListener('click', function() {
      navToggle.classList.remove('open');
      navList.classList.remove('open');
      navOverlay.classList.remove('open');
    });

    // Close menu on link click
    navList.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('open');
        navList.classList.remove('open');
        navOverlay.classList.remove('open');
      });
    });
  }
  navToggle && navToggle.addEventListener('click', function() {
    if (navList.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  navOverlay && navOverlay.addEventListener('click', closeMenu);
  // Close menu on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navList.classList.contains('open')) {
      closeMenu();
    }
  });
  // Close menu when a nav link is clicked
  navList && navList.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link) {
      closeMenu();
      // Let browser handle navigation
    }
  });
  // Section slide-in effect on scroll
  const slideSections = document.querySelectorAll('.redesigned-card, .gallery-section, .vendors-section, .location-section, .registry-books-section, .honeymoon-support-section');
  function handleSectionScroll() {
    slideSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        section.classList.add('section-visible');
        section.classList.remove('section-hidden');
      } else {
        section.classList.remove('section-visible');
        section.classList.add('section-hidden');
      }
    });
  }
  window.addEventListener('scroll', handleSectionScroll);
  window.addEventListener('resize', handleSectionScroll);
  handleSectionScroll();
});

// --- RSVP FORM ---
// --- MOBILE COUNTDOWN ---
// --- MAIN COUNTDOWN (Home Page) ---
function updateMainCountdown() {
  const countdownEl = document.getElementById('main-countdown');
  if (!countdownEl) return;
  const targetDate = new Date('2025-12-13T00:00:00');
  const now = new Date();
  let diff = targetDate - now;
  if (diff < 0) {
    countdownEl.innerHTML = '<span style="font-size:2em;color:#b76e79;font-weight:700;">The big day is here!</span>';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.innerHTML = `
    <div style="display:flex;gap:2rem;justify-content:center;align-items:center;">
      <div style="text-align:center;">
        <div style="font-size:2.5em;color:#fff;font-weight:800;">${days}</div>
        <div style="font-size:1.1em;color:#fff;">Days</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:2.5em;color:#a16069;font-weight:800;">${hours}</div>
        <div style="font-size:1.1em;color:#a16069;">Hours</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:2.5em;color:#fff;font-weight:800;">${minutes}</div>
        <div style="font-size:1.1em;color:#fff;">Minutes</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:2.5em;color:#a16069;font-weight:800;">${seconds}</div>
        <div style="font-size:1.1em;color:#a16069;">Seconds</div>
      </div>
    </div>
  `;
}
setInterval(updateMainCountdown, 1000);
document.addEventListener('DOMContentLoaded', updateMainCountdown);
function updateMobileCountdown() {
  const countdownEl = document.getElementById('mobile-countdown');
  if (!countdownEl) return;
  // Only show on mobile
  if (window.innerWidth > 700) {
    countdownEl.style.display = 'none';
    return;
  }
  countdownEl.style.display = 'block';
  const targetDate = new Date('2025-12-13T00:00:00');
  const now = new Date();
  let diff = targetDate - now;
  if (diff < 0) {
    countdownEl.textContent = 'The big day is here!';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.innerHTML = `<span style="font-size:1.3em;">🎉</span> <b>${days}</b> days <b>${hours}</b> hrs <b>${minutes}</b> min <b>${seconds}</b> sec until <span style="color:#ffd6e0;font-weight:700;">Dec 13</span>`;
}
window.addEventListener('resize', updateMobileCountdown);
setInterval(updateMobileCountdown, 1000);
document.addEventListener('DOMContentLoaded', updateMobileCountdown);
const rsvpForm = document.querySelector('.rsvp-form');
if (rsvpForm) {
  const rsvpSuccess = rsvpForm.querySelector('.rsvp-success');
  const rsvpList = rsvpForm.querySelector('.rsvp-list');
  function getRSVPs() {
    try {
      return JSON.parse(localStorage.getItem('rsvps') || '[]');
    } catch { return []; }
  }
  function saveRSVP(data) {
    const rsvps = getRSVPs();
    rsvps.unshift({ ...data, date: new Date().toLocaleString() });
    localStorage.setItem('rsvps', JSON.stringify(rsvps.slice(0, 10)));
  }
  function showRSVPs() {
    const rsvps = getRSVPs();
    if (rsvps.length) {
      rsvpList.innerHTML = '<strong>Recent RSVPs:</strong><ul>' + rsvps.map(r => `<li>${r.name} (${r.attending}) <span style="color:#888;font-size:0.9em;">${r.date}</span></li>`).join('') + '</ul>';
      rsvpList.style.display = '';
    } else {
      rsvpList.style.display = 'none';
    }
  }
  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = rsvpForm['name'].value.trim();
    const email = rsvpForm['email'].value.trim();
    const attending = rsvpForm['attending'].value;
    const notes = rsvpForm['notes'].value.trim();
    if (!name) {
      rsvpSuccess.textContent = 'Please enter your name.';
      rsvpSuccess.style.color = 'var(--error)';
      rsvpSuccess.style.display = '';
      return;
    }
    if (!attending) {
      rsvpSuccess.textContent = 'Please select if you will attend.';
      rsvpSuccess.style.color = 'var(--error)';
      rsvpSuccess.style.display = '';
      return;
    }
    // TODO: To use a real backend, replace this with a POST request
    // fetch('/api/rsvp', { method: 'POST', body: JSON.stringify({ name, email, attending, notes }) })
    saveRSVP({ name, email, attending, notes });
    rsvpSuccess.textContent = 'Thank you for your RSVP!';
    rsvpSuccess.style.color = 'var(--success)';
    rsvpSuccess.style.display = '';
    rsvpForm.reset();
    showRSVPs();
  });
  showRSVPs();
}

// --- GALLERY LIGHTBOX ---
const galleryThumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
const lightbox = document.querySelector('.lightbox');
if (galleryThumbs.length && lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxBtns = lightbox.querySelectorAll('.lightbox-btn');
  let currentIndex = 0;
  function openLightbox(idx) {
    currentIndex = idx;
    const thumb = galleryThumbs[idx];
    lightboxImg.src = thumb.getAttribute('data-full');
    lightboxImg.alt = thumb.querySelector('img').alt;
    lightbox.classList.add('open');
    lightbox.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }
  function showLightboxImg(idx) {
    if (idx < 0) idx = galleryThumbs.length - 1;
    if (idx >= galleryThumbs.length) idx = 0;
    openLightbox(idx);
  }
  galleryThumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => openLightbox(idx));
    thumb.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(idx);
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') closeLightbox();
  });
  lightboxBtns[0].addEventListener('click', () => showLightboxImg(currentIndex - 1));
  lightboxBtns[1].addEventListener('click', () => showLightboxImg(currentIndex + 1));
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImg(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImg(currentIndex + 1);
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  // Accessibility: trap focus in lightbox
  lightbox.addEventListener('focus', function() {
    if (lightbox.classList.contains('open')) {
      lightbox.setAttribute('tabindex', '0');
    }
  });
}

// --- Registry Links ---
document.querySelectorAll('.registry-list a').forEach(link => {
  link.addEventListener('click', e => {
    // TODO: Replace # with real registry URLs
    if (link.getAttribute('href') === '#') {
      e.preventDefault();
      alert('Registry link placeholder. Replace with your real registry URL.');
    }
  });
});

// --- Progressive Enhancement ---
// All anchor navigation and content works without JS. RSVP and lightbox require JS for enhancements

// --- Sliding and Scrolling Effect for Sections ---
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('main section');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  sections.forEach(section => {
    observer.observe(section);
  });
});
