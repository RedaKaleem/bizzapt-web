// A small companion to the native cursor; the native pointer and text caret remain usable.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.createElement('span');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);

  const darkGradients = '.floating-hero, .blog-feature, .projects-intro, .about-manifesto';
  let lastPoint;
  let drawnPoint;
  let frame = 0;
  let previousFrameTime = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

  const draw = (time) => {
    frame = 0;
    if (!lastPoint || !drawnPoint) return;
    const targetX = lastPoint.x + 12;
    const targetY = lastPoint.y + 12;
    const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 48) : 16.67;
    previousFrameTime = time;
    const easing = reducedMotion.matches ? 1 : 1 - Math.pow(.76, elapsed / 16.67);
    drawnPoint.x += (targetX - drawnPoint.x) * easing;
    drawnPoint.y += (targetY - drawnPoint.y) * easing;
    if (Math.abs(targetX - drawnPoint.x) < .15) drawnPoint.x = targetX;
    if (Math.abs(targetY - drawnPoint.y) < .15) drawnPoint.y = targetY;
    dot.style.transform = `translate3d(${drawnPoint.x}px, ${drawnPoint.y}px, 0)`;
    if (drawnPoint.x !== targetX || drawnPoint.y !== targetY) frame = requestAnimationFrame(draw);
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    lastPoint = { x: event.clientX, y: event.clientY };
    const dialog = document.querySelector('dialog[open]');
    const host = dialog || document.body;
    if (dot.parentElement !== host) host.append(dot);
    updateTone();
    drawnPoint ||= { x: event.clientX + 12, y: event.clientY + 12 };
    if (!frame) frame = requestAnimationFrame(draw);
    dot.classList.add('is-visible');
  }, { passive: true });

  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) {
      dot.classList.remove('is-visible');
      drawnPoint = undefined;
      previousFrameTime = 0;
    }
  });
  window.addEventListener('scroll', updateTone, { passive: true });
  window.addEventListener('resize', updateTone);
  window.addEventListener('blur', () => dot.classList.remove('is-visible'));
}
