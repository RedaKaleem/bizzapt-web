const cards = [...document.querySelectorAll('.flip-card')];

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const willOpen = !card.classList.contains('is-flipped');
    cards.forEach((item) => {
      item.classList.remove('is-flipped');
      item.setAttribute('aria-pressed', 'false');
    });
    if (willOpen) {
      card.classList.add('is-flipped');
      card.setAttribute('aria-pressed', 'true');
    }
  });
});

document.querySelectorAll('#year, .current-year').forEach((item) => { item.textContent = new Date().getFullYear(); });

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.desktop-nav');
if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'CLOSE' : 'MENU';
  });
}

const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
const serviceWorlds = [...document.querySelectorAll('[data-service-world]')];
function activateService(id) {
  if (!serviceTabs.length) return;
  serviceTabs.forEach((tab) => {
    const active = tab.dataset.serviceTab === id;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  serviceWorlds.forEach((world) => world.classList.toggle('active', world.dataset.serviceWorld === id));
}
serviceTabs.forEach((tab) => tab.addEventListener('click', () => {
  activateService(tab.dataset.serviceTab);
  history.replaceState(null, '', `#${tab.dataset.serviceTab}`);
}));
if (serviceTabs.length) activateService(location.hash.slice(1) || 'branding');

const folders = [...document.querySelectorAll('[data-folder]')];
folders.forEach((folder) => {
  const trigger = folder.querySelector('.folder-summary');
  trigger.addEventListener('click', () => {
    const opening = !folder.classList.contains('is-open');
    folders.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.folder-summary').setAttribute('aria-expanded', 'false');
      item.querySelector('.folder-summary b').textContent = 'OPEN FOLDER +';
    });
    if (opening) {
      folder.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.querySelector('b').textContent = 'CLOSE FOLDER −';
    }
  });
});

const partnerFilters = [...document.querySelectorAll('[data-partner-filter]')];
const partnerCards = [...document.querySelectorAll('[data-partner-type]')];
function filterPartners(filter) {
  partnerFilters.forEach((item) => {
    const active = item.dataset.partnerFilter === filter;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  partnerCards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.partnerType === filter;
    card.toggleAttribute('hidden', !visible);
    card.classList.toggle('is-filtered-out', !visible);
  });
}
partnerFilters.forEach((button) => button.addEventListener('click', () => filterPartners(button.dataset.partnerFilter)));
if (partnerFilters.length) filterPartners('all');

