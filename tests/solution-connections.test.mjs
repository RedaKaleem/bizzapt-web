import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { solutionConnections } from '../solution-connections.mjs';

test('all eight solutions have valid connected examples including themselves', () => {
  assert.equal(Object.keys(solutionConnections).length, 8);
  for (const [key, solution] of Object.entries(solutionConnections)) {
    assert.ok(solution.path.includes(key));
    assert.ok(solution.example.length > 30);
    assert.equal(new Set(solution.path).size, solution.path.length);
    solution.path.forEach(id => assert.ok(solutionConnections[id]));
  }
});

test('selecting each puzzle piece updates the pressed state, related pieces and readable example', () => {
  const buttons = Object.keys(solutionConnections).map(key => ({
    dataset: { piece: key }, attrs: {}, connected: false,
    setAttribute(name, value) { this.attrs[name] = value; },
    addEventListener(type, fn) { this[type] = fn; },
    classList: { toggle() {} },
  }));
  buttons.forEach(button => { button.classList.toggle = (_name, value) => { button.connected = value; }; });
  const label = {}, example = {}, path = { replaceChildren(...nodes) { this.nodes = nodes; } };
  const section = {
    querySelectorAll: () => buttons,
    querySelector: selector => ({ '[data-connection-label]': label, '[data-connection-example]': example, '[data-connection-path]': path })[selector],
  };
  const source = readFileSync(new URL('../solution-connections.mjs', import.meta.url), 'utf8').replace('export const', 'const');
  vm.runInNewContext(source, { document: { querySelector: () => section, createElement: () => ({}) } });
  assert.equal(label.textContent, 'Website');
  for (const button of buttons) {
    button.click();
    const entry = solutionConnections[button.dataset.piece];
    assert.equal(label.textContent, entry.name);
    assert.equal(example.textContent, entry.example);
    assert.equal(buttons.filter(item => item.attrs['aria-pressed'] === 'true').length, 1);
    assert.equal(button.attrs['aria-pressed'], 'true');
    assert.deepEqual(buttons.filter(item => item.connected).map(item => item.dataset.piece).sort(), [...entry.path].sort());
    assert.deepEqual(Array.from(path.nodes, node => node.textContent), entry.path.map(id => solutionConnections[id].name));
  }
});
