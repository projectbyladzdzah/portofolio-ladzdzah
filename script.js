/**
 * LADZDZAH DIGITAL PORTFOLIO & TELEMETRY CONTROL ROOM (CMS)
 * Comprehensive state-driven portfolio with dynamic live customization,
 * full CRUD operations, JSON import/export, and sleek F1 telemetry aesthetic.
 */

// ============================================================
// 1. DEFAULT PORTFOLIO DATA SCHEMA
// ============================================================
const DEFAULT_PORTFOLIO_DATA = {
  hero: {
    eyebrow: "AVAILABLE FOR DIGITAL PROJECTS",
    headline: "BUILD.<br><em>CREATE.</em><br>MOVE FAST.",
    subtitle: "Software Engineering graduate focused on web development, IT support, visual content, and practical digital solutions.",
    driverName: "LADZDZAH",
    driverRole: "SOFTWARE ENGINEERING",
    specs: [
      { label: "BASE", value: "PEKALONGAN" },
      { label: "EDU", value: "TELKOM UNIVERSITY" },
      { label: "GRAD", value: "2025" }
    ],
    photo: "assets/profile.jpg",
    telemetryBars: [
      { label: "WEB", percent: 88 },
      { label: "IT", percent: 92 },
      { label: "VISUAL", percent: 80 }
    ]
  },
  ticker: [
    "SOFTWARE ENGINEERING",
    "WEB DEVELOPMENT",
    "IT SUPPORT & NETWORKING",
    "SQL DATABASES",
    "VISUAL CONTENT & MEDIA",
    "PERFORMANCE OPTIMIZATION"
  ],
  about: {
    kicker: "ENGINEER × CREATOR",
    title: "Technical thinking.<br><span>Visual execution.</span>",
    bio: "A Software Engineering graduate with problem-solving and troubleshooting skills across hardware and software. Experienced with computer networks, SQL databases, Microsoft 365, Google Workspace, and communicating technical solutions to non-technical users.",
    skills: [
      "Windows & Linux",
      "Computer Hardware",
      "SQL & Databases",
      "Microsoft 365",
      "Google Workspace",
      "Adobe Creative Suite",
      "Canva",
      "Figma",
      "Video Editing",
      "Network Setup",
      "Administrative Operations"
    ]
  },
  projects: [
    {
      id: "proj_1",
      title: "School Employee Attendance Web",
      category: "web",
      year: "2025",
      description: "Attendance web project designed specifically for teachers and administrative employees at Lembaga Pendidikan SPS TPQ Al Ikhlas Lebakbarang. Streamlines daily check-ins, record logs, and institutional attendance reports.",
      tags: ["WEB", "INTERNAL SYSTEM", "PHP/SQL"],
      image: "",
      liveUrl: "",
      githubUrl: "https://github.com/Ladzdzah",
      featured: true
    },
    {
      id: "proj_2",
      title: "Visual Documentation & Coverage",
      category: "photo",
      year: "2024",
      description: "Photography and event coverage for organizational championships, school milestones, and social campaigns with modern framing and color grading.",
      tags: ["PHOTOGRAPHY", "LIGHTROOM", "VISUAL"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_3",
      title: "Student Organization Media & Video",
      category: "other",
      year: "2022–24",
      description: "Creative visual content, social media production, and video editing for Unit Kegiatan Mahasiswa Merpati Putih. Boosted digital engagement and community reach.",
      tags: ["VIDEO", "SOCIAL MEDIA", "PREMIERE PRO"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_4",
      title: "IT Support & Infrastructure Maintenance",
      category: "other",
      year: "2023–25",
      description: "Daily troubleshooting for workstations, laptops, network routers, printers, software deployment, hardware replacement, and system backups across the institution.",
      tags: ["HARDWARE", "NETWORKING", "TROUBLESHOOTING"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_5",
      title: "Administrative Operations & Document Archiving",
      category: "other",
      year: "2021–23",
      description: "Institutional correspondence, digitized record archiving, structured reporting, data entry, and digital workflow modernization using Microsoft 365 and cloud tools.",
      tags: ["DATA MANAGEMENT", "DOCUMENTS", "ADMINISTRATION"],
      image: "",
      liveUrl: "",
      githubUrl: "",
      featured: false
    },
    {
      id: "proj_6",
      title: "Database System & Digital Workflow",
      category: "web",
      year: "2024",
      description: "Relational database structuring, SQL data validation routines, and automated reporting workflows designed for internal administrative efficiency.",
      tags: ["SQL", "DATABASE DESIGN", "WORKFLOW"],
      image: "",
      liveUrl: "",
      githubUrl: "https://github.com/Ladzdzah",
      featured: false
    }
  ],
  experience: [
    {
      id: "exp_1",
      year: "2025",
      role: "PROJECT DONE — WEB ATTENDANCE",
      institution: "Lembaga Pendidikan SPS TPQ Al Ikhlas Lebakbarang",
      description: "Developed and deployed an employee attendance web application with secure logins, daily attendance tracking, and printable administrative summaries."
    },
    {
      id: "exp_2",
      year: "2023—2025",
      role: "IT SUPPORT & SYSTEM SPECIALIST",
      institution: "Lembaga Pendidikan SPS TPQ Al Ikhlas Lebakbarang",
      description: "Handled comprehensive hardware/software installation, troubleshooting, OS maintenance, networking configuration, and web institutional support."
    },
    {
      id: "exp_3",
      year: "2021—2023",
      role: "STAFF ADMINISTRASI",
      institution: "Lembaga Pendidikan SPS TPQ Al Ikhlas Lebakbarang",
      description: "Managed correspondence, official archiving, document formatting, procurement data, and institutional registry updates."
    },
    {
      id: "exp_4",
      year: "2022—2024",
      role: "SECRETARY & MEDIA STAFF",
      institution: "Unit Kegiatan Mahasiswa Merpati Putih",
      description: "Drafted proposals, managed member databases, produced visual documentation, and directed video content for events and social platforms."
    }
  ],
  stats: [
    { count: 23, label: "TOOLS & TECH ARSENAL" },
    { count: 4, label: "CORE FOCUS TRACKS" },
    { count: 3, label: "PODIUM AWARDS" },
    { count: 2025, label: "GRADUATION YEAR" }
  ],
  awards: [
    {
      id: "awd_1",
      year: "2023",
      title: "Juara 1 Indonesia Paku Bumi Open 11th International Championship",
      subtitle: "Kejuaraan Pencak Silat Tingkat Internasional"
    },
    {
      id: "awd_2",
      year: "2022",
      title: "Juara 1 Piala Rektor Unsoed Tingkat Jawa Tengah",
      subtitle: "Kejuaraan Pencak Silat Regional"
    },
    {
      id: "awd_3",
      year: "2018",
      title: "Juara 1 IPSI CUP Karesidenan Pekalongan",
      subtitle: "Kejuaraan Pencak Silat Antar Daerah"
    }
  ],
  contact: {
    heading: "LET'S BUILD<br><span>SOMETHING.</span>",
    description: "Ready to collaborate on software engineering, web platforms, IT systems, or creative media projects.",
    email: "ladzdzahhanannaafimufidz@gmail.com",
    phone: "085848253569",
    github: "github.com/Ladzdzah",
    linkedin: "https://linkedin.com/in/ladzdzah",
    base: "Pekalongan, Jawa Tengah"
  },
  security: {
    pinEnabled: false,
    pin: "1234"
  }
};

// Storage Key
const STORAGE_KEY = 'ladzdzah_portfolio_cms_v2';

// ============================================================
// 2. STATE MANAGER & PERSISTENCE
// ============================================================
let appState = loadAppData();
let activeFilter = 'all';
let isAdminUnlocked = false;

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    const parsed = JSON.parse(raw);
    // Deep merge to ensure newly introduced keys are always present
    return {
      ...DEFAULT_PORTFOLIO_DATA,
      ...parsed,
      hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
      about: { ...DEFAULT_PORTFOLIO_DATA.about, ...(parsed.about || {}) },
      contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
      security: { ...DEFAULT_PORTFOLIO_DATA.security, ...(parsed.security || {}) },
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
      experience: Array.isArray(parsed.experience) ? parsed.experience : DEFAULT_PORTFOLIO_DATA.experience,
      stats: Array.isArray(parsed.stats) ? parsed.stats : DEFAULT_PORTFOLIO_DATA.stats,
      awards: Array.isArray(parsed.awards) ? parsed.awards : DEFAULT_PORTFOLIO_DATA.awards,
      ticker: Array.isArray(parsed.ticker) ? parsed.ticker : DEFAULT_PORTFOLIO_DATA.ticker
    };
  } catch (err) {
    console.error('Failed to load local storage data:', err);
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  }
}

function saveAppData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('LocalStorage save error (likely quota exceeded):', e);
    showToast('Penyimpanan penuh! Kurangi ukuran gambar.', 'error');
  }
}

