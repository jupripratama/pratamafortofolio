import * as THREE from 'three';

export const STRAP_WIDTH = 0.21;
export const STRAP_TEXTURE_LENGTH = 8;
const SEGMENTS = 96;

/** A world-space ribbon: its bottom edge rotates with the clip, not the camera. */
export function createLanyardGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEGMENTS + 1) * 6), 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array((SEGMENTS + 1) * 4), 2).setUsage(THREE.DynamicDrawUsage));
  const indices: number[] = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setIndex(indices);
  return geometry;
}

export function createLanyardUpdater(geometry: THREE.BufferGeometry) {
  const points = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const tangent = new THREE.Vector3();
  const right = new THREE.Vector3();
  const previousRight = new THREE.Vector3();
  const up = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const lower = new THREE.CubicBezierCurve3();
  const upper = new THREE.CubicBezierCurve3();
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const uvs = geometry.getAttribute('uv') as THREE.BufferAttribute;

  return (start: THREE.Vector3, rotation: THREE.Quaternion, middle: THREE.Vector3, guide: THREE.Vector3, anchor: THREE.Vector3) => {
    up.set(0, 1, 0).applyQuaternion(rotation);
    direction.subVectors(guide, middle).normalize();
    const handle = Math.min(0.8, start.distanceTo(middle) * 0.35);
    lower.v0.copy(start);
    lower.v1.copy(start).addScaledVector(up, handle);
    lower.v2.copy(middle).addScaledVector(direction, -handle);
    lower.v3.copy(middle);
    upper.v0.copy(middle);
    upper.v1.copy(middle).addScaledVector(direction, handle);
    upper.v2.copy(guide);
    upper.v3.copy(anchor);

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      if (t <= 0.5) lower.getPoint(t * 2, points[i]);
      else upper.getPoint((t - 0.5) * 2, points[i]);
    }

    let distance = 0;
    right.set(1, 0, 0).applyQuaternion(rotation);
    for (let i = 0; i <= SEGMENTS; i++) {
      if (i > 0) distance += points[i].distanceTo(points[i - 1]);
      // Preserve the exact orientation at the seam; parallel-transport the
      // remaining cross-sections to avoid camera-facing flips and sudden twists.
      if (i === 0) tangent.copy(up);
      else tangent.subVectors(points[Math.min(i + 1, SEGMENTS)], points[i - 1]).normalize();
      previousRight.copy(right);
      right.addScaledVector(tangent, -right.dot(tangent));
      if (right.lengthSq() < 0.000001) right.copy(previousRight);
      right.normalize();
      const halfWidth = STRAP_WIDTH / 2;
      for (let side = 0; side < 2; side++) {
        const offset = side === 0 ? -halfWidth : halfWidth;
        positions.setXYZ(i * 2 + side, points[i].x + right.x * offset, points[i].y + right.y * offset, points[i].z + right.z * offset);
        // Arc length keeps the print size constant and leaves the seam blank.
        uvs.setXY(i * 2 + side, distance / STRAP_TEXTURE_LENGTH, side);
      }
    }
    positions.needsUpdate = true;
    uvs.needsUpdate = true;
    geometry.computeVertexNormals();
  };
}
