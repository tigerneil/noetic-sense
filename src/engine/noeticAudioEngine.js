/**
 * 智觉 · NOETIC SENSE — Generative Ambient & Eastern-Minimalist Soundscape Engine
 *
 * Inspired by Brian Eno (asynchronous generative loops), Ryuichi Sakamoto (suspended
 * Maj9 / Lydian voicings & negative space), and Guqin / Singing-Bowl overtone acoustics.
 *
 * Pure Web Audio DSP:
 *  - Procedural 3.8s Stereo Silk-Hall Convolution Reverb (ConvolverNode)
 *  - Warm Low-Passed Dotted-Eighth Stereo Ping-Pong Delay
 *  - Breathing Polyphonic Silk Swell Pads (slow attack/release envelopes, never a static buzz)
 *  - Generative Felt-Piano & Guqin Harmonic Droplets ("泛音留白")
 *  - Musical Dissonance Mapping (Consonant Pentatonic Maj9 <-> Cinematic Lydian/Altered Suspense)
 *  - Studio Master Compressor preventing any clipping or harshness
 */

// MIDI note to Hz (warm concert pitch A4 = 438 Hz for serene contemplation)
function midiToFreq(midi) {
  return 438 * Math.pow(2, (midi - 69) / 12);
}

// Curated Chord Palettes (MIDI notes)
// Consonant Palette: D Major Pentatonic / D Lydian Maj9 ("弦音相合则心神宁静")
const CONSONANT_CHORDS = [
  { pad: [50, 57, 64, 66], melody: [69, 71, 74, 76, 78, 81] }, // Dmaj9 (D3, A3, E4, F#4)
  { pad: [47, 54, 62, 66], melody: [69, 73, 74, 78, 81, 83] }, // Bm11 (B2, F#3, D4, F#4)
  { pad: [43, 50, 59, 64], melody: [66, 69, 71, 74, 76, 81] }, // Gmaj13(#11) (G2, D3, B3, E4)
  { pad: [45, 52, 61, 66], melody: [69, 73, 76, 78, 81, 85] }, // A6/9 (A2, E3, C#4, F#4)
];

// Cinematic Suspense Palette for "Cognitive Dissonance" (Sakamoto-inspired mysterious tension, never harsh!)
const TENSION_CHORDS = [
  { pad: [50, 56, 63, 68], melody: [68, 72, 74, 75, 80] }, // D dim-maj / Lydian augmented shadow
  { pad: [46, 53, 60, 65], melody: [68, 70, 72, 77, 79] }, // Bbmaj7(#11) modal shift
  { pad: [48, 55, 63, 66], melody: [69, 72, 75, 78, 81] }, // Cm(maj9)/F# enigmatic tension
];

// Silent Lantern Palette: Pure, sparse, deeply comforting fifths & octaves ("留白掌灯")
const LANTERN_CHORDS = [
  { pad: [50, 57, 62, 69], melody: [74, 78, 81] }, // Pure D5 open fifth + warm F#5
  { pad: [43, 50, 57, 66], melody: [69, 74, 78] }, // Gmaj7 open cradle
];

