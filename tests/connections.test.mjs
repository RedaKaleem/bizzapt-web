import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { capabilities, challenges, resolveChallenge, accomplishmentByChallenge } from '../connections-data.mjs';

test('every selectable capability has a readable, connected path through known nodes', () => {
  assert.equal(Object.keys(capabilities).length, 10);
  for (const [id, capability] of Object.entries(capabilities)) {
    assert.ok(capability.title && capability.description);
    assert.ok(capability.path.includes(id), `${id} must participate in its own path`);
    assert.ok(capability.path.length >= 4);
    assert.equal(new Set(capability.path).size, capability.path.length);
    for (const endpoint of capability.path) assert.ok(capabilities[endpoint], `Missing node ${endpoint}`);
  }
});

test('new and bookmarked discipline links always resolve to a visible challenge', () => {
  for (const id of challenges) assert.equal(resolveChallenge(`#${id}`), id);
  assert.equal(resolveChallenge('#branding'), 'launch');
  assert.equal(resolveChallenge('#data'), 'grow');
  assert.equal(resolveChallenge('#web-design'), 'optimize');
  assert.equal(resolveChallenge('#web-development'), 'scale');
  assert.equal(resolveChallenge(''), 'launch');
  assert.equal(resolveChallenge('#missing'), 'launch');
  assert.equal(accomplishmentByChallenge.unsure, 'Not sure yet');
});

// Exercise the real shared form handler with a stub transport: no enquiry is sent.
function formHarness({ valid = true, fetchImpl }) {
  let submit;
  const button = { dataset: { defaultLabel: 'START A CONVERSATION' }, disabled: false, innerHTML: '', setAttribute() {}, removeAttribute() {} };
  const status = { hidden: true, className: '', textContent: '', classList: { add() {} } };
  const form = {
    action: 'https://formspree.io/f/xzebpoby', resets: 0,
    reportValidity: () => valid,
    addEventListener(type, handler) { if (type === 'submit') submit = handler; },
    querySelector(selector) { return selector === '#form-status' ? status : button; },
    reset() { this.resets++; }
  };
  const document = {
    querySelector: selector => selector === '#project-form' ? form : null,
    querySelectorAll: () => []
  };
  const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8').replace(/^import .*;\n/, '');
  vm.runInNewContext(source, { document, fetch: fetchImpl, FormData: class { constructor(value) { this.form = value; } } });
  return { form, button, status, submit: () => submit({ preventDefault() {} }) };
}

test('invalid enquiries do not send; successful enquiries reset and announce receipt', async () => {
  let calls = 0;
  const fetchImpl = async (url, options) => {
    calls++;
    assert.equal(url, 'https://formspree.io/f/xzebpoby');
    assert.equal(options.method, 'POST');
    return { ok: true, json: async () => ({}) };
  };
  await formHarness({ valid: false, fetchImpl }).submit();
  assert.equal(calls, 0);
  const harness = formHarness({ fetchImpl });
  await harness.submit();
  assert.equal(calls, 1);
  assert.equal(harness.form.resets, 1);
  assert.equal(harness.status.hidden, false);
  assert.match(harness.status.textContent, /Message received/);
  assert.equal(harness.button.disabled, false);
});

test('server and network failures preserve the enquiry and allow retry', async () => {
  for (const fetchImpl of [
    async () => ({ ok: false, json: async () => ({ errors: [{ message: 'Please try again.' }] }) }),
    async () => { throw new Error('Connection unavailable.'); }
  ]) {
    const harness = formHarness({ fetchImpl });
    await harness.submit();
    assert.equal(harness.form.resets, 0);
    assert.equal(harness.status.hidden, false);
    assert.equal(harness.button.disabled, false);
    assert.match(harness.button.innerHTML, /START A CONVERSATION/);
    assert.ok(harness.status.textContent);
  }
});