// ============================================================
// 3. TOAST NOTIFICATION UTILITY
// ============================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : '✕';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}

// ============================================================
// 4. MAIN DOM RENDERERS
// ============================================================
function renderAll() {
  renderHero();
  renderTicker();
  renderAbout();
  renderProjects();
  renderExperience();
  renderStats();
  renderAwards();
  renderContact();
  renderAdminPanelContent();
}

// 4.1 HERO & TELEMETRY CARD
function renderHero() {
  const h = appState.hero;
  const eyebrowEl = document.getElementById('heroEyebrow');
  if (eyebrowEl) eyebrowEl.innerHTML = `<span class="live-dot"></span> ${escapeHtml(h.eyebrow)}`;
  
  const headlineEl = document.getElementById('heroHeadline');
  if (headlineEl) headlineEl.innerHTML = h.headline;

  const subtitleEl = document.getElementById('heroSubtitle');
  if (subtitleEl) subtitleEl.textContent = h.subtitle;

  const driverNameEl = document.getElementById('driverName');
  if (driverNameEl) driverNameEl.textContent = h.driverName;

  const navBrandName = document.getElementById('navBrandName');
  if (navBrandName) navBrandName.textContent = h.driverName;

  const driverRoleEl = document.getElementById('driverRole');
  if (driverRoleEl) driverRoleEl.textContent = h.driverRole;

  const driverPhotoEl = document.getElementById('driverPhoto');
  if (driverPhotoEl) driverPhotoEl.src = h.photo || 'assets/profile.jpg';

  // Driver Specs
  const specsContainer = document.getElementById('driverSpecs');
  if (specsContainer && Array.isArray(h.specs)) {
    specsContainer.innerHTML = h.specs.map(s => `
      <span><b>${escapeHtml(s.label)}</b> ${escapeHtml(s.value)}</span>
    `).join('');
  }

  // Telemetry Skill Bars
  const barsContainer = document.getElementById('telemetryBars');
  if (barsContainer && Array.isArray(h.telemetryBars)) {
    barsContainer.innerHTML = h.telemetryBars.map(b => `
      <div class="bar-item">
        <span>${escapeHtml(b.label)}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${Math.min(100, Math.max(0, b.percent))}%"></div>
        </div>
        <b>${b.percent}</b>
      </div>
    `).join('');
  }
}

// 4.2 RUNNING TICKER
function renderTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = appState.ticker.length ? appState.ticker : ["SOFTWARE ENGINEERING", "WEB DEVELOPMENT"];
  // Duplicate array so marquee scrolls seamlessly without gaps
  const repeated = [...items, ...items, ...items, ...items];
  track.innerHTML = repeated.map(t => `
    <span>${escapeHtml(t)}</span><b>✦</b>
  `).join('');
}

// 4.3 ABOUT & SKILL BADGES
function renderAbout() {
  const a = appState.about;
  const kickerEl = document.getElementById('aboutKicker');
  if (kickerEl) kickerEl.textContent = a.kicker;

  const titleEl = document.getElementById('aboutTitle');
  if (titleEl) titleEl.innerHTML = a.title;

  const bioEl = document.getElementById('aboutBio');
  if (bioEl) bioEl.textContent = a.bio;

  const pillsContainer = document.getElementById('skillPills');
  if (pillsContainer) {
    pillsContainer.innerHTML = (a.skills || []).map(s => `
      <span>${escapeHtml(s)}</span>
    `).join('');
  }
}

