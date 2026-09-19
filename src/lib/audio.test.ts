import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SoundEngine } from './audio';

test('audio unlocks on a gesture, waits for resume, drops stale effects, and respects mute', async (t) => {
  const listeners = new Map<string, () => void>();
  let now = 0;
  let created = 0;
  let started = 0;
  let resumes = 0;
  let finishResume: () => void;
  const param = { setValueAtTime() {}, exponentialRampToValueAtTime() {} };
  class Context {
    state = 'suspended';
    currentTime = 0;
    destination = {};
    constructor() { created++; }
    resume() {
      resumes++;
      return new Promise<void>((resolve) => {
        finishResume = () => { this.state = 'running'; resolve(); };
      });
    }
    createOscillator() {
      return { frequency: param, connect() {}, disconnect() {}, start() { started++; }, stop() {} };
    }
    createGain() { return { gain: param, connect() {}, disconnect() {} }; }
  }
  t.mock.method(performance, 'now', () => now);
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    AudioContext: Context,
    addEventListener: (name: string, callback: () => void) => listeners.set(name, callback),
    removeEventListener: (name: string) => listeners.delete(name),
  } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { hidden: false } });
  t.after(() => {
    for (const [key, descriptor] of [['window', oldWindow], ['document', oldDocument]] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  const engine = new SoundEngine();
  const detach = engine.attach();
  await engine.playSuccess();
  assert.equal(started, 0, 'boot audio must not start oscillators while suspended');
  listeners.get('pointerdown')!();
  const stale = engine.playClick();
  assert.equal(started, 0, 'no oscillator starts while suspended');
  assert.equal(resumes, 1, 'concurrent calls share one resume');
  now = 500;
  finishResume!();
  await stale;
  assert.equal(started, 0, 'late sounds are discarded');
  await engine.playClick();
  assert.equal(started, 1, 'ready audio plays immediately');
  engine.setMuted(true);
  await engine.playClick();
  assert.equal(started, 1);
  detach();
  assert.equal(listeners.size, 0);
});
