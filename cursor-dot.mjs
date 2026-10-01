// A small companion to the native cursor; the native pointer and text caret remain usable.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.createElement('span');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);

  const darkGradients = '.floating-hero, .blog-feature, .projects-intro, .about-manifesto';
  let lastPoint;
  const backgroundTone = (element) => {
    for (let node = element; node; node = node.parentElement) {
      if (node === dot) continue;
      if (node.matches('.site-header')) return node.classList.contains('is-dark');
      const style = getComputedStyle(node);
      const color = style.backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (color) {
        const channels = color[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
        if (channels.length < 4 || channels[3] >= .75) {
          const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
          return luminance < 140;
        }
      }
      if (node.matches(darkGradients)) return true;
    }
    return false;
  };

  const updateTone = () => {
    if (!lastPoint) return;
    const target = document.elementFromPoint(lastPoint.x, lastPoint.y);
    dot.classList.toggle('is-gold', target ? backgroundTone(target) : false);
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    lastPoint = { x: event.clientX, y: event.clientY };
    const dialog = document.querySelector('dialog[open]');
    const host = dialog || document.body;
    if (dot.parentElement !== host) host.append(dot);
    updateTone();
    dot.style.transform = `translate3d(${event.clientX + 12}px, ${event.clientY + 12}px, 0)`;
    dot.classList.add('is-visible');
  }, { passive: true });

  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) dot.classList.remove('is-visible');
  });
  window.addEventListener('scroll', updateTone, { passive: true });
  window.addEventListener('resize', updateTone);
  window.addEventListener('blur', () => dot.classList.remove('is-visible'));
}