// 4.4 PORTFOLIO PROJECTS
function renderProjects(filter = activeFilter) {
  activeFilter = filter;
  const grid = document.getElementById('portfolioGrid');
  const filterTabs = document.getElementById('filterTabs');
  const emptyState = document.getElementById('emptyState');
  if (!grid || !filterTabs) return;

  const projects = appState.projects;

  // Compute category counts
  const counts = { all: projects.length, web: 0, photo: 0, other: 0 };
  projects.forEach(p => {
    if (counts[p.category] !== undefined) counts[p.category]++;
    else counts.other++;
  });

  // Render Filter Tabs
  filterTabs.innerHTML = `
    <button class="filter ${filter === 'all' ? 'active' : ''}" data-filter="all">ALL <b>(${counts.all})</b></button>
    <button class="filter ${filter === 'web' ? 'active' : ''}" data-filter="web">WEB DEV <b>(${counts.web})</b></button>
    <button class="filter ${filter === 'photo' ? 'active' : ''}" data-filter="photo">FOTOGRAFI <b>(${counts.photo})</b></button>
    <button class="filter ${filter === 'other' ? 'active' : ''}" data-filter="other">LAINNYA <b>(${counts.other})</b></button>
  `;

  // Attach filter events
  filterTabs.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      renderProjects(btn.dataset.filter);
    });
  });

  // Filter project cards
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.add('show');
    return;
  }
  if (emptyState) emptyState.classList.remove('show');

  grid.innerHTML = filtered.map((p, idx) => {
    const isFeatured = p.featured ? 'featured' : '';
    const visualContent = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy"><div class="project-visual-overlay"></div>`
      : getVisualPlaceholder(p.category, idx);

    return `
      <article class="project-card ${isFeatured}" data-id="${p.id}" tabindex="0" role="button" aria-label="View project ${escapeHtml(p.title)}">
        <div class="project-visual">
          ${visualContent}
          <div class="project-inspect-tag">INSPECT TELEMETRY ↗</div>
        </div>
        <div class="project-meta">
          <span>${escapeHtml(p.category.toUpperCase())} / ${escapeHtml(p.year)}</span>
          <b>#0${idx + 1}</b>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="tags">
          ${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>
      </article>
    `;
  }).join('');

  // Attach click to open Project Detail Modal
  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projId = card.dataset.id;
      openProjectModal(projId);
    });
  });
}

function getVisualPlaceholder(category, index) {
  if (category === 'web') {
    return `<div style="font: 700 70px var(--display); color: var(--red); opacity: 0.15; transform: skew(-10deg);">&lt;/&gt;</div>
            <div style="position:absolute; bottom:20px; left:20px; font:700 13px var(--display); color:#fff; letter-spacing:1px;">WEB SYSTEM // #0${index + 1}</div>`;
  }
  if (category === 'photo') {
    return `<div style="width:100px; height:100px; border:8px solid #282834; border-radius:50%; box-shadow:0 0 0 10px #14141a;"></div>
            <div style="position:absolute; bottom:20px; left:20px; font:700 13px var(--display); color:var(--yellow); letter-spacing:1px;">VISUAL SHUTTER // #0${index + 1}</div>`;
  }
  return `<div style="font: 700 48px var(--display); color: #333342; letter-spacing:4px;">ENGINEER</div>
          <div style="position:absolute; bottom:20px; left:20px; font:700 13px var(--display); color:#888899; letter-spacing:1px;">OPERATION // #0${index + 1}</div>`;
}

// 4.5 EXPERIENCE TIMELINE
function renderExperience() {
  const container = document.getElementById('timelineList');
  if (!container) return;
  const list = appState.experience;
  container.innerHTML = list.map((item, i) => `
    <div class="timeline-item">
      <span class="year">${escapeHtml(item.year)}</span>
      <div>
        <span class="role">${escapeHtml(item.role)}</span>
        <h3>${escapeHtml(item.institution)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <span class="num">0${i + 1}</span>
    </div>
  `).join('');
}

// 4.6 STATS COUNTERS
function renderStats() {
  const container = document.getElementById('statsContainer');
  if (!container) return;
  container.innerHTML = appState.stats.map(s => `
    <div class="stat">
      <strong data-count="${s.count}">0</strong>
      <span>${escapeHtml(s.label)}</span>
    </div>
  `).join('');
  initCounterAnimations();
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count) || 0;
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

// 4.7 AWARDS & HIGHLIGHTS
function renderAwards() {
  const grid = document.getElementById('awardGrid');
  if (!grid) return;
  grid.innerHTML = appState.awards.map(a => `
    <div class="award-card">
      <span class="award-year">${escapeHtml(a.year)}</span>
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.subtitle)}</p>
    </div>
  `).join('');
}

// 4.8 CONTACT SECTION
function renderContact() {
  const c = appState.contact;
  const heading = document.getElementById('contactHeading');
  if (heading) heading.innerHTML = c.heading;

  const desc = document.getElementById('contactDesc');
  if (desc) desc.textContent = c.description;

  const linksContainer = document.getElementById('contactLinks');
  if (linksContainer) {
    linksContainer.innerHTML = `
      <a href="mailto:${escapeHtml(c.email)}" target="_blank" rel="noreferrer">
        <small>EMAIL DISPATCH</small>
        <b>${escapeHtml(c.email)} <span>↗</span></b>
      </a>
      <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noreferrer">
        <small>PHONE / WHATSAPP</small>
        <b>${escapeHtml(c.phone)} <span>↗</span></b>
      </a>
      <a href="${c.github.startsWith('http') ? c.github : 'https://' + c.github}" target="_blank" rel="noreferrer">
        <small>GITHUB REPOSITORY</small>
        <b>${escapeHtml(c.github)} <span>↗</span></b>
      </a>
      ${c.linkedin ? `
        <a href="${c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin}" target="_blank" rel="noreferrer">
          <small>LINKEDIN NETWORK</small>
          <b>${escapeHtml(c.linkedin)} <span>↗</span></b>
        </a>` : ''}
      <div class="contact-item">
        <small>BASE OF OPERATIONS</small>
        <b>${escapeHtml(c.base)}</b>
      </div>
    `;
  }

  const footerCopy = document.getElementById('footerCopyright');
  if (footerCopy) footerCopy.textContent = `© ${new Date().getFullYear()} ${appState.hero.driverName}`;
}

// ============================================================
// 5. PROJECT DETAIL MODAL (VISITOR INSPECTION)
// ============================================================
const projectModalBackdrop = document.getElementById('projectModalBackdrop');
const closeProjectModalBtn = document.getElementById('closeProjectModal');

