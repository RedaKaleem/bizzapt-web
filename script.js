import { resolveChallenge } from './connections-data.mjs?v=spec-1';


// Shared accessibility foundations for every page.
const pageMain = document.querySelector('main');
if (pageMain) {
  pageMain.id ||= 'main-content';
  pageMain.tabIndex = -1;
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = `#${pageMain.id}`;
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
  }
}
document.querySelectorAll('.noise, .page-atmosphere, .contact-art').forEach((item) => item.setAttribute('aria-hidden', 'true'));
document.querySelectorAll('button:not([type])').forEach((button) => { button.type = 'button'; });
document.querySelectorAll('a[target="_blank"]').forEach((link) => { link.rel = 'noopener noreferrer'; });
document.querySelectorAll('img').forEach((image) => {
  image.decoding ||= 'async';
  if (!image.closest('.site-header, .site-footer, dialog, .hero') && !image.hasAttribute('loading')) image.loading = 'lazy';
});
document.querySelectorAll('.desktop-nav').forEach((nav, index) => {
  nav.id ||= `primary-navigation-${index + 1}`;
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.querySelectorAll('a').forEach((link) => {
    const linkPage = new URL(link.href, location.href).pathname.split('/').pop() || 'index.html';
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    if (linkPage === currentPage) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
});

document.querySelectorAll('#year, .current-year').forEach((item) => { item.textContent = String(new Date().getFullYear()); });

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.desktop-nav');
if (menuToggle && navigation) {
  menuToggle.setAttribute('aria-controls', navigation.id);
  const closeMenu = ({ returnFocus = false } = {}) => {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.textContent = 'MENU';
    if (returnFocus) menuToggle.focus();
  };
  menuToggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuToggle.textContent = open ? 'CLOSE' : 'MENU';
    if (open) navigation.querySelector('a')?.focus();
  });
  navigation.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu({ returnFocus: true }); });
  document.addEventListener('click', (event) => { if (navigation.classList.contains('is-open') && !event.target.closest('.site-header')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMenu(); });
}

const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
const serviceWorlds = [...document.querySelectorAll('[data-service-world]')];
function activateService(id) {
  if (!serviceTabs.length) return;
  serviceTabs.forEach((tab) => {
    const active = tab.dataset.serviceTab === id;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  serviceWorlds.forEach((world) => {
    const active = world.dataset.serviceWorld === id;
    world.classList.toggle('active', active);
    world.hidden = !active;
  });
}
serviceTabs.forEach((tab, index) => {
  const id = tab.dataset.serviceTab;
  const panel = serviceWorlds.find((world) => world.dataset.serviceWorld === id);
  tab.id ||= `service-tab-${id}`;
  tab.setAttribute('aria-controls', id);
  if (panel) {
    panel.id = id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
  }
  tab.addEventListener('click', () => {
    activateService(id);
    history.replaceState(null, '', `#${id}`);
  });
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % serviceTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + serviceTabs.length) % serviceTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = serviceTabs.length - 1;
    serviceTabs[next].click();
    serviceTabs[next].focus();
  });
});
if (serviceTabs.length) {
  activateService(resolveChallenge(location.hash));
  window.addEventListener('hashchange', () => {
    activateService(resolveChallenge(location.hash));
  });
}

