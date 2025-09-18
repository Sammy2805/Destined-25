// Wedding Website Interactivity
// Edit this file for all interactive features. See comments for customization.

// --- NAVIGATION ---
const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', function() {
    const expanded = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
  document.querySelectorAll('.nav-list a, .cta').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          target.focus({ preventScroll: true });
          if (navList.classList.contains('open')) navList.classList.remove('open');
          navToggle.setAttribute('aria-expanded', false);
        }
      }
    });
  });
}

// --- RSVP FORM ---
// --- MOBILE COUNTDOWN ---
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
