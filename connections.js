import { accomplishmentByChallenge } from './connections-data.mjs?v=spec-1';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const floatingHero = document.querySelector('.floating-hero');
if (floatingHero) {
  const toggle = floatingHero.querySelector('.field-motion-toggle');
  toggle.addEventListener('click', () => {
    const paused = floatingHero.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('[data-motion-control-label]').textContent = paused ? 'Resume motion' : 'Pause motion';
  });
  floatingHero.querySelectorAll('.floating-module').forEach(module => {
    const link = module.querySelector('[data-solution]');
    const restore = () => module.classList.remove('is-dismissed');
    link.addEventListener('pointerenter', restore);
    link.addEventListener('focus', restore);
    link.addEventListener('keydown', event => {
      if (event.key === 'Escape') module.classList.add('is-dismissed');
    });
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = [...document.querySelectorAll('[data-node]')].find(node => node.dataset.node === link.dataset.solution);
      if (!target) return;
      event.preventDefault();
      if (!target.closest?.('details')?.open) target.click();
      document.querySelector('#ecosystem').scrollIntoView({ behavior: motionPreference.matches ? 'auto' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    });
  });
  let inView = true;
  const syncVisibility = () => floatingHero.classList.toggle('is-outside', !inView || document.hidden);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncVisibility();
  }).observe(floatingHero);
  document.addEventListener('visibilitychange', syncVisibility);
}
// Carry a visitor's chosen challenge into the existing form, without storing it.
const accomplishment = document.querySelector('select[name="accomplishment"]');
if (accomplishment) {
  const challenge = new URLSearchParams(location.search).get('challenge');
  if (accomplishmentByChallenge[challenge]) accomplishment.value = accomplishmentByChallenge[challenge];
}