test('environment tabs initialize aliases, support keyboard selection and follow hash changes', () => {
  const makeElement = (dataset) => {
    const attrs = {};
    const listeners = {};
    return {
      dataset, attrs, listeners, hidden: false,
      classList: { toggle() {} },
      setAttribute(key, value) { attrs[key] = value; },
      addEventListener(type, fn) { listeners[type] = fn; },
      click() { listeners.click(); },
      focus() { this.focused = true; }
    };
  };
  const tabs = challenges.map(id => makeElement({ serviceTab: id }));
  const panels = challenges.map(id => makeElement({ serviceWorld: id }));
  const events = {};
  const location = { hash: '#web-development' };
  const document = {
    querySelector: () => null,
    querySelectorAll: selector => selector === '[data-service-tab]' ? tabs : selector === '[data-service-world]' ? panels : []
  };
  const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8').replace(/^import .*;\n/, '');
  vm.runInNewContext(source, {
    document, location, resolveChallenge,
    history: { replaceState(_state, _title, hash) { location.hash = hash; } },
    window: { addEventListener(type, fn) { events[type] = fn; } }
  });
  assert.deepEqual(panels.map(p => p.hidden), [true, true, true, false]);
  tabs[3].listeners.keydown({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(tabs[0].attrs['aria-selected'], 'true');
  assert.equal(tabs[0].focused, true);
  assert.equal(location.hash, '#launch');
  assert.deepEqual(tabs.map(t => t.tabIndex), [0, -1, -1, -1]);
  tabs[0].listeners.keydown({ key: 'End', preventDefault() {} });
  assert.equal(tabs[3].attrs['aria-selected'], 'true');
  location.hash = '#data';
  events.hashchange();
  assert.deepEqual(panels.map(p => p.hidden), [true, false, true, true]);
  location.hash = '#unknown';
  events.hashchange();
  assert.deepEqual(panels.map(p => p.hidden), [false, true, true, true]);
});

test('floating field can be paused and resumed, and stops when the page is hidden', () => {
  const classes = new Set();
  const label = { textContent: 'Pause motion' };
  const symbol = { textContent: 'Ⅱ' };
  const attributes = {};
  let click;
  let visibilityChange;
  const toggle = {
    addEventListener(_type, callback) { click = callback; },
    setAttribute(key, value) { attributes[key] = value; },
    querySelector(selector) { return selector === '[data-motion-control-label]' ? label : symbol; }
  };
  const hero = {
    querySelector: () => toggle,
    querySelectorAll: () => [],
    classList: { toggle(name, force) {
      const enabled = force ?? !classes.has(name);
      if (enabled) classes.add(name); else classes.delete(name);
      return enabled;
    } }
  };
  const document = {
    hidden: false,
    querySelector: selector => selector === '.floating-hero' ? hero : null,
    addEventListener(_type, callback) { visibilityChange = callback; }
  };
  const source = readFileSync(new URL('../connections.js', import.meta.url), 'utf8').replace(/^import .*;\n/, '');
  vm.runInNewContext(source, { document, window: { matchMedia: () => ({ matches: false }) } });
  click();
  assert.equal(attributes['aria-pressed'], 'true');
  assert.equal(label.textContent, 'Resume motion');
  assert.ok(classes.has('is-paused'));
  click();
  assert.equal(label.textContent, 'Pause motion');
  assert.equal(classes.has('is-paused'), false);
  document.hidden = true;
  visibilityChange();
  assert.ok(classes.has('is-outside'));
  document.hidden = false;
  visibilityChange();
  assert.equal(classes.has('is-outside'), false);
});

test('floating solution actions select the matching capability and support tooltip dismissal', () => {
  const events = {};
  const classes = new Set();
  const properties = {};
  const link = { dataset: { solution: 'automation' }, addEventListener(type, fn) { events[type] = fn; } };
  const module = {
    style: { setProperty(key, value) { properties[key] = value; } },
    classList: { add: key => classes.add(key), remove: key => classes.delete(key) },
    querySelector: () => link
  };
  const target = { dataset: { node: 'automation' }, click() { this.selected = true; }, focus() { this.focused = true; } };
  const ecosystem = { scrollIntoView(options) { this.behavior = options.behavior; } };
  const hero = {
    querySelector: () => ({ addEventListener() {} }),
    querySelectorAll: () => [module],
    classList: { toggle() {} }
  };
  const document = {
    querySelector: selector => selector === '.floating-hero' ? hero : selector === '#ecosystem' ? ecosystem : null,
    querySelectorAll: () => [target], addEventListener() {}
  };
  const source = readFileSync(new URL('../connections.js', import.meta.url), 'utf8').replace(/^import .*;\n/, '');
  vm.runInNewContext(source, { document, window: { matchMedia: () => ({ matches: true }) } });
  events.keydown({ key: 'Escape' });
  assert.ok(classes.has('is-dismissed'));
  events.focus();
  assert.equal(classes.has('is-dismissed'), false);
  let prevented = false;
  events.click({ preventDefault() { prevented = true; } });
  assert.ok(prevented && target.selected && target.focused);
  assert.equal(ecosystem.behavior, 'auto');
});