function openProjectModal(projectId) {
  const project = appState.projects.find(p => p.id === projectId);
  if (!project || !projectModalBackdrop) return;

  document.getElementById('pmCategory').textContent = project.category.toUpperCase();
  document.getElementById('pmYear').textContent = project.year;
  document.getElementById('pmTitle').textContent = project.title;
  document.getElementById('pmDescription').textContent = project.description;

  const visualEl = document.getElementById('pmVisual');
  if (project.image) {
    visualEl.innerHTML = `<img src="${project.image}" alt="${escapeHtml(project.title)}">`;
  } else {
    visualEl.innerHTML = `<div style="display:grid; place-items:center; height:100%; font:700 24px var(--display); color:#666677;">NO IMAGE PREVIEW AVAILABLE</div>`;
  }

  const tagsEl = document.getElementById('pmTags');
  tagsEl.innerHTML = (project.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('');

  const liveBtn = document.getElementById('pmLiveLink');
  if (project.liveUrl) {
    liveBtn.style.display = 'inline-flex';
    liveBtn.href = project.liveUrl;
  } else {
    liveBtn.style.display = 'none';
  }

  const githubBtn = document.getElementById('pmGithubLink');
  if (project.githubUrl) {
    githubBtn.style.display = 'inline-flex';
    githubBtn.href = project.githubUrl;
  } else {
    githubBtn.style.display = 'none';
  }

  projectModalBackdrop.classList.add('show');
}

if (closeProjectModalBtn) {
  closeProjectModalBtn.addEventListener('click', () => projectModalBackdrop.classList.remove('show'));
}
if (projectModalBackdrop) {
  projectModalBackdrop.addEventListener('click', e => {
    if (e.target === projectModalBackdrop) projectModalBackdrop.classList.remove('show');
  });
}

// ============================================================
// 6. ADMIN CONTROL ROOM (CMS CONTROLLER)
// ============================================================
const adminPanel = document.getElementById('adminPanel');
const adminBackdrop = document.getElementById('adminBackdrop');
const openAdminBtn = document.getElementById('openAdmin');
const closeAdminBtn = document.getElementById('closeAdmin');
const mobileAdminBtn = document.getElementById('mobileAdminBtn');
const footerAdminLink = document.getElementById('footerAdminLink');
const quickEditHeroBtn = document.getElementById('quickEditHero');
const adminLockScreen = document.getElementById('adminLockScreen');
const adminPinForm = document.getElementById('adminPinForm');
const adminPinInput = document.getElementById('adminPinInput');

function setAdminOpen(open) {
  if (open) {
    if (appState.security.pinEnabled && !isAdminUnlocked) {
      adminLockScreen.style.display = 'flex';
      adminPinInput.value = '';
      setTimeout(() => adminPinInput.focus(), 200);
    } else {
      adminLockScreen.style.display = 'none';
      populateAdminForms();
    }
  }
  document.body.classList.toggle('admin-active', open);
  adminPanel.setAttribute('aria-hidden', String(!open));
}

[openAdminBtn, mobileAdminBtn, footerAdminLink, quickEditHeroBtn].forEach(btn => {
  if (btn) btn.addEventListener('click', () => setAdminOpen(true));
});
if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => setAdminOpen(false));
if (adminBackdrop) adminBackdrop.addEventListener('click', () => setAdminOpen(false));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    setAdminOpen(false);
    if (projectModalBackdrop) projectModalBackdrop.classList.remove('show');
    closeItemEditModal();
  }
});

// PIN Form Submit
if (adminPinForm) {
  adminPinForm.addEventListener('submit', e => {
    e.preventDefault();
    const entered = adminPinInput.value.trim();
    if (entered === appState.security.pin) {
      isAdminUnlocked = true;
      adminLockScreen.style.display = 'none';
      populateAdminForms();
      showToast('Control Room unlocked!', 'success');
    } else {
      showToast('PIN salah! Silakan coba lagi.', 'error');
      adminPinInput.value = '';
    }
  });
}

// Admin Tab Switching
const adminTabs = document.querySelectorAll('.admin-tab');
adminTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    adminTabs.forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const targetPane = document.getElementById(tab.dataset.tab);
    if (targetPane) targetPane.classList.add('active');
  });
});

// Helper to switch to specific tab programmatically
function switchAdminTab(tabId) {
  const tabBtn = document.querySelector(`.admin-tab[data-tab="${tabId}"]`);
  if (tabBtn) tabBtn.click();
}

// Populate all admin form inputs with active state
function populateAdminForms() {
  // Hero & Profile
  const formHero = document.getElementById('formHero');
  if (formHero) {
    formHero.heroEyebrow.value = appState.hero.eyebrow;
    formHero.heroHeadline.value = appState.hero.headline;
    formHero.heroSubtitle.value = appState.hero.subtitle;
    formHero.driverName.value = appState.hero.driverName;
    formHero.driverRole.value = appState.hero.driverRole;
    const baseSpec = appState.hero.specs.find(s => s.label === 'BASE') || { value: '' };
    const gradSpec = appState.hero.specs.find(s => s.label === 'GRAD') || { value: '' };
    const eduSpec = appState.hero.specs.find(s => s.label === 'EDU') || { value: '' };
    formHero.specBase.value = baseSpec.value;
    formHero.specGrad.value = gradSpec.value;
    formHero.specEdu.value = eduSpec.value;
    formHero.driverPhotoUrl.value = appState.hero.photo || '';
    const preview = document.querySelector('#profileImgPreview img');
    if (preview) preview.src = appState.hero.photo || 'assets/profile.jpg';
    renderAdminTelemetryBars();
  }

  // About
  const formAbout = document.getElementById('formAbout');
  if (formAbout) {
    formAbout.aboutKicker.value = appState.about.kicker;
    formAbout.aboutTitle.value = appState.about.title;
    formAbout.aboutBio.value = appState.about.bio;
    formAbout.skillPillsInput.value = (appState.about.skills || []).join(', ');
  }

  // Projects list in Admin
  renderAdminProjectsList();

  // Experience list in Admin
  renderAdminExperienceList();

  // Stats & Ticker
  const formStats = document.getElementById('formStats');
  if (formStats) {
    formStats.tickerInput.value = (appState.ticker || []).join(', ');
    renderAdminStatsList();
  }

  // Awards list in Admin
  renderAdminAwardsList();

  // Contact
  const formContact = document.getElementById('formContact');
  if (formContact) {
    formContact.contactHeading.value = appState.contact.heading;
    formContact.contactDesc.value = appState.contact.description;
    formContact.contactEmail.value = appState.contact.email;
    formContact.contactPhone.value = appState.contact.phone;
    formContact.contactGithub.value = appState.contact.github;
    formContact.contactLinkedin.value = appState.contact.linkedin || '';
    formContact.contactBase.value = appState.contact.base;
  }

  // Backup & Security
  const pinToggle = document.getElementById('togglePinEnabled');
  if (pinToggle) pinToggle.checked = !!appState.security.pinEnabled;
}