const projectForm = document.querySelector('#project-form');
if (projectForm) projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!projectForm.reportValidity()) return;
  const data = new FormData(projectForm);
  const subject = `New Bizzapt project enquiry — ${data.get('company') || data.get('name')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Company: ${data.get('company') || 'Not provided'}`,
    `Stage: ${data.get('stage')}`,
    `Service: ${data.get('service')}`,
    '',
    'Project goal:',
    data.get('goal')
  ].join('\n');
  window.location.href = `mailto:bizzaptenterprises@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll('.site-header .brand').forEach((brand) => {
  if (!brand.querySelector('.brand-lockup')) {
    brand.setAttribute('aria-label', 'Bizzapt home');
    brand.innerHTML = '<img class="brand-lockup" src="assets/brand-logo-light-v2.png" alt="Bizzapt Enterprises — Build, Grow, Scale">';
  }
});

const legacyFooter = document.querySelector('footer:not(.site-footer)');
if (legacyFooter) {
  legacyFooter.className = 'site-footer';
  legacyFooter.innerHTML = `<div class="footer-main"><a class="footer-logo" href="index.html" aria-label="Bizzapt Enterprises home"><img src="assets/brand-logo-dark.png" alt="Bizzapt Enterprises — Build, Grow, Scale"></a><div class="footer-column"><h2>Services</h2><a href="services.html#branding">Branding</a><a href="services.html#data">Data + AI</a><a href="services.html#web-design">Web Design</a><a href="services.html#web-development">Web Development</a></div><div class="footer-column"><h2>Explore</h2><a href="index.html">Home</a><a href="projects.html">Our Projects</a><a href="team.html">Team</a><a href="index.html#contact">Start a Project</a></div><div class="footer-connect"><h2>Stay connected</h2><a class="footer-email" href="mailto:bizzaptenterprises@gmail.com">bizzaptenterprises@gmail.com</a><div class="social-links" aria-label="Bizzapt social profiles"><button type="button" aria-label="Instagram profile link coming soon" title="Instagram link coming soon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg></button><button type="button" aria-label="LinkedIn profile link coming soon" title="LinkedIn link coming soon"><svg viewBox="0 0 24 24"><path d="M6 9v9M6 6v.01M10 18v-5a4 4 0 0 1 8 0v5M10 9v9"/></svg></button><button type="button" aria-label="Facebook profile link coming soon" title="Facebook link coming soon"><svg viewBox="0 0 24 24"><path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V2.3c-.7-.2-1.7-.3-3-.3-3 0-5 1.8-5 5v2H7v4h3v8"/></svg></button></div><small>Social links will be connected when supplied.</small></div></div><div class="footer-bottom"><p>Saudi Arabia · India · UAE & beyond</p><p>© <span class="current-year">${new Date().getFullYear()}</span> Bizzapt Enterprises</p><a href="#top">BACK TO TOP ↑</a></div>`;
}
document.querySelectorAll('.site-footer a[href="services.html#data"]').forEach((link) => { link.textContent = 'Data Analytics'; });

const livePreviewCards = [...document.querySelectorAll('[data-live-preview]')];
function mountLivePreview(card) {
  if (card.dataset.previewMounted === 'true') return;
  const visual = card.querySelector('.project-visual');
  if (!visual) return;
  const iframe = document.createElement('iframe');
  iframe.className = 'project-live-frame';
  iframe.title = `${card.querySelector('h2')?.textContent || 'Project'} live website preview`;
  iframe.loading = 'eager';
  iframe.tabIndex = -1;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.addEventListener('load', () => {
    card.classList.remove('preview-loading');
    card.classList.add('preview-ready');
  }, { once: true });
  card.classList.add('preview-loading');
  iframe.src = card.dataset.livePreview;
  visual.prepend(iframe);
  card.dataset.previewMounted = 'true';
  window.setTimeout(() => {
    if (card.dataset.previewMounted === 'true') card.classList.add('preview-ready');
  }, 1800);
  const sizePreview = () => visual.style.setProperty('--preview-scale', Math.max(.18, visual.clientWidth / 1200).toFixed(4));
  sizePreview();
  if ('ResizeObserver' in window) new ResizeObserver(sizePreview).observe(visual);
}

if (livePreviewCards.length) {
  const previewObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      mountLivePreview(entry.target);
      observer.unobserve(entry.target);
    }), { rootMargin: '700px 0px' })
    : null;
  livePreviewCards.forEach((card) => {
    if (previewObserver) previewObserver.observe(card);
    else mountLivePreview(card);
    card.addEventListener('mouseenter', () => {
      mountLivePreview(card);
      card.classList.add('is-previewing');
    });
    card.addEventListener('mouseleave', () => card.classList.remove('is-previewing'));
    card.addEventListener('focusin', () => {
      mountLivePreview(card);
      card.classList.add('is-previewing');
    });
    card.addEventListener('focusout', () => card.classList.remove('is-previewing'));
  });
}

const resourceLinks = [...document.querySelectorAll('.project-meta a, .research-card a')];
const resourceIcons = {
  web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7a9.3 9.3 0 0 0-2.9 18.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5A3.9 3.9 0 0 1 7 8c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.6 9.6 0 0 1 5.1 0c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.8c0 .3.2.6.7.5A9.3 9.3 0 0 0 12 2.7Z"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.5h8l4 4V21H6z"/><path d="M14 2.5v4h4M8.5 16v-5h2a1.6 1.6 0 0 1 0 3.2h-2M13 16v-5h1.5a2 2 0 0 1 2 2.5 2 2 0 0 1-2 2.5z"/></svg>'
};
resourceLinks.forEach((link) => {
  const actionLabel = link.textContent.trim();
  let type = 'web';
  try {
    const url = new URL(link.href, window.location.href);
    if (url.hostname.includes('github.com')) type = 'github';
    else if (url.pathname.toLowerCase().endsWith('.pdf')) type = 'pdf';
  } catch (_) { /* Retain the website type for relative links. */ }
  link.dataset.resourceType = type;
  link.setAttribute('aria-label', `${actionLabel} — ${type === 'github' ? 'GitHub repository' : type === 'pdf' ? 'PDF document' : 'live website'}`);
  link.innerHTML = `<span class="resource-icon">${resourceIcons[type]}</span><span class="resource-kind">${type === 'github' ? 'GITHUB' : type.toUpperCase()}</span><span class="resource-action">${actionLabel}</span>`;
});

const teamProfiles = {
  reda: {
    name: 'Reda Kaleem',
    handle: '@RedaKaleem',
    role: 'Founder & Lead Designer',
    image: 'https://avatars.githubusercontent.com/u/121916018?v=4',
    github: 'https://github.com/RedaKaleem',
    portfolio: 'https://new-port-tau-kohl.vercel.app/',
    repos: '25',
    location: 'India',
    focus: 'Design + Technology',
    bio: 'Community builder. Tech enthusiast. Creative systems thinker.',
    about: 'Reda guides Bizzapt’s identity, product direction, visual systems, and community relationships—connecting ambitious ideas with design and technology that people can understand and use.',
    skills: ['Brand direction', 'Product strategy', 'Web experiences', 'AI & data projects', 'Community building']
  },
  rayeesa: {
    name: 'Rayeesa Mahmood',
    handle: '@RayeesaMahmood',
    role: 'Founder & Website Creator',
    image: 'https://avatars.githubusercontent.com/u/151394585?v=4',
    github: 'https://github.com/RayeesaMahmood',
    portfolio: 'https://rayeesa-portfolio-xhyf.vercel.app/',
    repos: '24',
    location: 'Hyderabad',
    focus: 'AI + Web Development',
    bio: 'Computer-science graduate building useful AI and web experiences.',
    about: 'Rayeesa turns strategy into usable digital products, working across artificial intelligence, front-end development, interface thinking, and implementation for Bizzapt’s web experiences.',
    skills: ['Artificial intelligence', 'Web development', 'Interface design', 'Rapid prototyping', 'Technical research']
  }
};

const profileDialog = document.querySelector('#profile-dialog');
const profileButtons = [...document.querySelectorAll('[data-profile]')];
if (profileDialog && profileButtons.length) {
  const setText = (id, value) => { const node = profileDialog.querySelector(`#${id}`); if (node) node.textContent = value; };
  profileButtons.forEach((button) => button.addEventListener('click', () => {
    const profile = teamProfiles[button.dataset.profile];
    if (!profile) return;
    const image = profileDialog.querySelector('#profile-dialog-image');
    image.src = profile.image;
    image.alt = profile.name;
    setText('profile-dialog-name', profile.name);
    setText('profile-dialog-handle', profile.handle);
    setText('profile-dialog-role', profile.role);
    setText('profile-dialog-repos', profile.repos);
    setText('profile-dialog-location', profile.location);
    setText('profile-dialog-focus', profile.focus);
    setText('profile-dialog-bio', profile.bio);
    setText('profile-dialog-about', profile.about);
    const github = profileDialog.querySelector('#profile-dialog-github');
    const portfolio = profileDialog.querySelector('#profile-dialog-portfolio');
    github.href = profile.github;
    portfolio.href = profile.portfolio;
    profileDialog.querySelector('#profile-dialog-skills').innerHTML = profile.skills.map((skill) => `<li>${skill}</li>`).join('');
    profileDialog.showModal();
    document.body.classList.add('profile-modal-open');
  }));
  const closeProfile = () => {
    profileDialog.close();
    document.body.classList.remove('profile-modal-open');
  };
  profileDialog.querySelector('.profile-close').addEventListener('click', closeProfile);
  profileDialog.addEventListener('click', (event) => { if (event.target === profileDialog) closeProfile(); });
  profileDialog.addEventListener('close', () => document.body.classList.remove('profile-modal-open'));
}

