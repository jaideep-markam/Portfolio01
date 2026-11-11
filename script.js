'use strict';

/* ═══════════════════════════════════════════════════════
   JAIDEEP MARKAM — PREMIUM PORTFOLIO INTERACTION ENGINE
   Awwwards-Caliber Video Editor & Motion Design Portfolio
═══════════════════════════════════════════════════════ */

// Security Control: Framing defense (clickjacking protection) is enforced via HTTP headers
// (Content-Security-Policy: frame-ancestors 'self' and X-Frame-Options: SAMEORIGIN).

/* ── DATA: CURATED CLIENT PROJECTS ── */
const PROJECTS = [
  {
    id: 'transition-02',
    title: 'Transition Reel 02',
    category: 'Transitions',
    client: 'Fashion Transition',
    description: 'A short-form fashion transition shaped around movement, precise timing, and a clean reveal.',
    tools: 'DaVinci Resolve Studio',
    videoUrl: 'https://res.cloudinary.com/dlupqyzif/video/upload/v1794380095/Reel_02_final_fpui85.mp4',
    thumbUrl: 'https://res.cloudinary.com/dlupqyzif/video/upload/w_600,h_1066,c_fill,so_2,q_auto/v1794380095/Reel_02_final_fpui85.jpg',
    duration: 'Reel'
  },
  {
    id: 'transition-01',
    title: 'Transition Reel 01',
    category: 'Transitions',
    client: 'Fashion Transition',
    description: 'A transition-led reel with a crisp visual change, considered pacing, and a finish designed to replay naturally.',
    tools: 'DaVinci Resolve Studio',
    videoUrl: 'https://res.cloudinary.com/dlupqyzif/video/upload/v1794380092/Reel_01_final_h7veen.mp4',
    thumbUrl: 'https://res.cloudinary.com/dlupqyzif/video/upload/w_600,h_1066,c_fill,so_2,q_auto/v1794380092/Reel_01_final_h7veen.jpg',
    duration: 'Reel'
  },
  {
    id: 'real-estate',
    title: 'Real Estate Luxury Showcase',
    category: 'Real Estate',
    client: 'Luxury Architectural Group',
    description: 'A property walkthrough with seamless movement, elegant pacing, and a warm, polished finish.',
    tools: 'DaVinci Resolve Studio',
    videoUrl: 'https://res.cloudinary.com/dlupqyzif/video/upload/v1781975409/Real_estate_01_ynt3up.mp4',
    thumbUrl: 'https://res.cloudinary.com/dlupqyzif/video/upload/w_600,h_1066,c_fill,so_2,q_auto/v1781975409/Real_estate_01_ynt3up.jpg',
    duration: 'Short Form'
  }
];

const VISIBLE_PROJECTS = PROJECTS;

/* ── DOM UTILITIES ── */
function qs(s, c = document) { return c.querySelector(s); }
function qsa(s, c = document) { return [...c.querySelectorAll(s)]; }
function safeText(str) { return document.createTextNode(str); }

/* ── STATE ── */
let currentLbIdx = 0;
let activeFilter = 'All';

/* ── 1. PRELOADER ── */
function initLoader() {
  const loader = qs('#loader');
  const lProg = qs('#loader-progress');
  if (!loader || !lProg) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 18;
    if (progress > 100) progress = 100;
    lProg.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => loader.remove(), 400);
      }, 200);
    }
  }, 50);

  // Mobile safety watchdog: ensure page is never stuck if throttled
  setTimeout(() => {
    if (document.contains(loader)) {
      clearInterval(interval);
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => loader.remove(), 300);
    }
  }, 1800);
}