// 6.1 FORM HERO SUBMIT
const formHero = document.getElementById('formHero');
if (formHero) {
  formHero.addEventListener('submit', e => {
    e.preventDefault();
    appState.hero.eyebrow = formHero.heroEyebrow.value.trim();
    appState.hero.headline = formHero.heroHeadline.value.trim();
    appState.hero.subtitle = formHero.heroSubtitle.value.trim();
    appState.hero.driverName = formHero.driverName.value.trim();
    appState.hero.driverRole = formHero.driverRole.value.trim();
    appState.hero.specs = [
      { label: 'BASE', value: formHero.specBase.value.trim() },
      { label: 'EDU', value: formHero.specEdu.value.trim() },
      { label: 'GRAD', value: formHero.specGrad.value.trim() }
    ];

    if (formHero.driverPhotoUrl.value.trim()) {
      appState.hero.photo = formHero.driverPhotoUrl.value.trim();
    }

    // Save telemetry bars
    const barInputs = document.querySelectorAll('.admin-telemetry-bar-row');
    const newBars = [];
    barInputs.forEach(row => {
      const label = row.querySelector('.bar-label').value.trim();
      const percent = parseInt(row.querySelector('.bar-pct').value, 10) || 50;
      if (label) newBars.push({ label, percent: Math.min(100, Math.max(0, percent)) });
    });
    appState.hero.telemetryBars = newBars;

    saveAppData();
    renderHero();
    showToast('Hero & Profil berhasil disimpan!', 'success');
  });
}

// Photo file upload handler with canvas downscale
const profilePhotoFile = document.getElementById('profilePhotoFile');
if (profilePhotoFile) {
  profilePhotoFile.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 600, 0.8);
      appState.hero.photo = dataUrl;
      const preview = document.querySelector('#profileImgPreview img');
      if (preview) preview.src = dataUrl;
      const urlInput = document.querySelector('[name="driverPhotoUrl"]');
      if (urlInput) urlInput.value = '';
      saveAppData();
      renderHero();
      showToast('Foto profil diperbarui!', 'success');
    } catch (err) {
      showToast('Gagal memproses foto', 'error');
    }
  });
}

// Telemetry Bars Dynamic Editor
function renderAdminTelemetryBars() {
  const container = document.getElementById('adminTelemetryBarsList');
  if (!container) return;
  container.innerHTML = (appState.hero.telemetryBars || []).map((b, idx) => `
    <div class="admin-telemetry-bar-row form-row-2 mt-2" style="align-items:center;">
      <div class="form-group mb-0">
        <input type="text" class="bar-label" value="${escapeHtml(b.label)}" placeholder="Label (e.g. WEB)">
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="number" class="bar-pct" value="${b.percent}" min="0" max="100" style="width:80px;">
        <button type="button" class="btn btn-ghost btn-sm text-danger" onclick="removeTelemetryBar(${idx})">✕</button>
      </div>
    </div>
  `).join('');
}

window.removeTelemetryBar = function(idx) {
  appState.hero.telemetryBars.splice(idx, 1);
  renderAdminTelemetryBars();
};

const btnAddTelemetryBar = document.getElementById('btnAddTelemetryBar');
if (btnAddTelemetryBar) {
  btnAddTelemetryBar.addEventListener('click', () => {
    appState.hero.telemetryBars.push({ label: 'NEW SKILL', percent: 75 });
    renderAdminTelemetryBars();
  });
}

// 6.2 FORM ABOUT SUBMIT
const formAbout = document.getElementById('formAbout');
if (formAbout) {
  formAbout.addEventListener('submit', e => {
    e.preventDefault();
    appState.about.kicker = formAbout.aboutKicker.value.trim();
    appState.about.title = formAbout.aboutTitle.value.trim();
    appState.about.bio = formAbout.aboutBio.value.trim();
    const skillsRaw = formAbout.skillPillsInput.value;
    appState.about.skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    saveAppData();
    renderAbout();
    showToast('About & Skills berhasil disimpan!', 'success');
  });
}

// 6.3 PROJECTS CRUD IN ADMIN
function renderAdminProjectsList() {
  const container = document.getElementById('adminProjectsList');
  if (!container) return;
  if (!appState.projects.length) {
    container.innerHTML = `<p class="hint-text">Belum ada project. Tambahkan sekarang!</p>`;
    return;
  }
  container.innerHTML = appState.projects.map((p, idx) => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <strong>${escapeHtml(p.title)}</strong>
        <small>${escapeHtml(p.category.toUpperCase())} • ${escapeHtml(p.year)} ${p.featured ? '• ★ FEATURED' : ''}</small>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn-action-edit" onclick="openEditProjectModal('${p.id}')">EDIT</button>
        <button type="button" class="btn-action-del" onclick="deleteProject('${p.id}')">HAPUS</button>
      </div>
    </div>
  `).join('');
}

window.deleteProject = function(id) {
  if (confirm('Yakin ingin menghapus project ini?')) {
    appState.projects = appState.projects.filter(p => p.id !== id);
    saveAppData();
    renderProjects();
    renderAdminProjectsList();
    showToast('Project dihapus.', 'warning');
  }
};

// 6.4 EXPERIENCE CRUD IN ADMIN
function renderAdminExperienceList() {
  const container = document.getElementById('adminExperienceList');
  if (!container) return;
  if (!appState.experience.length) {
    container.innerHTML = `<p class="hint-text">Belum ada pengalaman terdaftar.</p>`;
    return;
  }
  container.innerHTML = appState.experience.map((e, idx) => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <strong>${escapeHtml(e.institution)}</strong>
        <small>${escapeHtml(e.role)} • ${escapeHtml(e.year)}</small>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn-action-edit" onclick="openEditExpModal('${e.id}')">EDIT</button>
        <button type="button" class="btn-action-del" onclick="deleteExp('${e.id}')">HAPUS</button>
      </div>
    </div>
  `).join('');
}

