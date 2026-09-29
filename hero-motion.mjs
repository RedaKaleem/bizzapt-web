// Positions represent the top-left of the entire symbol + label footprint.
export function isClear(x, y, width, height, bounds, reserved) {
  return x >= bounds.left && y >= bounds.top && x + width <= bounds.right && y + height <= bounds.bottom &&
    !(x < reserved.right && x + width > reserved.left && y < reserved.bottom && y + height > reserved.top);
}

export function advance(item, seconds, bounds, reserved) {
  const valid = (x, y) => isClear(x, y, item.width, item.height, bounds, reserved);
  const x = item.x + item.vx * seconds;
  if (valid(x, item.y)) item.x = x; else item.vx *= -1;
  const y = item.y + item.vy * seconds;
  if (valid(item.x, y)) item.y = y; else item.vy *= -1;
}

if (typeof document !== 'undefined') {
  const hero = document.querySelector('.floating-hero');
  if (hero) {
    const mobile = matchMedia('(max-width: 620px)');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const mark = hero.querySelector('.hero-brand-mark');
    const copy = hero.querySelector('.field-copy');
    const items = [...hero.querySelectorAll('.floating-module')].map((element, index) => ({
      element, index, x: 0, y: 0, vx: (index % 2 ? -1 : 1) * (10 + Math.random() * 6),
      vy: (index % 3 ? 1 : -1) * (6 + Math.random() * 5),
    }));
    let bounds, reserved, textBounds, frame = 0, previous = 0;
    const localRect = (element, base, padding = 0) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left - base.left - padding, right: rect.right - base.left + padding,
        top: rect.top - base.top - padding, bottom: rect.bottom - base.top + padding };
    };
    function paint(item) {
      item.element.style.transform = `translate3d(${item.x}px,${item.y}px,0)`;
      const behindText = item.x < textBounds.right && item.x + item.width > textBounds.left &&
        item.y < textBounds.bottom && item.y + item.height > textBounds.top;
      item.element.style.setProperty('--symbol-opacity', behindText ? '.12' : String(.40 + item.index % 3 * .09));
      const tooltipWidth = hero.clientWidth <= 620 ? 235 : 268;
      const center = Math.max(tooltipWidth / 2 + 12, Math.min(hero.clientWidth - tooltipWidth / 2 - 12, item.x + item.width / 2));
      item.element.style.setProperty('--detail-left', `${center - item.x}px`);
      item.element.classList.toggle('detail-above', item.y > hero.clientHeight - 245);
    }
    function layout() {
      if (mobile.matches) { sync(); return; }
      const base = hero.getBoundingClientRect();
      bounds = { left: 16, top: 28, right: base.width - 16, bottom: base.height - 95 };
      reserved = localRect(mark, base, 42);
      textBounds = localRect(copy, base, 20);
      // Mobile uses the spacious field above the copy; the mark stays unobstructed below it.
      if (base.width <= 620) bounds.bottom = Math.min(bounds.bottom, textBounds.top - 15);
      items.forEach(item => {
        item.width = item.element.offsetWidth;
        item.height = item.element.offsetHeight;
        const slots = [];
        for (let y = bounds.top; y + item.height <= bounds.bottom; y += item.height + (base.width <= 620 ? 18 : 25)) {
          for (let x = bounds.left; x + item.width <= bounds.right; x += item.width + (base.width <= 620 ? 18 : 30)) {
            if (isClear(x, y, item.width, item.height, bounds, reserved)) slots.push({ x, y });
          }
        }
        const slot = slots[Math.floor((item.index + .5) * slots.length / items.length)];
        item.element.hidden = !slot;
        if (slot) {
          const x = slot.x + Math.random() * 22;
          const y = slot.y + Math.random() * 18;
          const clear = isClear(x, y, item.width, item.height, bounds, reserved);
          item.x = clear ? x : slot.x; item.y = clear ? y : slot.y;
          paint(item);
        }
      });
      hero.classList.add('has-motion-layout');
      sync();
    }
    function tick(now) {
      const seconds = Math.min((now - previous) / 1000 || 0, .05);
      previous = now;
      items.forEach(item => {
        if (item.element.hidden || item.element.matches(':hover, :focus-within')) return;
        advance(item, seconds, bounds, reserved);
        paint(item);
      });
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!mobile.matches && !preference.matches && !document.hidden && !hero.classList.contains('is-paused') && !hero.classList.contains('is-outside')) frame = requestAnimationFrame(tick);
    }
    // Observe only the hero's pause/visibility classes, never per-frame symbol styles.
    new MutationObserver(sync).observe(hero, { attributes: true, attributeFilter: ['class'] });
    new ResizeObserver(layout).observe(hero);
    mark.addEventListener('load', layout);
    preference.addEventListener('change', sync);
    mobile.addEventListener('change', layout);
    document.addEventListener('visibilitychange', sync);
    layout();
  }
}
