/**
 * Sub-Audible Neuro-Acoustic & Micro-Haptic Resonance Synthesizer
 * Implements pure Web Audio harmonic consonance/dissonance, barometric wind,
 * overload damping, and tactile sovereignty recoil pulses.
 */

export class NoeticAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.masterGain = null;
    this.fundamentalOsc = null;
    this.harmonicOsc = null;
    this.subGravityOsc = null;
    this.subGain = null;
    this.harmonicGain = null;
    this.windFilter = null;
    this.windGain = null;

    this.state = {
      temperature: 0.28,
      dissonance: 0.14,
      depth: 0.48,
      sovereignty: 0.62,
      overload: 0.24,
      lantern: 0.0,
    };
    this.lastPulseTime = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0001;
    this.masterGain.connect(this.ctx.destination);

    // 1. Fundamental Mastoid Carrier (108 Hz warm sine)
    this.fundamentalOsc = this.ctx.createOscillator();
    this.fundamentalOsc.type = 'sine';
    this.fundamentalOsc.frequency.value = 108;
    const fundGain = this.ctx.createGain();
    fundGain.gain.value = 0.32;
    this.fundamentalOsc.connect(fundGain).connect(this.masterGain);

    // 2. Logical Harmony / Dissonance Interval Voice (Pure 3:2 = 162 Hz <-> Detuned Beat)
    this.harmonicOsc = this.ctx.createOscillator();
    this.harmonicOsc.type = 'triangle';
    this.harmonicOsc.frequency.value = 162;

    const harmFilter = this.ctx.createBiquadFilter();
    harmFilter.type = 'lowpass';
    harmFilter.frequency.value = 420;

    this.harmonicGain = this.ctx.createGain();
    this.harmonicGain.gain.value = 0.18;
    this.harmonicOsc.connect(harmFilter).connect(this.harmonicGain).connect(this.masterGain);

    // 3. Cliff-Edge Spatial Gravity Sub-Bass (54 Hz)
    this.subGravityOsc = this.ctx.createOscillator();
    this.subGravityOsc.type = 'sine';
    this.subGravityOsc.frequency.value = 54;
    this.subGain = this.ctx.createGain();
    this.subGain.gain.value = 0.08;
    this.subGravityOsc.connect(this.subGain).connect(this.masterGain);

    // 4. Barometric Wind / Probabilistic Mist ("风起于青萍之末")
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.4;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 260;
    this.windFilter.Q.value = 1.8;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.06;

    windSource.connect(this.windFilter).connect(this.windGain).connect(this.masterGain);

    this.fundamentalOsc.start();
    this.harmonicOsc.start();
    this.subGravityOsc.start();
    windSource.start();
  }

  async toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(this.enabled ? 0.16 : 0.0001, now, 0.35);
    if (this.enabled) {
      this.applyState(this.state);
    }
    return this.enabled;
  }

  applyState(nextState) {
    Object.assign(this.state, nextState);
    if (!this.ctx || !this.enabled) return;

    const now = this.ctx.currentTime;
    const { temperature, dissonance, depth, overload, lantern } = this.state;

    // Overload damping lowers upper complexity ("自动调低认知分辨率")
    const calmFactor = Math.max(0.18, 1 - Math.max(0, overload - 0.55) * 1.45) * (1 - lantern * 0.55);

    // Pure fifth (162 Hz) when aligned -> microtonal tritone tension (152.4 Hz) when dissonant
    const targetHarmFreq = 162 - dissonance * 9.8 + Math.sin(now * 3.0) * dissonance * 1.8;
    this.harmonicOsc.frequency.setTargetAtTime(targetHarmFreq, now, 0.18);
    this.harmonicGain.gain.setTargetAtTime((0.14 + dissonance * 0.12) * calmFactor, now, 0.22);

    // Thermal gravity sub-bass
    this.subGain.gain.setTargetAtTime(0.04 + temperature * 0.22 * (1 - lantern * 0.5), now, 0.25);

    // Barometric wind responds to Probabilistic Depth
    this.windFilter.frequency.setTargetAtTime(190 + depth * 360 + temperature * 140, now, 0.25);
    this.windGain.gain.setTargetAtTime((0.03 + depth * 0.08) * calmFactor, now, 0.25);
  }

  triggerBoundaryPulse(intensity = 0.6) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    if (now - this.lastPulseTime < 0.22) return;
    this.lastPulseTime = now;

    // Subtle tactile membrane recoil click-hum
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(196 + this.state.sovereignty * 90, now);
    osc.frequency.exponentialRampToValueAtTime(78, now + 0.14);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11 * intensity, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }
}