window.deleteExp = function(id) {
  if (confirm('Hapus riwayat pengalaman ini?')) {
    appState.experience = appState.experience.filter(e => e.id !== id);
    saveAppData();
    renderExperience();
    renderAdminExperienceList();
    showToast('Pengalaman dihapus.', 'warning');
  }
};

// 6.5 STATS & TICKER SUBMIT
const formStats = document.getElementById('formStats');
if (formStats) {
  formStats.addEventListener('submit', e => {
    e.preventDefault();
    const rawTicker = formStats.tickerInput.value;
    appState.ticker = rawTicker.split(',').map(t => t.trim()).filter(Boolean);

    const statRows = document.querySelectorAll('.admin-stat-row');
    const newStats = [];
    statRows.forEach(row => {
      const count = parseInt(row.querySelector('.stat-count').value, 10) || 0;
      const label = row.querySelector('.stat-label').value.trim();
      if (label) newStats.push({ count, label });
    });
    appState.stats = newStats;

    saveAppData();
    renderTicker();
    renderStats();
    showToast('Stats & Ticker berhasil disimpan!', 'success');
  });
}

function renderAdminStatsList() {
  const container = document.getElementById('adminStatsList');
  if (!container) return;
  container.innerHTML = appState.stats.map((s, idx) => `
    <div class="admin-stat-row form-row-2 mt-2" style="align-items:center;">
      <div class="form-group mb-0" style="flex:1;">
        <input type="text" class="stat-label" value="${escapeHtml(s.label)}" placeholder="Label">
      </div>
      <div style="display:flex; gap:8px; align-items:center; width:130px;">
        <input type="number" class="stat-count" value="${s.count}" style="width:90px;">
        <button type="button" class="btn btn-ghost btn-sm text-danger" onclick="removeStatItem(${idx})">✕</button>
      </div>
    </div>
  `).join('');
}

window.removeStatItem = function(idx) {
  appState.stats.splice(idx, 1);
  renderAdminStatsList();
};

const btnAddStatItem = document.getElementById('btnAddStatItem');
if (btnAddStatItem) {
  btnAddStatItem.addEventListener('click', () => {
    appState.stats.push({ count: 10, label: 'NEW METRIC' });
    renderAdminStatsList();
  });
}

// 6.6 AWARDS CRUD IN ADMIN
function renderAdminAwardsList() {
  const container = document.getElementById('adminAwardsList');
  if (!container) return;
  if (!appState.awards.length) {
    container.innerHTML = `<p class="hint-text">Belum ada penghargaan terdaftar.</p>`;
    return;
  }
  container.innerHTML = appState.awards.map((a, idx) => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <strong>${escapeHtml(a.title)}</strong>
        <small>${escapeHtml(a.year)} • ${escapeHtml(a.subtitle)}</small>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn-action-edit" onclick="openEditAwardModal('${a.id}')">EDIT</button>
        <button type="button" class="btn-action-del" onclick="deleteAward('${a.id}')">HAPUS</button>
      </div>
    </div>
  `).join('');
}

window.deleteAward = function(id) {
  if (confirm('Hapus pencapaian ini?')) {
    appState.awards = appState.awards.filter(a => a.id !== id);
    saveAppData();
    renderAwards();
    renderAdminAwardsList();
    showToast('Pencapaian dihapus.', 'warning');
  }
};

// 6.7 CONTACT SUBMIT
const formContact = document.getElementById('formContact');
if (formContact) {
  formContact.addEventListener('submit', e => {
    e.preventDefault();
    appState.contact.heading = formContact.contactHeading.value.trim();
    appState.contact.description = formContact.contactDesc.value.trim();
    appState.contact.email = formContact.contactEmail.value.trim();
    appState.contact.phone = formContact.contactPhone.value.trim();
    appState.contact.github = formContact.contactGithub.value.trim();
    appState.contact.linkedin = formContact.contactLinkedin.value.trim();
    appState.contact.base = formContact.contactBase.value.trim();

    saveAppData();
    renderContact();
    showToast('Kontak berhasil disimpan!', 'success');
  });
}

// 6.8 BACKUP, RESTORE & SECURITY
const togglePinEnabled = document.getElementById('togglePinEnabled');
if (togglePinEnabled) {
  togglePinEnabled.addEventListener('change', () => {
    appState.security.pinEnabled = togglePinEnabled.checked;
    saveAppData();
    showToast(`PIN ${appState.security.pinEnabled ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
  });
}

const btnSavePin = document.getElementById('btnSavePin');
const newPinInput = document.getElementById('newPinInput');
if (btnSavePin && newPinInput) {
  btnSavePin.addEventListener('click', () => {
    const val = newPinInput.value.trim();
    if (!val) {
      showToast('Masukkan PIN baru terlebih dahulu', 'error');
      return;
    }
    appState.security.pin = val;
    saveAppData();
    newPinInput.value = '';
    showToast('PIN berhasil diubah!', 'success');
  });
}

