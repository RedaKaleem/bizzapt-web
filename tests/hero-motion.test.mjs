import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, isClear } from '../hero-motion.mjs';

test('symbols travel across the field while their whole footprint avoids the brand mark', () => {
  const bounds = { left: 16, top: 28, right: 1400, bottom: 850 };
  const reserved = { left: 890, top: 420, right: 1500, bottom: 810 };
  const item = { x: 780, y: 350, width: 98, height: 105, vx: 15, vy: 9 };
  let minX = item.x, maxX = item.x;
  for (let i = 0; i < 18000; i++) {
    advance(item, 1 / 60, bounds, reserved);
    assert.ok(isClear(item.x, item.y, item.width, item.height, bounds, reserved));
    minX = Math.min(minX, item.x); maxX = Math.max(maxX, item.x);
  }
  assert.ok(maxX - minX > 400, 'motion must travel, rather than oscillate in a small home position');
});

test('mobile motion stays inside the field above the copy', () => {
  const bounds = { left: 16, top: 28, right: 359, bottom: 395 };
  const reserved = { left: 80, top: 690, right: 500, bottom: 1000 };
  const item = { x: 150, y: 160, width: 72, height: 75, vx: -12, vy: 8 };
  for (let i = 0; i < 10000; i++) {
    advance(item, .05, bounds, reserved);
    assert.ok(isClear(item.x, item.y, item.width, item.height, bounds, reserved));
  }
});