export class NoeticAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;

    // Master & Spatial Bus
    this.masterGain = null;
    this.compressor = null;
    this.dryBus = null;
    this.reverbSend = null;
    this.delaySend = null;
    this.convolver = null;

    // Generative Loop Timers
    this.padTimer = null;
    this.dropletTimer = null;
    this.chordIndex = 0;
    this.lastPulseTime = 0;

    // Live 4D Sensory State
    this.state = {
      temperature: 0.28,
      dissonance: 0.14,
      depth: 0.48,
      sovereignty: 0.62,
      overload: 0.24,
      lantern: 0.0,
    };
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    // 1. Studio Master Compressor + Master Gain
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 18;
    this.compressor.ratio.value = 3.2;
    this.compressor.attack.value = 0.025;
    this.compressor.release.value = 0.35;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0001;

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // 2. Dry & Spatial Wet Buses
    this.dryBus = this.ctx.createGain();
    this.dryBus.gain.value = 0.68;
    this.dryBus.connect(this.compressor);

    // 3. Procedural 3.8s Silk-Hall Stereo Convolution Reverb
    this.convolver = this.ctx.createConvolver();
    this.convolver.buffer = this.createSilkHallImpulse(3.8, 2.6);

    const reverbToneFilter = this.ctx.createBiquadFilter();
    reverbToneFilter.type = 'lowpass';
    reverbToneFilter.frequency.value = 2800;

    this.reverbSend = this.ctx.createGain();
    this.reverbSend.gain.value = 0.62;
    this.reverbSend.connect(reverbToneFilter);
    reverbToneFilter.connect(this.convolver);
    this.convolver.connect(this.compressor);

    // 4. Warm Stereo Ping-Pong Tape Delay (Probabilistic Depth of Field Echo)
    const delayL = this.ctx.createDelay(2.0);
    const delayR = this.ctx.createDelay(2.0);
    delayL.delayTime.value = 0.46;
    delayR.delayTime.value = 0.69;

    const feedbackL = this.ctx.createGain();
    const feedbackR = this.ctx.createGain();
    feedbackL.gain.value = 0.34;
    feedbackR.gain.value = 0.32;
    this.delayFeedbackL = feedbackL;
    this.delayFeedbackR = feedbackR;

    const tapeWarmth = this.ctx.createBiquadFilter();
    tapeWarmth.type = 'lowpass';
    tapeWarmth.frequency.value = 1650;

    const panL = this.ctx.createStereoPanner();
    const panR = this.ctx.createStereoPanner();
    panL.pan.value = -0.62;
    panR.pan.value = 0.62;

    this.delaySend = this.ctx.createGain();
    this.delaySend.gain.value = 0.28;

    this.delaySend.connect(tapeWarmth);
    tapeWarmth.connect(delayL);
    delayL.connect(feedbackL);
    feedbackL.connect(delayR);
    delayR.connect(feedbackR);
    feedbackR.connect(delayL);

    delayL.connect(panL).connect(this.compressor);
    delayR.connect(panR).connect(this.compressor);
    // Feed a whisper of delay into the hall reverb for seamless bloom
    delayL.connect(this.reverbSend);
  }

  /**
   * Generates a lush, diffuse stereo acoustic hall impulse response
   * with natural high-frequency air absorption so tails feel warm and velvety.
   */
  createSilkHallImpulse(durationSec, decayRate) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * durationSec);
    const impulse = this.ctx.createBuffer(2, length, rate);

    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let lpState = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        // Soft pre-delay bloom (first 35ms swells smoothly rather than clicking)
        const preBloom = Math.min(1, i / (rate * 0.035));
        const env = preBloom * Math.pow(1 - t, decayRate);
        const white = Math.random() * 2 - 1;
        // Progressive air absorption (darker over time like a real wooden concert hall)
        const dampCoeff = 0.14 + (1 - t) * 0.32;
        lpState += dampCoeff * (white - lpState);
        data[i] = lpState * env * 0.55;
      }
    }
    return impulse;
  }

  getActiveChord() {
    const { dissonance, lantern } = this.state;
    if (lantern > 0.5) {
      return LANTERN_CHORDS[this.chordIndex % LANTERN_CHORDS.length];
    }
    if (dissonance > 0.52) {
      return TENSION_CHORDS[this.chordIndex % TENSION_CHORDS.length];
    }
    return CONSONANT_CHORDS[this.chordIndex % CONSONANT_CHORDS.length];
  }

  /**
   * Voice 1: Breathing Polyphonic Silk Pad Swell
   * Softly overlapping 9-second warm harmonic chords (zero static drone fatigue).
   */
  spawnBreathingPad() {
    if (!this.ctx || !this.enabled) return;

    const now = this.ctx.currentTime;
    const { temperature, dissonance, overload, lantern } = this.state;
    const chord = this.getActiveChord();
    this.chordIndex = (this.chordIndex + 1) % 12;

    const attack = 3.2;
    const hold = 2.6;
    const release = 4.6;
    const totalDur = attack + hold + release;

    // Pad voice filter: warmer & deeper at calm clarity, richer harmonics with temperature
    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    const cutoff = 380 + temperature * 520 - overload * 160;
    padFilter.frequency.setValueAtTime(Math.max(240, cutoff * 0.7), now);
    padFilter.frequency.linearRampToValueAtTime(Math.max(280, cutoff), now + attack);
    padFilter.frequency.exponentialRampToValueAtTime(220, now + totalDur);
    padFilter.Q.value = 0.7;

    const padEnv = this.ctx.createGain();
    const peakGain = (0.11 - overload * 0.035) * (lantern > 0.5 ? 0.85 : 1.0);
    padEnv.gain.setValueAtTime(0.0001, now);
    padEnv.gain.linearRampToValueAtTime(Math.max(0.04, peakGain), now + attack);
    padEnv.gain.setValueAtTime(Math.max(0.04, peakGain), now + attack + hold);
    padEnv.gain.exponentialRampToValueAtTime(0.0001, now + totalDur);

    padFilter.connect(padEnv);
    padEnv.connect(this.dryBus);
    padEnv.connect(this.reverbSend);

    // Shift bass root down an octave when Cliff-Edge Temperature is high for cinematic gravitas
    const notes = [...chord.pad];
    if (temperature > 0.58) {
      notes[0] -= 12;
    }

    notes.forEach((midi, idx) => {
      const baseFreq = midiToFreq(midi);
      // Pair a pure sine fundamental with a softly detuned warm triangle for organic silk chorus
      ['sine', 'triangle'].forEach((type, layer) => {
        const osc = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner();

        osc.type = type;
        // Gentle ±4 cent natural ensemble chorus; slightly wider shimmer on dissonance
        const detuneCents = (layer === 0 ? -3.5 : 3.5) + (idx - 1.5) * (1.8 + dissonance * 4.5);
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.detune.setValueAtTime(detuneCents, now);

        voiceGain.gain.value = layer === 0 ? 0.28 : 0.11;
        panner.pan.value = ((idx % 2 === 0 ? -1 : 1) * (0.2 + idx * 0.1)) % 0.75;

        osc.connect(voiceGain).connect(panner).connect(padFilter);
        osc.start(now);
        osc.stop(now + totalDur + 0.1);
      });
    });

    // Schedule next breathing swell with slight organic rubato
    const nextIntervalMs = (6800 + Math.random() * 1800 + overload * 2200);
    this.padTimer = setTimeout(() => this.spawnBreathingPad(), nextIntervalMs);
  }

  /**
   * Voice 2: Generative Felt-Piano & Guqin Overtone Droplets ("泛音清露")
   * Asynchronous melodic notes with generous Negative Space ("留白").
   */
  spawnHarmonicDroplet() {
    if (!this.ctx || !this.enabled) return;

    const { temperature, dissonance, depth, overload, lantern } = this.state;

    // Respect Negative Space: occasionally let a beat rest in pure silence
    const restProbability = 0.15 + overload * 0.35 + lantern * 0.3;
    if (Math.random() > restProbability) {
      const chord = this.getActiveChord();
      const pool = chord.melody;
      const midi = pool[Math.floor(Math.random() * pool.length)];
      this.playJadeFeltNote(midi, {
        velocity: 0.42 + Math.random() * 0.28 - overload * 0.15,
        pan: (Math.random() * 1.1) - 0.55,
        brightness: 0.35 + temperature * 0.4 + dissonance * 0.2,
        decaySec: 2.6 + depth * 2.2,
      });

      // Occasional delicate harmonic fifth/fourth grace note when calm & clear
      if (overload < 0.5 && lantern < 0.5 && Math.random() < 0.26) {
        const companionMidi = pool[(pool.indexOf(midi) + 2) % pool.length];
        setTimeout(() => {
          if (this.enabled) {
            this.playJadeFeltNote(companionMidi, {
              velocity: 0.28,
              pan: (Math.random() * 0.9) - 0.45,
              brightness: 0.3,
              decaySec: 3.1,
            });
          }
        }, 260 + Math.random() * 180);
      }
    }

    // Pace adapts organically to biometric overload & Silent Lantern mode
    const baseMs = 1650 + Math.random() * 2100 + overload * 2000 + lantern * 1800;
    this.dropletTimer = setTimeout(() => this.spawnHarmonicDroplet(), baseMs);
  }

  /**
   * Synthesizes a single warm Felt-Piano / Guqin Harmonic note using
   * soft FM bell attack + pure acoustic overtone decay.
   */
  playJadeFeltNote(midi, { velocity = 0.5, pan = 0, brightness = 0.4, decaySec = 3.0 } = {}) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freq = midiToFreq(midi);

    const panner = this.ctx.createStereoPanner();
    panner.pan.value = Math.max(-0.85, Math.min(0.85, pan));

    // Warm felt hammer lowpass filter (envelope opens briefly on pluck, then mellows)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const peakCutoff = Math.min(4800, freq * (2.6 + brightness * 4.2));
    filter.frequency.setValueAtTime(peakCutoff, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(320, freq * 1.35), now + decaySec * 0.65);

    const amp = this.ctx.createGain();
    const peak = Math.max(0.02, Math.min(0.16, velocity * 0.18));
    // Soft 16ms felt-hammer attack (eliminates any harsh digital click)
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.linearRampToValueAtTime(peak, now + 0.018);
    amp.gain.exponentialRampToValueAtTime(peak * 0.38, now + 0.32);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);

    // Carrier: pure warm sine
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, now);

    // Soft 2x octave Guqin harmonic overtone (decays faster than fundamental for crystalline bloom)
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * 2.0, now);
    modGain.gain.setValueAtTime(freq * (0.35 + brightness * 0.55), now);
    modGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    // Gentle 3x fifth-harmonic whisper
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 3.0, now);
    overtoneGain.gain.setValueAtTime(peak * 0.14, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    carrier.connect(filter);
    overtone.connect(overtoneGain).connect(filter);
    filter.connect(amp);
    amp.connect(panner);

    panner.connect(this.dryBus);
    panner.connect(this.reverbSend);
    panner.connect(this.delaySend);

    carrier.start(now);
    modulator.start(now);
    overtone.start(now);

    const stopAt = now + decaySec + 0.08;
    carrier.stop(stopAt);
    modulator.stop(stopAt);
    overtone.stop(stopAt);
  }

  startGenerativeLoops() {
    this.stopGenerativeLoops();
    this.spawnBreathingPad();
    // First melodic droplet blooms gently 650ms after the silk pad inhales
    this.dropletTimer = setTimeout(() => this.spawnHarmonicDroplet(), 650);
  }

  stopGenerativeLoops() {
    if (this.padTimer) {
      clearTimeout(this.padTimer);
      this.padTimer = null;
    }
    if (this.dropletTimer) {
      clearTimeout(this.dropletTimer);
      this.dropletTimer = null;
    }
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

    if (this.enabled) {
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      this.masterGain.gain.linearRampToValueAtTime(0.78, now + 0.9);
      this.applyState(this.state);
      this.startGenerativeLoops();
    } else {
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.35);
      this.stopGenerativeLoops();
    }

    return this.enabled;
  }

  applyState(nextState) {
    Object.assign(this.state, nextState);
    if (!this.ctx || !this.enabled) return;

    const now = this.ctx.currentTime;
    const { depth, overload, lantern } = this.state;

    // Probabilistic Depth of Field modulates spatial echo & hall wet depth
    const wetReverb = 0.48 + depth * 0.42 + lantern * 0.22;
    const wetDelay = (0.14 + depth * 0.34) * (1 - overload * 0.45);
    const fb = 0.22 + depth * 0.26;

    this.reverbSend.gain.setTargetAtTime(Math.min(0.95, wetReverb), now, 0.3);
    this.delaySend.gain.setTargetAtTime(Math.max(0.05, wetDelay), now, 0.3);
    if (this.delayFeedbackL && this.delayFeedbackR) {
      this.delayFeedbackL.gain.setTargetAtTime(Math.min(0.52, fb), now, 0.3);
      this.delayFeedbackR.gain.setTargetAtTime(Math.min(0.48, fb * 0.92), now, 0.3);
    }
  }

  /**
   * Tactile Sovereignty Chime: touching the 3D WebGPU Mind-Membrane plucks
   * a crystalline upper-register singing-bowl / jade chime harmonized to the current chord.
   */
  triggerBoundaryPulse(intensity = 0.6) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    if (now - this.lastPulseTime < 0.38) return;
    this.lastPulseTime = now;

    const chord = this.getActiveChord();
    const upperNotes = chord.melody;
    const chosenMidi = upperNotes[Math.floor(Math.random() * upperNotes.length)] + 12;

    this.playJadeFeltNote(Math.min(93, chosenMidi), {
      velocity: 0.32 + intensity * 0.35,
      pan: (Math.random() * 0.8) - 0.4,
      brightness: 0.55,
      decaySec: 3.4,
    });
  }

  /**
   * Gentle arpeggiated 3-note felt-piano / guqin chord bloom when the user
   * switches dimensions, wearable scenarios, or lights the Silent Lantern.
   */
  playChordCue() {
    if (!this.ctx || !this.enabled) return;
    const chord = this.getActiveChord();
    const cueNotes = [chord.pad[1], chord.pad[2], chord.melody[0]];
    cueNotes.forEach((midi, i) => {
      setTimeout(() => {
        if (!this.enabled) return;
        this.playJadeFeltNote(midi, {
          velocity: 0.36 - i * 0.04,
          pan: (i - 1) * 0.38,
          brightness: 0.38,
          decaySec: 3.6,
        });
      }, i * 135);
    });
  }
}
