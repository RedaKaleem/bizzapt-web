// Positions represent the top-left of each symbol and label footprint.
export function overlaps(x, y, width, height, other, gap = 0) {
  return x < other.x + other.width + gap && x + width + gap > other.x &&
    y < other.y + other.height + gap && y + height + gap > other.y;
}

export function isClear(x, y, width, height, bounds, reserved, peers = [], gap = 0) {
  return x >= bounds.left && y >= bounds.top && x + width <= bounds.right && y + height <= bounds.bottom &&
    !(x < reserved.right && x + width > reserved.left && y < reserved.bottom && y + height > reserved.top) &&
    peers.every(peer => !overlaps(x, y, width, height, peer, gap));
}

export function advance(item, seconds, bounds, reserved, peers = [], gap = 0) {
  const valid = (x, y) => isClear(x, y, item.width, item.height, bounds, reserved, peers, gap);
  const x = item.x + item.vx * seconds;
  if (valid(x, item.y)) item.x = x; else item.vx *= -1;
  const y = item.y + item.vy * seconds;
  if (valid(item.x, y)) item.y = y; else item.vy *= -1;
}

export function findPosition(item, preferred, bounds, reserved, peers, gap = 18) {
  let best;
  let score = Infinity;
  const step = 12;
  for (let y = bounds.top; y + item.height <= bounds.bottom; y += step) {
    for (let x = bounds.left; x + item.width <= bounds.right; x += step) {
      if (!isClear(x, y, item.width, item.height, bounds, reserved, peers, gap)) continue;
      const distance = (x - preferred.x) ** 2 + (y - preferred.y) ** 2;
      if (distance < score) { best = { x, y }; score = distance; }
    }
  }
  return best;
}

if (typeof document !== 'undefined') {
  const hero = document.querySelector('.floating-hero');
  if (hero) {
    const mobile = matchMedia('(max-width: 620px)');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const mark = hero.querySelector('.hero-brand-mark');
    const copy = hero.querySelector('.field-copy');
    const items = [...hero.querySelectorAll('.floating-module')].map((element, index) => ({
      element, index, x: 0, y: 0, vx: (index % 2 ? -1 : 1) * (8 + Math.random() * 5),
      vy: (index % 3 ? 1 : -1) * (5 + Math.random() * 4),
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
      item.element.style.setProperty('--symbol-opacity', behindText ? '.22' : String(.52 + item.index % 3 * .08));
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
      const placed = [];
      items.forEach(item => {
        item.width = item.element.offsetWidth;
        item.height = item.element.offsetHeight;
        const percentX = parseFloat(item.element.style.getPropertyValue('--home-x')) / 100;
        const percentY = parseFloat(item.element.style.getPropertyValue('--home-y')) / 100;
        const preferred = {
          x: base.width * percentX - item.width / 2,
          y: base.height * percentY - item.height / 2,
        };
        const slot = findPosition(item, preferred, bounds, reserved, placed, 24) ||
          findPosition(item, preferred, bounds, reserved, placed, 10);
        item.element.hidden = !slot;
        if (slot) {
          item.x = slot.x;
          item.y = slot.y;
          placed.push(item);
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
        const peers = items.filter(other => other !== item && !other.element.hidden);
        advance(item, seconds, bounds, reserved, peers, 10);
        paint(item);
      });
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!mobile.matches && !preference.matches && !document.hidden && !hero.classList.contains('is-paused') && !hero.classList.contains('is-outside')) frame = requestAnimationFrame(tick);
    }
    new MutationObserver(sync).observe(hero, { attributes: true, attributeFilter: ['class'] });
    new ResizeObserver(layout).observe(hero);
    mark.addEventListener('load', layout);
    preference.addEventListener('change', sync);
    mobile.addEventListener('change', layout);
    document.addEventListener('visibilitychange', sync);
    layout();
  }
}
