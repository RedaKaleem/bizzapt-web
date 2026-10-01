import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, findPosition, isClear, overlaps } from '../hero-motion.mjs';

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

test('expanded symbols start apart and never intersect while floating', () => {
  const bounds = { left: 16, top: 28, right: 1180, bottom: 800 };
  const reserved = { left: 810, top: 430, right: 1230, bottom: 760 };
  const preferred = [
    [120, 130], [300, 100], [620, 120], [100, 590], [700, 570],
    [1000, 350], [520, 80], [320, 620], [970, 570], [560, 690],
  ];
  const items = [];
  preferred.forEach(([x, y], index) => {
    const item = { width: 108, height: 115, vx: index % 2 ? -12 : 11, vy: index % 3 ? 7 : -8 };
    const slot = findPosition(item, { x, y }, bounds, reserved, items, 24);
    assert.ok(slot, `no space for symbol ${index + 1}`);
    Object.assign(item, slot);
    items.push(item);
  });
  for (let frame = 0; frame < 18000; frame++) {
    for (const item of items) advance(item, 1 / 60, bounds, reserved, items.filter(other => other !== item), 10);
    for (let i = 0; i < items.length; i++) {
      assert.ok(isClear(items[i].x, items[i].y, items[i].width, items[i].height, bounds, reserved));
      for (let j = i + 1; j < items.length; j++) {
        assert.equal(overlaps(items[i].x, items[i].y, items[i].width, items[i].height, items[j], 0), false);
      }
    }
  }
});
