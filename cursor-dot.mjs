if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.createElement('span');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);

  const darkGradients = '.floating-hero, .blog-feature, .projects-intro, .about-manifesto';
  let lastPoint;

  const backgroundTone = (element) => {
    for (let node = element; node; node = node.parentElement) {
      if (node.matches('.site-header')) return node.classList.contains('is-dark');
      const color = getComputedStyle(node).backgroundColor.match(/rgba?\(([^)]+)\)/);
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

  const updateSurface = () => {
    if (!lastPoint) return;
    const target = document.elementFromPoint(lastPoint.x, lastPoint.y);
    dot.classList.toggle('is-gold', target ? backgroundTone(target) : false);
    dot.classList.toggle('is-over-text', !!target?.closest('input, textarea, [contenteditable="true"]'));
    dot.classList.toggle('is-interactive', !!target?.closest('a, button, summary, select, [role="button"], [role="link"]'));
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    lastPoint = { x: event.clientX, y: event.clientY };
    const host = document.querySelector('dialog[open]') || document.body;
    if (dot.parentElement !== host) host.append(dot);
    dot.style.transform = `translate3d(${event.clientX - 3}px, ${event.clientY - 3}px, 0)`;
    updateSurface();
    dot.classList.add('is-visible');
    document.body.classList.add('has-custom-cursor');
  }, { passive: true });

  const hide = () => {
    dot.classList.remove('is-visible');
    document.body.classList.remove('has-custom-cursor');
  };
  document.addEventListener('pointerout', (event) => { if (!event.relatedTarget) hide(); });
  window.addEventListener('scroll', updateSurface, { passive: true });
  window.addEventListener('resize', updateSurface);
  window.addEventListener('blur', hide);
}
