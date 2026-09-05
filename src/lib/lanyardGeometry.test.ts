import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { createLanyardGeometry, createLanyardUpdater, STRAP_WIDTH, STRAP_TEXTURE_LENGTH } from './lanyardGeometry';

const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
const center = (positions: THREE.BufferAttribute, row: number) =>
  new THREE.Vector3().fromBufferAttribute(positions, row * 2)
    .add(new THREE.Vector3().fromBufferAttribute(positions, row * 2 + 1)).multiplyScalar(0.5);

test('resting ribbon rises from the pin without folding back into the connector', () => {
  const geometry = createLanyardGeometry();
  createLanyardUpdater(geometry)(v(0, 1.15), new THREE.Quaternion(), v(0, 3.6), v(0, 6.05), v(0, 8.5));
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  let previousY = -Infinity;
  for (let row = 0; row < positions.count / 2; row++) {
    const point = center(positions, row);
    assert.ok(point.y > previousY, 'the strap must never reverse toward the pin at rest');
    assert.ok(Math.abs(point.x) < 1e-6);
    previousY = point.y;
  }
  geometry.dispose();
});

test('the seam stays attached and keeps its width while the pin turns through a full rotation', () => {
  const geometry = createLanyardGeometry();
  const update = createLanyardUpdater(geometry);
  const start = v(0.35, 1.15, 0.12);
  for (let step = 0; step <= 48; step++) {
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, step * Math.PI / 24, 0.2));
    update(start, rotation, v(0.2, 3.6, 0.2), v(-0.1, 6.05), v(0, 8.5));
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
    assert.ok(center(positions, 0).distanceTo(start) < 1e-6);
    const across = new THREE.Vector3().fromBufferAttribute(positions, 1)
      .sub(new THREE.Vector3().fromBufferAttribute(positions, 0));
    assert.ok(across.distanceTo(v(STRAP_WIDTH, 0).applyQuaternion(rotation)) < 1e-6);
    for (const name of ['position', 'normal', 'uv']) {
      assert.ok(Array.from(geometry.getAttribute(name).array).every(Number.isFinite));
    }
    for (let row = 0; row < positions.count / 2; row++) {
      const left = new THREE.Vector3().fromBufferAttribute(positions, row * 2);
      const right = new THREE.Vector3().fromBufferAttribute(positions, row * 2 + 1);
      assert.ok(Math.abs(left.distanceTo(right) - STRAP_WIDTH) < 1e-6);
    }
  }
  geometry.dispose();
});

test('print starts at a fixed distance from the seam even when the ribbon bends', () => {
  const geometry = createLanyardGeometry();
  createLanyardUpdater(geometry)(v(1, 1.1), new THREE.Quaternion(), v(-0.4, 3.7), v(0.3, 6.05), v(0, 8.5));
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const uvs = geometry.getAttribute('uv');
  assert.equal(uvs.getX(0), 0);
  let distance = 0;
  for (let row = 1; row < positions.count / 2; row++) {
    distance += center(positions, row).distanceTo(center(positions, row - 1));
    assert.ok(Math.abs(uvs.getX(row * 2) * STRAP_TEXTURE_LENGTH - distance) < 1e-5);
  }
  geometry.dispose();
});
