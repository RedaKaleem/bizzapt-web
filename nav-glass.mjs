const header = document.querySelector('.site-header');
if (header) {
  const logo = header.querySelector('.brand-lockup');
  const surfaces = [...document.querySelectorAll('main section, .site-footer, body > footer')];
  let frame = 0;
  function update() {
    frame = 0;
    const line = header.getBoundingClientRect().height + 1;
    const surface = surfaces.findLast(element => {
      const rect = element.getBoundingClientRect();
      return rect.top <= line && rect.bottom > line;
    }) || document.querySelector('main') || document.body;
    let current = surface, rgb;
    while (current) {
      const values = getComputedStyle(current).backgroundColor.match(/[\d.]+/g)?.map(Number);
      if (values?.length >= 3 && (values.length < 4 || values[3] > .5)) { rgb = values; break; }
      current = current.parentElement;
    }
    const dark = rgb ? rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722 < 140 : false;
    header.classList.toggle('is-dark', dark);
    const source = dark ? logo?.dataset.logoDark : logo?.dataset.logoLight;
    if (source && logo.getAttribute('src') !== source) logo.setAttribute('src', source);
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  new ResizeObserver(schedule).observe(document.body);
  update();
}