document.querySelectorAll('.workspace-files > button').forEach((button) => {
  button.type = 'button';
  button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
  });
});

document.querySelectorAll('.project-card .project-visual').forEach((visual) => {
  const destination = visual.closest('.project-card')?.querySelector('.project-meta a');
  if (!destination) return;
  const projectName = visual.closest('.project-card')?.querySelector('.project-meta h2')?.textContent.trim() || 'project';
  visual.tabIndex = 0;
  visual.setAttribute('role', 'link');
  visual.setAttribute('aria-label', `Open ${projectName}`);
  visual.title = `Open ${projectName}`;
  const openDestination = () => {
    if (destination.target === '_blank') window.open(destination.href, '_blank', 'noopener,noreferrer');
    else window.location.href = destination.href;
  };
  visual.addEventListener('click', openDestination);
  visual.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openDestination();
  });
});

document.querySelectorAll('.social-links button[title*="coming soon"]').forEach((button) => {
  button.disabled = true;
  button.setAttribute('aria-disabled', 'true');
});

const whoDialog = document.querySelector('#who-dialog');
const whoTrigger = document.querySelector('.who-trigger');
if (whoDialog && whoTrigger) {
  const closeWhoDialog = () => whoDialog.close();
  whoTrigger.addEventListener('click', () => whoDialog.showModal());
  whoDialog.querySelector('.who-dialog-close')?.addEventListener('click', closeWhoDialog);
  whoDialog.addEventListener('click', (event) => { if (event.target === whoDialog) closeWhoDialog(); });
  whoDialog.querySelector('.who-dialog-cta')?.addEventListener('click', closeWhoDialog);
}

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    const status = button.closest('.who-email-block')?.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    button.textContent = 'COPIED ✓';
    if (status) status.textContent = 'Email copied to your clipboard.';
    window.setTimeout(() => { button.textContent = 'COPY'; }, 1800);
  });
});