const folders = [...document.querySelectorAll('[data-folder]')];
folders.forEach((folder) => {
  const trigger = folder.querySelector('.folder-summary');
  const reveal = folder.querySelector('.folder-reveal');
  const folderId = `folder-${folders.indexOf(folder) + 1}-content`;
  if (reveal) reveal.id = folderId;
  if (reveal) reveal.inert = true;
  trigger.setAttribute('aria-controls', folderId);
  trigger.addEventListener('click', () => {
    const opening = !folder.classList.contains('is-open');
    folders.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.folder-summary').setAttribute('aria-expanded', 'false');
      item.querySelector('.folder-summary b').textContent = 'OPEN FOLDER +';
      const itemReveal = item.querySelector('.folder-reveal');
      if (itemReveal) itemReveal.inert = true;
    });
    if (opening) {
      folder.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.querySelector('b').textContent = 'CLOSE FOLDER −';
      if (reveal) reveal.inert = false;
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
if (projectForm) projectForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!projectForm.reportValidity()) return;

  const submitButton = projectForm.querySelector('[type="submit"]');
  const status = projectForm.querySelector('#form-status');
  const defaultLabel = submitButton?.dataset.defaultLabel || 'SEND PROJECT BRIEF';
  const setButtonLabel = (label, arrow = '') => {
    if (submitButton) submitButton.innerHTML = `${label}${arrow ? ` <span>${arrow}</span>` : ''}`;
  };

  status.hidden = true;
  status.className = 'form-status';
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  setButtonLabel('SENDING…');

  try {
    const response = await fetch(projectForm.action, {
      method: 'POST',
      body: new FormData(projectForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = result.errors?.map((error) => error.message).join(' ') || 'We couldn’t send your brief. Please check the form and try again.';
      throw new Error(message);
    }

    projectForm.reset();
    status.textContent = 'Message received. Thank you for sharing what you’re trying to solve. We’ll be in touch.';
    status.classList.add('is-success');
    status.hidden = false;
    setButtonLabel('MESSAGE SENT', '✓');
  } catch (error) {
    status.textContent = error.message || 'Something went wrong. Please try again or email bizzaptenterprises@gmail.com.';
    status.classList.add('is-error');
    status.hidden = false;
    setButtonLabel(defaultLabel, '↗');
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
  }
});

document.querySelectorAll('.site-header .brand').forEach((brand) => {
  if (!brand.querySelector('.brand-lockup')) {
    brand.setAttribute('aria-label', 'Bizzapt home');
    brand.innerHTML = '<img class="brand-lockup" src="assets/brand-logo-light-v2.png" alt="Bizzapt">';
  }
});

const footerSocialProfiles = [
  { href: 'https://www.instagram.com/bizzaptenterprises/', label: 'Bizzapt on Instagram' },
  { href: 'https://www.linkedin.com/in/bizzapt-enterprises', label: 'Bizzapt on LinkedIn' },
  { href: 'https://www.facebook.com/profile.php?id=61592254697537', label: 'Bizzapt on Facebook' }
];
document.querySelectorAll('.social-links').forEach((socialGroup) => {
  socialGroup.querySelectorAll('button').forEach((button, index) => {
    const profile = footerSocialProfiles[index];
    if (!profile) return;
    const link = document.createElement('a');
    link.href = profile.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', profile.label);
    link.innerHTML = button.innerHTML;
    button.replaceWith(link);
  });
  const placeholderNote = socialGroup.nextElementSibling;
  if (placeholderNote?.matches('small') && placeholderNote.textContent.includes('Social links')) placeholderNote.remove();
});

const livePreviewCards = [...document.querySelectorAll('[data-live-preview]')];

document.querySelectorAll('[data-project-slideshow]').forEach((card) => {
  const frame = card.querySelector('.project-slideshow');
  const slides = [...card.querySelectorAll('.project-slides img')];
  if (!frame || slides.length < 2) return;
  let index = 0;
  let timer;
  const showSlide = (next) => {
    index = next % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
  };
  const nextSlide = () => { stop(); showSlide(index + 1); };
  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || timer) return;
    card.classList.add('is-previewing');
    timer = window.setInterval(() => showSlide(index + 1), 1500);
  };
  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
    card.classList.remove('is-previewing');
  };
  frame.addEventListener('mouseenter', start);
  frame.addEventListener('mouseleave', stop);
  frame.addEventListener('focus', start);
  frame.addEventListener('blur', stop);
  frame.addEventListener('click', nextSlide);
  frame.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    nextSlide();
  });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => { if (event.matches) stop(); });
});

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
    const hint = visual.querySelector('i');
    if (hint) hint.textContent = 'OPEN PROJECT ↗';
  }, { once: true });
  card.classList.add('preview-loading');
  iframe.src = card.dataset.livePreview;
  const screen = document.createElement('div');
  screen.className = 'project-preview-window';
  screen.append(iframe);
  visual.prepend(screen);
  card.dataset.previewMounted = 'true';
  window.setTimeout(() => {
    if (!card.classList.contains('preview-ready')) {
      card.classList.remove('preview-loading');
      const hint = visual.querySelector('i');
      if (hint) hint.textContent = 'PREVIEW TAKING LONGER · OPEN PROJECT ↗';
    }
  }, 10000);
  const sizePreview = () => visual.style.setProperty('--preview-scale', Math.max(.18, screen.clientWidth / 1200).toFixed(4));
  sizePreview();
  if ('ResizeObserver' in window) new ResizeObserver(sizePreview).observe(visual);
}

if (livePreviewCards.length) {
  if ('IntersectionObserver' in window) {
    const previewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { mountLivePreview(entry.target); previewObserver.unobserve(entry.target); }
      });
    }, { rootMargin: '300px 0px' });
    livePreviewCards.forEach(card => previewObserver.observe(card));
  }

  livePreviewCards.forEach((card) => {
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

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    const status = button.closest('.form-note, .who-email-block')?.querySelector('.copy-status');
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
    window.setTimeout(() => { button.textContent = 'Copy email'; }, 1800);
  });
});
