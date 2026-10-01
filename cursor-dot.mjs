if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.createElement('span');
  const halo = document.createElement('span');
  dot.className = 'cursor-dot';
  halo.className = 'cursor-halo';
  dot.setAttribute('aria-hidden', 'true');
  halo.setAttribute('aria-hidden', 'true');
  document.body.append(halo, dot);

  const darkGradients = '.floating-hero, .blog-feature, .projects-intro, .about-manifesto';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let lastPoint;
  let haloPoint;
  let frame = 0;
  let previousFrameTime = 0;

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
    const gold = target ? backgroundTone(target) : false;
    const overText = !!target?.closest('input, textarea, [contenteditable="true"]');
    dot.classList.toggle('is-gold', gold);
    halo.classList.toggle('is-gold', gold);
    dot.classList.toggle('is-over-text', overText);
    halo.classList.toggle('is-over-text', overText);
  };

  const drawHalo = (time) => {
    frame = 0;
    if (!lastPoint || !haloPoint) return;
    const targetX = lastPoint.x - 13.5;
    const targetY = lastPoint.y - 13.5;
    const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 48) : 16.67;
    previousFrameTime = time;
    const easing = reducedMotion.matches ? 1 : 1 - Math.pow(.76, elapsed / 16.67);
    haloPoint.x += (targetX - haloPoint.x) * easing;
    haloPoint.y += (targetY - haloPoint.y) * easing;
    if (Math.abs(targetX - haloPoint.x) < .15) haloPoint.x = targetX;
    if (Math.abs(targetY - haloPoint.y) < .15) haloPoint.y = targetY;
    halo.style.transform = `translate3d(${haloPoint.x}px, ${haloPoint.y}px, 0)`;
    if (haloPoint.x !== targetX || haloPoint.y !== targetY) frame = requestAnimationFrame(drawHalo);
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    lastPoint = { x: event.clientX, y: event.clientY };
    const host = document.querySelector('dialog[open]') || document.body;
    if (dot.parentElement !== host) host.append(halo, dot);
    dot.style.transform = `translate3d(${event.clientX - 4.5}px, ${event.clientY - 4.5}px, 0)`;
    haloPoint ||= { x: event.clientX - 13.5, y: event.clientY - 13.5 };
    if (!frame) frame = requestAnimationFrame(drawHalo);
    updateSurface();
    dot.classList.add('is-visible');
    halo.classList.add('is-visible');
    document.body.classList.add('has-custom-cursor');
  }, { passive: true });

  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) {
      dot.classList.remove('is-visible');
      halo.classList.remove('is-visible');
      document.body.classList.remove('has-custom-cursor');
      haloPoint = undefined;
      previousFrameTime = 0;
    }
  });
  window.addEventListener('scroll', updateSurface, { passive: true });
  window.addEventListener('resize', updateSurface);
  window.addEventListener('blur', () => {
    dot.classList.remove('is-visible');
    halo.classList.remove('is-visible');
    document.body.classList.remove('has-custom-cursor');
  });
}
