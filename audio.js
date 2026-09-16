/**
 * Generative Ambient Audio Engine & Micro-Soundscape
 * Uses the Web Audio API to produce warm, gentle piano/chime chords
 * and provides full support for custom song playback and voice notes.
 */

class CapsuleAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.masterGain = null;
    this.chordStep = 0;
    this.customAudio = null;
    this.voiceAudio = null;

    // Romantic ambient chord progression (Dbmaj9 -> Abmaj7 -> Fm9 -> Gbmaj7)
    this.chords = [
      [277.18, 349.23, 415.30, 523.25, 622.25], // Dbmaj9
      [207.65, 261.63, 311.13, 392.00, 466.16], // Abmaj7
      [174.61, 207.65, 261.63, 311.13, 392.00], // Fm9
      [185.00, 233.08, 277.18, 349.23, 440.00]  // Gbmaj7
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.customAudio) {
      if (this.customAudio.paused) {
        this.customAudio.play();
        this.isPlaying = true;
      } else {
        this.customAudio.pause();
        this.isPlaying = false;
      }
      return this.isPlaying;
    }

    if (this.isPlaying) {
      this.stopChords();
      this.isPlaying = false;
    } else {
      this.startChords();
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  playVoice(freq, startTime, duration = 3.5, gainLevel = 0.08) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, startTime);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.6);
    noteGain.gain.exponentialRampToValueAtTime(gainLevel * 0.4, startTime + duration * 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.2);
  }

  playHarmonicArpeggio() {
    if (!this.isPlaying || !this.ctx) return;
    const chord = this.chords[this.chordStep % this.chords.length];
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      const stagger = idx * 0.35 + (Math.random() * 0.08);
      this.playVoice(freq, now + stagger, 4.0, 0.07);
    });

    this.chordStep++;
  }

  startChords() {
    this.playHarmonicArpeggio();
    this.timerId = setInterval(() => {
      this.playHarmonicArpeggio();
    }, 4200);
  }

  stopChords() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Sensory Micro-Tones
  playFreezeTone() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.1, 2.5, 0.1);
    });
  }

  playKintsugiChime() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.12, 3.0, 0.09);
    });
  }

  playSecretChime() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    [587.33, 739.99, 880, 1174.66].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.08, 2.0, 0.08);
    });
  }

  // Feature 1: Acoustic Motifs for Cassette Player
  playMelodyTrack(trackIndex) {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    
    // 3 distinct romantic melodies:
    const tracks = [
      // Track 1: "Sojat Road Morning Breeze" (Gentle upbeat sunrise arpeggios)
      [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63],
      // Track 2: "Lake City Mall Atrium" (Warm, intimate slow waltz)
      [277.18, 349.23, 415.30, 554.37, 622.25, 415.30, 554.37],
      // Track 3: "Cinema & Whispers" (Deep romantic emotional chords)
      [174.61, 220.00, 261.63, 349.23, 440.00, 523.25, 440.00]
    ];

    const notes = tracks[trackIndex % tracks.length];
    notes.forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.35, 3.2, 0.1);
    });
  }

  playSealCrackSound() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    // Crisp resonant snap tone
    [120, 240, 480, 960].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.03, 0.4, 0.12);
    });
    setTimeout(() => this.playKintsugiChime(), 150);
  }

  playFlowerPickTone() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    [659.25, 783.99, 987.77, 1318.51].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.06, 1.8, 0.07);
    });
  }

  playStarConnectTone() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.07, 2.2, 0.08);
    });
  }

  playBurstChime() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    [880, 1046.50, 1318.51].forEach((freq, i) => {
      this.playVoice(freq, now + i * 0.04, 1.2, 0.05);
    });
  }

  playCameraShutterSound() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    // Dual-click mechanical camera shutter
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(120, now + 0.04);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.05);

    const snapTime = now + 0.08;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(1100, snapTime);
    osc2.frequency.exponentialRampToValueAtTime(90, snapTime + 0.06);
    gain2.gain.setValueAtTime(0.25, snapTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.06);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(snapTime);
    osc2.stop(snapTime + 0.07);

    setTimeout(() => {
      this.playBurstChime();
    }, 180);
  }

  loadCustomSong(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.stopChords();
    this.customAudio = new Audio(url);
    this.customAudio.loop = true;
    this.customAudio.play();
    this.isPlaying = true;
  }

  loadVoiceRecording(file) {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    this.voiceAudio = new Audio(url);
    return this.voiceAudio;
  }
}

window.capsuleAudio = new CapsuleAudioEngine();
