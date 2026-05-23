/* ============================================================
   PRJ CARE FOUNDATION — V2 Main JavaScript
   ============================================================ */

/* ─── AOS INIT ─── */
AOS.init({
  duration: 700,
  once: true,
  easing: 'ease-out-cubic',
  offset: 60,
});

/* ─── SWIPER CAROUSEL ─── */
const mainSwiper = new Swiper('.mainSwiper', {
  loop: true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  effect: 'slide',
  speed: 700,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  grabCursor: true,
  keyboard: { enabled: true },
});

/* ─── NAVBAR SCROLL BEHAVIOUR ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

/* ─── STATS COUNTER ANIMATION ─── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats-bar');
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

/* ─── EVENTS GRID POPULATION ─── */
async function loadEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  try {
    const res = await fetch('data/events.json');
    const data = await res.json();

    // Show the first 6 events
    const featured = data.events.slice(0, 6);
    grid.innerHTML = '';

    featured.forEach((event, i) => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String(i * 80));

      // Format date
      const dateStr = event.date ? formatDate(event.date) : 'Ongoing';

      // Image or emoji fallback
      const imgHtml = event.image
        ? `<img src="${event.image}" alt="${escapeHtml(event.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${getCatEmoji(event.category)}</span>'" />`
        : `<span>${getCatEmoji(event.category)}</span>`;

      card.innerHTML = `
        <div class="event-card-img">${imgHtml}</div>
        <div class="event-card-body">
          <span class="event-card-cat">${escapeHtml(event.category)}</span>
          <h3 class="event-card-title">${escapeHtml(event.title)}</h3>
          <p class="event-card-date">📅 ${dateStr}</p>
          <p class="event-card-desc">${escapeHtml(event.description || event.caption || '')}</p>
        </div>
      `;

      grid.appendChild(card);
    });

    // Re-init AOS for dynamically added elements
    AOS.refresh();

  } catch (err) {
    console.warn('Events could not be loaded:', err);
    // Fallback: show placeholder cards
    grid.innerHTML = generateFallbackCards();
    AOS.refresh();
  }
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (_) {
    return dateStr;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getCatEmoji(category) {
  const map = {
    education:    '📚',
    celebrations: '🎉',
    festivals:    '🎊',
    health:       '🏥',
    community:    '🤝',
    national:     '🇮🇳',
    awareness:    '💡',
    spiritual:    '🙏',
  };
  return map[(category || '').toLowerCase()] || '🌸';
}

function generateFallbackCards() {
  const fallback = [
    { title: 'Yoga Day Event', category: 'Health', date: '2025-05-18', desc: 'Community yoga session bringing everyone together for health and wellness.' },
    { title: 'Holi Celebration', category: 'Festivals', date: '2025-03-14', desc: 'Colourful Holi celebrations with children and community members.' },
    { title: "Mother's Day", category: 'Celebrations', date: '2025-05-11', desc: 'Celebrating the spirit of motherhood with a beautiful programme.' },
    { title: 'Educational Classes', category: 'Education', date: '2025-04-01', desc: 'Free classes conducted for underprivileged children in Dwarka.' },
    { title: 'Cancer Awareness Drive', category: 'Health', date: '2025-02-18', desc: 'Cervical cancer awareness at Manipal Hospital, Dwarka Sector-6.' },
    { title: 'Birthday Celebration', category: 'Celebrations', date: '2024-12-20', desc: 'Monthly birthday celebrations for children at PRJ Care Foundation.' },
  ];
  return fallback.map((e, i) => `
    <div class="event-card" data-aos="fade-up" data-aos-delay="${i * 80}">
      <div class="event-card-img"><span>${getCatEmoji(e.category.toLowerCase())}</span></div>
      <div class="event-card-body">
        <span class="event-card-cat">${e.category}</span>
        <h3 class="event-card-title">${e.title}</h3>
        <p class="event-card-date">📅 ${formatDate(e.date)}</p>
        <p class="event-card-desc">${e.desc}</p>
      </div>
    </div>
  `).join('');
}

loadEvents();

/* ─── FOOTER FORM SUBMISSION ─── */
const footerForm = document.getElementById('footerForm');
if (footerForm) {
  footerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = footerForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Sent!';
    btn.style.background = '#2d6a4f';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      footerForm.reset();
    }, 3000);
  });
}

/* ─── SMOOTH REVEAL for hero on load ─── */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(30px)';
    hero.style.transition = 'opacity 1s ease, transform 1s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      });
    });
  }
});

/* ─── ACTIVE NAV LINK HIGHLIGHTING ─── */
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

/* ─── UPI PAYMENT MODAL ─── */
const UPI_ID   = 'prjcarefoundation6@oksbi';
const UPI_NAME = 'EKUM Foundation';

function openUpiModal(amount, tierNote) {
  const modal      = document.getElementById('upiModal');
  const amountEl   = document.getElementById('upiModalAmount');
  const tierEl     = document.getElementById('upiModalTier');
  const qrImg      = document.getElementById('upiQrImg');
  const payLink    = document.getElementById('upiPayLink');

  // Set display
  amountEl.textContent = '₹' + amount.toLocaleString('en-IN');
  tierEl.textContent   = tierNote;

  // Build UPI deep link
  const note    = encodeURIComponent(tierNote);
  const name    = encodeURIComponent(UPI_NAME);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;

  payLink.href = upiLink;

  // Generate QR code via free API (encodes the UPI deep link)
  const qrData = encodeURIComponent(upiLink);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=12&color=2c1810&bgcolor=fefcf3&data=${qrData}`;
  qrImg.alt = 'UPI QR Code for ' + UPI_ID;

  // Reset copy button
  const copyBtn = document.getElementById('upiCopyBtn');
  copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
  copyBtn.style.background = '';
  copyBtn.style.color = '';

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeUpiModal() {
  const modal = document.getElementById('upiModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function copyUpiId() {
  navigator.clipboard.writeText(UPI_ID).then(() => {
    const btn = document.getElementById('upiCopyBtn');
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    btn.style.background = '#2d6a4f';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
      btn.style.background = '';
      btn.style.color = '';
    }, 2500);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = UPI_ID;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// Close modal on overlay click
document.getElementById('upiModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeUpiModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeUpiModal();
});