/* ── 2. THEME CONTROLLER ── */
function initTheme() {
  const themeToggle = qs('#theme-toggle');
  const htmlEl = document.documentElement;
  let isLight = false;
  try { isLight = localStorage.getItem('theme') === 'light'; } catch {}

  function applyTheme(light) {
    isLight = light;
    if (light) htmlEl.setAttribute('data-theme', 'light');
    else htmlEl.removeAttribute('data-theme');
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch {}
  }

  applyTheme(isLight);
  themeToggle?.addEventListener('click', () => applyTheme(!isLight));
}
/* ── PORTFOLIO CARDS & RENDERING ── */
function buildCard(proj, index) {
  const card = document.createElement('div');
  card.className = 'work-card skeleton reveal delay-' + (index % 3);
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Play ${proj.title} edit`);

  // Thumbnail Image
  const img = document.createElement('img');
  img.className = 'wc-img skeleton-media';
  img.alt = `${proj.title} — ${proj.category}`;
  img.loading = 'lazy';
  img.src = proj.thumbUrl;

  img.onload = () => {
    card.classList.remove('skeleton');
    img.classList.add('loaded');
  };

  // Overlay & Content
  const overlay = document.createElement('div');
  overlay.className = 'wc-overlay';

  const cat = document.createElement('div');
  cat.className = 'wc-cat';
  cat.appendChild(safeText(proj.category));

  const title = document.createElement('h3');
  title.className = 'wc-title';
  title.appendChild(safeText(proj.title));

  const details = document.createElement('div');
  details.className = 'wc-details';

  const clientSpan = document.createElement('span');
  clientSpan.textContent = proj.client;

  const toolSpan = document.createElement('span');
  toolSpan.textContent = proj.tools;

  details.appendChild(clientSpan);
  details.appendChild(toolSpan);

  overlay.appendChild(cat);
  overlay.appendChild(title);
  overlay.appendChild(details);

  // Play Button
  const play = document.createElement('div');
  play.className = 'wc-play';
  play.textContent = '▶';

  card.appendChild(img);
  card.appendChild(overlay);
  card.appendChild(play);

  // Click & Keyboard Actions
  const fullIdx = VISIBLE_PROJECTS.findIndex(p => p.id === proj.id);
  card.addEventListener('click', () => openLb(fullIdx));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLb(fullIdx);
    }
  });

  return card;
}

function renderPortfolioGrid(filter = 'All') {
  const grid = qs('#portfolio-grid');
  if (!grid) return;

  grid.replaceChildren();
  const filtered = filter === 'All' ? VISIBLE_PROJECTS : VISIBLE_PROJECTS.filter(p => p.category === filter);

  filtered.forEach((p, i) => {
    grid.appendChild(buildCard(p, i));
  });

  setTimeout(initReveal, 40);
}

function initFilters() {
  const track = qs('#filter-track');
  if (!track) return;

  const allBtn = qs('.filter-btn[data-filter="All"]', track);
  if (allBtn) {
    allBtn.textContent = `All Reels (${VISIBLE_PROJECTS.length})`;
  }

  track.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    qsa('.filter-btn', track).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    activeFilter = btn.dataset.filter || 'All';
    renderPortfolioGrid(activeFilter);
  });
}

/* ── 6. CINEMATIC LIGHTBOX MODAL ── */
const lb = qs('#lightbox');
const lbVid = qs('#lb-video');

const lbVidWrap = qs('#lb-video-container');

let activeElementBeforeModal = null;

function openLb(idx) {
  if (idx < 0 || idx >= VISIBLE_PROJECTS.length) return;
  
  // Accessibility Control: Save focus location before opening modal dialog
  activeElementBeforeModal = document.activeElement;
  currentLbIdx = idx;
  const p = VISIBLE_PROJECTS[idx];

  const catEl = qs('#lb-cat');
  const titleEl = qs('#lb-title');
  const descEl = qs('#lb-desc');
  const clientEl = qs('#lb-client');
  const toolsEl = qs('#lb-tools');
  const formatEl = qs('#lb-format');
  const countEl = qs('#lb-count');

  if (catEl) catEl.textContent = p.category;
  if (titleEl) titleEl.textContent = p.title;
  if (descEl) descEl.textContent = p.description;
  if (clientEl) clientEl.textContent = p.client;
  if (toolsEl) toolsEl.textContent = p.tools;
  if (formatEl) formatEl.textContent = p.duration;
  if (countEl) countEl.textContent = `${idx + 1} / ${VISIBLE_PROJECTS.length}`;

  if (lbVid) {
    lbVid.style.display = 'block';
    lbVid.classList.remove('loaded');
    lbVidWrap?.classList.add('skeleton');
    lbVid.src = p.videoUrl;
    lbVid.poster = p.thumbUrl;
    lbVid.load();
    const onReady = () => {
      lbVid.classList.add('loaded');
      lbVidWrap?.classList.remove('skeleton');
      lbVid.play().catch(() => {});
    };
    lbVid.onloadeddata = onReady;
    lbVid.onerror = () => lbVidWrap?.classList.remove('skeleton');
  }

  lb?.classList.add('active');
  lb?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Set initial focus to close button
  setTimeout(() => qs('#lb-close')?.focus(), 60);
}

function closeLb() {
  lb?.classList.remove('active');
  lb?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lbVid) {
    lbVid.pause();
    lbVid.removeAttribute('src');
    lbVid.load();
    lbVid.style.display = 'block';
  }

  // Accessibility Control: Restore focus to triggering element
  if (activeElementBeforeModal && typeof activeElementBeforeModal.focus === 'function') {
    activeElementBeforeModal.focus();
  }
}

window.openLb = openLb;
window.closeLb = closeLb;

qs('#lb-close')?.addEventListener('click', closeLb);
qs('#lb-backdrop')?.addEventListener('click', closeLb);
qs('#lb-prev')?.addEventListener('click', () => openLb((currentLbIdx - 1 + VISIBLE_PROJECTS.length) % VISIBLE_PROJECTS.length));
qs('#lb-next')?.addEventListener('click', () => openLb((currentLbIdx + 1) % VISIBLE_PROJECTS.length));

document.addEventListener('keydown', e => {
  if (!lb?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') qs('#lb-prev')?.click();
  if (e.key === 'ArrowRight') qs('#lb-next')?.click();

  // Accessibility Control: Focus trap inside modal dialog
  if (e.key === 'Tab') {
    const focusable = qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', lb);
    if (focusable.length > 0) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

/* ── 7. NAVBAR SCROLLSPY & STICKY STATE ── */
function initScrollSpy() {
  const navbar = qs('#navbar');
  const navLinks = qsa('.nav-link');
  const sections = qsa('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky shadow & blur
    navbar?.classList.toggle('scrolled', scrollY > 50);

    // Active link highlighting
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 180;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }, { passive: true });
}

/* ── 8. MOBILE MENU ── */
function initMobileMenu() {
  const menuBtn = qs('#menu-btn');
  const mobMenu = qs('#mob-menu');
  const mobClose = qs('#mob-close');
  const mobLinks = qsa('.mob-link');

  function openMenu() {
    mobMenu?.classList.add('active');
    mobMenu?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobMenu?.classList.remove('active');
    mobMenu?.setAttribute('aria-hidden', 'true');
    if (!lb?.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  menuBtn?.addEventListener('click', openMenu);
  mobClose?.addEventListener('click', closeMenu);
  mobLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* ── 9. INTERACTIVE INQUIRY FORM ── */
function initInquiryForm() {
  const form = qs('#project-form');
  const formatPills = qsa('#format-pill-group .form-pill');
  const volumePills = qsa('#volume-pill-group .form-pill');
  const successMsg = qs('#form-success');

  // Pill Toggles
  function setupPills(pills) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  setupPills(formatPills);
  setupPills(volumePills);

  // Form Submit Handler
  form?.addEventListener('submit', e => {
    e.preventDefault();

    // Security Control: Validating and sanitizing inputs to prevent CRLF mail header injection
    const rawName = qs('#form-name')?.value || '';
    const cleanName = rawName.replace(/[\r\n]/g, ' ').trim().slice(0, 80);

    const rawEmail = qs('#form-email')?.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = emailRegex.test(rawEmail.trim()) ? rawEmail.trim().slice(0, 100) : '';

    const rawLink = qs('#form-link')?.value || '';
    const cleanLink = rawLink.replace(/[\r\n]/g, ' ').trim().slice(0, 200) || 'Not provided';

    const activeFormat = qs('#format-pill-group .form-pill.active')?.dataset.val || 'Short-Form';
    const activeVolume = qs('#volume-pill-group .form-pill.active')?.dataset.val || '12-16 videos';

    const rawNotes = qs('#form-notes')?.value || '';
    const cleanNotes = rawNotes.slice(0, 1200);

    if (!cleanEmail) {
      alert('Please enter a valid work email address.');
      return;
    }

    // Security Control: URL encode all components to prevent parameter injection
    const subject = encodeURIComponent(`Custom Offer Request: ${cleanName || 'New Creator'} (${activeFormat})`);
    const body = encodeURIComponent(
      `Hi Jaideep,\n\nI'm requesting a custom offer for video editing services.\n\n` +
      `• Name / Brand: ${cleanName || 'Not provided'}\n` +
      `• Work Email: ${cleanEmail}\n` +
      `• Channel / Social: ${cleanLink}\n` +
      `• Content Format: ${activeFormat}\n` +
      `• Target Monthly Volume: ${activeVolume}\n` +
      `• Project Goals & Scope:\n${cleanNotes}\n\n` +
      `Looking forward to receiving your custom proposal!`
    );

    const mailtoUrl = `mailto:jaideep.markam@gmail.com?subject=${subject}&body=${body}`;