// Export JSON
const btnExportJson = document.getElementById('btnExportJson');
if (btnExportJson) {
  btnExportJson.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `ladzdzah_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Cadangan data JSON berhasil didownload!', 'success');
  });
}

// Import JSON
const importJsonInput = document.getElementById('importJsonInput');
if (importJsonInput) {
  importJsonInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
        appState = { ...DEFAULT_PORTFOLIO_DATA, ...parsed };
        saveAppData();
        renderAll();
        showToast('Data berhasil diimpor & dimuat ulang!', 'success');
      } catch (err) {
        showToast('File JSON tidak valid!', 'error');
      }
    };
    reader.readAsText(file);
    importJsonInput.value = '';
  });
}

// Reset to Defaults
const btnResetDefault = document.getElementById('btnResetDefault');
if (btnResetDefault) {
  btnResetDefault.addEventListener('click', () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data website ke pengaturan awal? Semua data yang diubah akan hilang.')) {
      appState = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
      saveAppData();
      renderAll();
      showToast('Data berhasil direset ke pengaturan default.', 'warning');
    }
  });
}

// ============================================================
// 7. ITEM EDIT MODAL CONTROLLER (FOR PROJECT, EXP, AWARD)
// ============================================================
const itemEditModalBackdrop = document.getElementById('itemEditModalBackdrop');
const closeItemEditModalBtn = document.getElementById('closeItemEditModal');
const itemEditModalTitle = document.getElementById('itemEditModalTitle');
const itemEditModalBody = document.getElementById('itemEditModalBody');

function closeItemEditModal() {
  if (itemEditModalBackdrop) itemEditModalBackdrop.classList.remove('show');
}
if (closeItemEditModalBtn) closeItemEditModalBtn.addEventListener('click', closeItemEditModal);
if (itemEditModalBackdrop) {
  itemEditModalBackdrop.addEventListener('click', e => {
    if (e.target === itemEditModalBackdrop) closeItemEditModal();
  });
}

// 7.1 PROJECT MODAL (ADD / EDIT)
window.openEditProjectModal = function(id = null) {
  const isNew = !id;
  const project = isNew
    ? { id: 'proj_' + Date.now(), title: '', category: 'web', year: new Date().getFullYear().toString(), description: '', tags: [], image: '', liveUrl: '', githubUrl: '', featured: false }
    : appState.projects.find(p => p.id === id);

  if (!project) return;
  itemEditModalTitle.textContent = isNew ? '+ TAMBAH PROYEK BARU' : 'EDIT PROYEK';

  itemEditModalBody.innerHTML = `
    <form id="projectEditForm">
      <div class="form-group">
        <label>JUDUL PROYEK</label>
        <input type="text" name="title" value="${escapeHtml(project.title)}" required placeholder="e.g. Website Presensi Pegawai">
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label>KATEGORI</label>
          <select name="category">
            <option value="web" ${project.category === 'web' ? 'selected' : ''}>Web Developer</option>
            <option value="photo" ${project.category === 'photo' ? 'selected' : ''}>Fotografer / Visual</option>
            <option value="other" ${project.category === 'other' ? 'selected' : ''}>Lainnya / IT Support</option>
          </select>
        </div>
        <div class="form-group">
          <label>TAHUN</label>
          <input type="text" name="year" value="${escapeHtml(project.year)}" required>
        </div>
      </div>
      <div class="form-group">
        <label>DESKRIPSI LENGKAP</label>
        <textarea name="description" rows="4" required placeholder="Jelaskan peran dan fitur proyek...">${escapeHtml(project.description)}</textarea>
      </div>
      <div class="form-group">
        <label>TAGS (Pisahkan dengan koma)</label>
        <input type="text" name="tags" value="${escapeHtml((project.tags || []).join(', '))}" placeholder="WEB, SQL, INTERNAL">
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label>LINK LIVE DEMO (Opsional)</label>
          <input type="url" name="liveUrl" value="${escapeHtml(project.liveUrl || '')}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>LINK GITHUB / REPO (Opsional)</label>
          <input type="url" name="githubUrl" value="${escapeHtml(project.githubUrl || '')}" placeholder="https://github.com/...">
        </div>
      </div>

      <div class="form-group">
        <label>GAMBAR PROYEK</label>
        <div class="image-uploader-wrapper">
          <div class="image-preview" id="projectImgPreview">
            ${project.image ? `<img src="${project.image}">` : `<div style="display:grid;place-items:center;height:100%;font-size:10px;color:#666;">NO IMG</div>`}
          </div>
          <div class="uploader-controls">
            <input type="file" id="projectImgFile" accept="image/*">
            <small>Upload gambar atau isi URL gambar di bawah:</small>
            <input type="text" name="imageUrl" value="${escapeHtml(project.image || '')}" placeholder="URL Gambar (https://...)">
          </div>
        </div>
      </div>

      <div class="form-group">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" name="featured" ${project.featured ? 'checked' : ''} style="width:auto;">
          <span>Tandai sebagai Featured Project (tampilan lebar 2 kolom)</span>
        </label>
      </div>

      <button type="submit" class="btn btn-red w-100 mt-3">SIMPAN PROYEK ✓</button>
    </form>
  `;

  // Local image file upload within project modal
  let localUploadedImg = project.image || '';
  const imgFileInput = document.getElementById('projectImgFile');
  if (imgFileInput) {
    imgFileInput.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        localUploadedImg = await compressImageFile(file, 900, 0.8);
        document.getElementById('projectImgPreview').innerHTML = `<img src="${localUploadedImg}">`;
        document.querySelector('[name="imageUrl"]').value = '';
      } catch (err) {
        showToast('Gagal memproses gambar', 'error');
      }
    });
  }

  const editForm = document.getElementById('projectEditForm');
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(editForm);
    const updated = {
      id: project.id,
      title: fd.get('title').trim(),
      category: fd.get('category'),
      year: fd.get('year').trim(),
      description: fd.get('description').trim(),
      tags: fd.get('tags').split(',').map(t => t.trim()).filter(Boolean),
      liveUrl: fd.get('liveUrl').trim(),
      githubUrl: fd.get('githubUrl').trim(),
      image: fd.get('imageUrl').trim() || localUploadedImg,
      featured: fd.get('featured') === 'on'
    };

    if (isNew) {
      appState.projects.unshift(updated);
    } else {
      const idx = appState.projects.findIndex(p => p.id === project.id);
      if (idx !== -1) appState.projects[idx] = updated;
    }

    saveAppData();
    renderProjects();
    renderAdminProjectsList();
    closeItemEditModal();
    showToast(isNew ? 'Proyek baru ditambahkan!' : 'Proyek berhasil diupdate!', 'success');
  });

  itemEditModalBackdrop.classList.add('show');
};

// 7.2 EXPERIENCE MODAL (ADD / EDIT)
window.openEditExpModal = function(id = null) {
  const isNew = !id;
  const exp = isNew
    ? { id: 'exp_' + Date.now(), year: new Date().getFullYear().toString(), role: '', institution: '', description: '' }
    : appState.experience.find(e => e.id === id);

  if (!exp) return;
  itemEditModalTitle.textContent = isNew ? '+ TAMBAH PENGALAMAN' : 'EDIT PENGALAMAN';

  itemEditModalBody.innerHTML = `
    <form id="expEditForm">
      <div class="form-row-2">
        <div class="form-group">
          <label>PERIODE / TAHUN</label>
          <input type="text" name="year" value="${escapeHtml(exp.year)}" required placeholder="e.g. 2023—2025">
        </div>
        <div class="form-group">
          <label>POSISI / ROLE</label>
          <input type="text" name="role" value="${escapeHtml(exp.role)}" required placeholder="e.g. IT SUPPORT">
        </div>
      </div>
      <div class="form-group">
        <label>INSTITUSI / PERUSAHAAN / ORGANISASI</label>
        <input type="text" name="institution" value="${escapeHtml(exp.institution)}" required placeholder="e.g. Lembaga Pendidikan...">
      </div>
      <div class="form-group">
        <label>DESKRIPSI TUGAS & PENCAPAIAN</label>
        <textarea name="description" rows="4" required placeholder="Jelaskan kontribusi Anda...">${escapeHtml(exp.description)}</textarea>
      </div>
      <button type="submit" class="btn btn-red w-100 mt-3">SIMPAN PENGALAMAN ✓</button>
    </form>
  `;

  const editForm = document.getElementById('expEditForm');
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(editForm);
    const updated = {
      id: exp.id,
      year: fd.get('year').trim(),
      role: fd.get('role').trim(),
      institution: fd.get('institution').trim(),
      description: fd.get('description').trim()
    };

    if (isNew) {
      appState.experience.unshift(updated);
    } else {
      const idx = appState.experience.findIndex(item => item.id === exp.id);
      if (idx !== -1) appState.experience[idx] = updated;
    }

    saveAppData();
    renderExperience();
    renderAdminExperienceList();
    closeItemEditModal();
    showToast('Pengalaman berhasil disimpan!', 'success');
  });

  itemEditModalBackdrop.classList.add('show');
};

// 7.3 AWARDS MODAL (ADD / EDIT)
window.openEditAwardModal = function(id = null) {
  const isNew = !id;
  const award = isNew
    ? { id: 'awd_' + Date.now(), year: new Date().getFullYear().toString(), title: '', subtitle: '' }
    : appState.awards.find(a => a.id === id);

  if (!award) return;
  itemEditModalTitle.textContent = isNew ? '+ TAMBAH PENGHARGAAN' : 'EDIT PENGHARGAAN';

  itemEditModalBody.innerHTML = `
    <form id="awardEditForm">
      <div class="form-group">
        <label>TAHUN PENGHARGAAN</label>
        <input type="text" name="year" value="${escapeHtml(award.year)}" required placeholder="e.g. 2024">
      </div>
      <div class="form-group">
        <label>NAMA PENGHARGAAN / JUARA</label>
        <input type="text" name="title" value="${escapeHtml(award.title)}" required placeholder="e.g. Juara 1 Kejuaraan...">
      </div>
      <div class="form-group">
        <label>SUBTITLE / KETERANGAN / PENYELENGGARA</label>
        <input type="text" name="subtitle" value="${escapeHtml(award.subtitle)}" required placeholder="e.g. Kejuaraan Nasional...">
      </div>
      <button type="submit" class="btn btn-red w-100 mt-3">SIMPAN PENGHARGAAN ✓</button>
    </form>
  `;

  const editForm = document.getElementById('awardEditForm');
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(editForm);
    const updated = {
      id: award.id,
      year: fd.get('year').trim(),
      title: fd.get('title').trim(),
      subtitle: fd.get('subtitle').trim()
    };

    if (isNew) {
      appState.awards.unshift(updated);
    } else {
      const idx = appState.awards.findIndex(item => item.id === award.id);
      if (idx !== -1) appState.awards[idx] = updated;
    }

    saveAppData();
    renderAwards();
    renderAdminAwardsList();
    closeItemEditModal();
    showToast('Penghargaan berhasil disimpan!', 'success');
  });

  itemEditModalBackdrop.classList.add('show');
};

// Quick action buttons in sections
const quickAddProjectBtn = document.getElementById('quickAddProjectBtn');
if (quickAddProjectBtn) {
  quickAddProjectBtn.addEventListener('click', () => {
    setAdminOpen(true);
    switchAdminTab('tab-projects');
    openEditProjectModal(null);
  });
}
const emptyAddBtn = document.getElementById('emptyAddBtn');
if (emptyAddBtn) {
  emptyAddBtn.addEventListener('click', () => {
    setAdminOpen(true);
    switchAdminTab('tab-projects');
    openEditProjectModal(null);
  });
}

const quickAddExpBtn = document.getElementById('quickAddExpBtn');
if (quickAddExpBtn) {
  quickAddExpBtn.addEventListener('click', () => {
    setAdminOpen(true);
    switchAdminTab('tab-experience');
    openEditExpModal(null);
  });
}

const quickAddAwardBtn = document.getElementById('quickAddAwardBtn');
if (quickAddAwardBtn) {
  quickAddAwardBtn.addEventListener('click', () => {
    setAdminOpen(true);
    switchAdminTab('tab-awards');
    openEditAwardModal(null);
  });
}

const btnOpenAddProjectModal = document.getElementById('btnOpenAddProjectModal');
if (btnOpenAddProjectModal) btnOpenAddProjectModal.addEventListener('click', () => openEditProjectModal(null));

const btnOpenAddExpModal = document.getElementById('btnOpenAddExpModal');
if (btnOpenAddExpModal) btnOpenAddExpModal.addEventListener('click', () => openEditExpModal(null));

const btnOpenAddAwardModal = document.getElementById('btnOpenAddAwardModal');
if (btnOpenAddAwardModal) btnOpenAddAwardModal.addEventListener('click', () => openEditAwardModal(null));

// ============================================================
// 8. UTILITIES: IMAGE COMPRESSOR & MOBILE MENU
// ============================================================
function compressImageFile(file, maxDimension = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxDimension / img.width, maxDimension / img.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
if (mobileMenuBtn && mobileDrawer) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });
  mobileDrawer.querySelectorAll('.m-link').forEach(link => {
    link.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  });
  if (mobileAdminBtn) {
    mobileAdminBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      setAdminOpen(true);
    });
  }
}

// Scroll Reveal Observer
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

function initScrollReveals() {
  document.querySelectorAll('.section, .timeline-item, .stat, .award-card, .contact-panel').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

// ============================================================
// 9. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  initScrollReveals();
});