if (successMsg) {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = mailtoUrl;
      fallbackLink.textContent = 'click here to launch mail';
      fallbackLink.className = 'mail-fallback-link';
      successMsg.replaceChildren(
        document.createTextNode('✓ Inquiry prepared! Opening your mail app... If it did not open automatically, '),
        fallbackLink,
        document.createTextNode('.')
      );
      successMsg.style.display = 'block';
    }

    // Launch immediately inside user gesture to avoid mobile browser popup blockers
    window.location.href = mailtoUrl;
  });
}

/* ── 10. MAGNETIC BUTTON INTERACTIONS ── */
function initMagneticButtons() {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  qsa('.magnetic').forEach(btn => {
    let ticking = false;
    btn.addEventListener('mousemove', e => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
}

/* ── 11. SCROLL REVEAL OBSERVER ── */
function initReveal() {
  const revealElements = qsa('.reveal:not(.in)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

/* ── 12. SMOOTH SCROLL ENGINE FOR ALL BUTTONS & LINKS ── */
function initSmoothScroll() {
  // Handle all internal anchor buttons and links
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = qs(hash);
      if (target) {
        e.preventDefault();

        // If mobile drawer is open, close it first and restore scroll
        const mobMenu = qs('#mob-menu');
        if (mobMenu?.classList.contains('active')) {
          mobMenu.classList.remove('active');
          mobMenu.setAttribute('aria-hidden', 'true');
          if (!lb?.classList.contains('active')) {
            document.body.style.overflow = '';
          }
        }

        // Calculate offset with fixed floating navbar (90px desktop, 75px mobile)
        const navOffset = window.innerWidth <= 768 ? 75 : 90;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth'
        });

        // Update active nav link highlighting
        qsa('.nav-link').forEach(nl => {
          nl.classList.toggle('active', nl.getAttribute('href') === hash);
        });

        if (history.pushState) {
          history.pushState(null, null, hash);
        }
      }
    });
  });
}

/* ── DOM READY INITIALIZATION ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  renderPortfolioGrid('All');
  initFilters();
  initScrollSpy();
  initMobileMenu();
  initInquiryForm();
  initMagneticButtons();
  initSmoothScroll();
  setTimeout(initReveal, 200);
});


