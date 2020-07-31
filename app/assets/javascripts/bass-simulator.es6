VS.BassSimulator = function() {
  const myp = new p5(function(p) {
    const osc1 = new p5.Oscillator('sawtooth');
    const osc2 = new p5.Oscillator('sawtooth');
    const osc3 = new p5.Oscillator('square');
    const oscLfo = new p5.Oscillator('triangle');

    let octave = 3;

    let vco1 = { shape: 'sawtooth', amp: 1, pitchMidi: 63, frequency: 440 }
    let vco2 = { shape: 'sawtooth', amp: 1, pitchMidi: 63, frequency: 440 }
    let vco3 = { shape: 'square', amp: 1, pitchMidi: 63, frequency: 440 }
    let lfo = { shape: 'triangle', targetAmp: false, targetPitch: false, targetCutoff: true }

    let notePlaying;

    let filter;

    const keyMap = {
      65: 130.81, // C
      87: 138.59, // C#
      83: 146.83, // D
      69: 155.56, // D#
      68: 164.81, // E
      70: 174.61, // F
      84: 185.00, // F#
      71: 196.00, // G
      89: 207.65, // G#
      72: 220.00, // A
      85: 233.08, // A#
      74: 246.94, // B
      75: 261.63, // C
      76: 277.18 // C#
    }

    const pitchMap = {
       0: -12,    1: -12,    2: -11,    3: -10,    4: -9,     5: -8,     6: -7,     7: -6,     8: -5,     9: -4,
      10: -3,    11: -2,    12: -1,    13: -0.96, 14: -0.92, 15: -0.88, 16: -0.84, 17: -0.80, 18: -0.78, 19: -0.76,
      20: -0.74, 21: -0.72, 22: -0.70, 23: -0.68, 24: -0.66, 25: -0.64, 26: -0.62, 27: -0.60, 28: -0.58, 29: -0.56,
      30: -0.54, 31: -0.52, 32: -0.50, 33: -0.48, 34: -0.46, 35: -0.44, 36: -0.42, 37: -0.40, 38: -0.38, 39: -0.36,
      40: -0.34, 41: -0.32, 42: -0.30, 43: -0.28, 44: -0.26, 45: -0.24, 46: -0.22, 47: -0.20, 48: -0.18, 49: -0.16,
      50: -0.14, 51: -0.12, 52: -0.10, 53: -0.08, 54: -0.06, 55: -0.04, 56: -0.02, 57: 0,     58: 0,     59: 0,
      60: 0,     61: 0,     62: 0,     63: 0,     64: 0,     65: 0,     66: 0,     67: 0,     68: 0,     69: 0,
      70: 0,     71: 0.02,  72: 0.04,  73: 0.06,  74: 0.08,  75: 0.10,  76: 0.12,  77: 0.14,  78: 0.16,  79: 0.18,
      80: 0.20,  81: 0.22,  82: 0.24,  83: 0.26,  84: 0.28,  85: 0.30,  86: 0.32,  87: 0.34,  88: 0.36,  89: 0.38,
      90: 0.40,  91: 0.42,  92: 0.44,  93: 0.46,  94: 0.48,  95: 0.50,  96: 0.52,  97: 0.54,  98: 0.56,  99: 0.58,
      100: 0.60, 101: 0.62, 102: 0.64, 103: 0.66, 104: 0.68, 105: 0.70, 106: 0.72, 107: 0.74, 108: 0.76, 109: 0.78,
      110: 0.80, 111: 0.84, 112: 0.88, 113: 0.92, 114: 0.96, 115: 1,    116: 2,    117: 3,    118: 4,    119: 5,
      120: 6,    121: 7,    122: 8,    123: 9,    124: 10,   125: 11,   126: 12,   127: 12
    }

    const zKeyCode = 90;
    const xKeyCode = 88;

    const octaveMap = {
      "-1": { displayNumber: 8, frequencyFactor: 0.0625 },
      0: { displayNumber: 9, frequencyFactor: 0.125 },
      1: { displayNumber: 21, frequencyFactor: 0.25 },
      2: { displayNumber: 33, frequencyFactor: 0.5 },
      3: { displayNumber: 45, frequencyFactor: 1 },
      4: { displayNumber: 57, frequencyFactor: 2 },
      5: { displayNumber: 69, frequencyFactor: 4 },
      6: { displayNumber: 81, frequencyFactor: 8 },
      7: { displayNumber: 93, frequencyFactor: 16 },
      8: { displayNumber: 105, frequencyFactor: 32 },
      9: { displayNumber: 118, frequencyFactor: 64 }
    }

    const keyCodes = Object.keys(keyMap).map(Number);

    p.setup = function() {
      console.log('p5 is running :-]');
      osc1.amp(vco1.amp);
      osc2.amp(vco2.amp);
      osc3.amp(vco3.amp);

      oscLfo.amp(200);
      oscLfo.freq(1);
      oscLfo.start();
      oscLfo.disconnect();

      filter = new p5.Filter();
      filter.freq(22000);
      filter.res(0);

      osc1.disconnect();
      osc1.connect(filter);

      osc2.disconnect();
      osc2.connect(filter);

      osc3.disconnect();
      osc3.connect(filter);
    };

    p.draw = function() {
      // Keeping this for debugging purposes
    }

    p.keyPressed = function() {
      // PLAY NOTES
      if (keyCodes.includes(p.keyCode)) {
        notePlaying = p.keyCode;

        // VCO 1
        vco1.frequency =
          keyMap[notePlaying] *
          octaveMap[octave].frequencyFactor *
          1.05946309435 ** pitchMap[vco1.pitchMidi]
        osc1.freq(vco1.frequency);
        osc1.start();

        // VCO 2
        vco2.frequency =
          keyMap[notePlaying] *
          octaveMap[octave].frequencyFactor *
          1.05946309435 ** pitchMap[vco2.pitchMidi]
        osc2.freq(vco2.frequency);
        osc2.start();

        // VCO 3
        vco3.frequency =
          keyMap[notePlaying] *
          octaveMap[octave].frequencyFactor *
          1.05946309435 ** pitchMap[vco3.pitchMidi]
        osc3.freq(vco3.frequency);
        osc3.start();
      }

      // OCTAVE DOWN (Z KEY)
      if (zKeyCode == p.keyCode) {
        if (octave > -1) {
          octave -= 1;
        }
        VS.display.update(octaveMap[octave].displayNumber, 'noteString');
      }

      // OCTAVE UP (X KEY)
      if (xKeyCode == p.keyCode) {
        if (octave < 9) {
          octave += 1;
        }
        VS.display.update(octaveMap[octave].displayNumber, 'noteString');
      }
    };

    p.keyReleased = function() {
      if (p.keyIsPressed) { return; }
      osc1.stop();
      osc2.stop();
      osc3.stop();
    };

    const toggleVcoWave = function(osc, vco) {
       if (vco.shape == 'sawtooth') {
         vco.shape = 'square';
       } else {
         vco.shape = 'sawtooth';
      }
      osc.setType(vco.shape);
    };

    // LFO TARGET PITCH
    $('label[for="patch_lfo_target_pitch"]').on('click tap', function() {
      lfo.targetPitch = !lfo.targetPitch;
      // FIXME: pitch LFO on the lowest octave causes frequency
      //   to go up for some reason.
      if (lfo.targetPitch) {
        // Affect pitch
        oscLfo.start();
        osc1.freq(oscLfo);
        osc2.freq(oscLfo);
        osc3.freq(oscLfo);
      } else {
        // Do not affect pitch
        oscLfo.stop();
        osc1.freq(vco1.frequency);
        osc2.freq(vco2.frequency);
        osc3.freq(vco3.frequency);
      }
    });

    // LFO WAVE
    $('label[for="patch_lfo_wave"]').on('click tap', function() {
       if (lfo.shape == 'triangle') {
         lfo.shape = 'square';
       } else {
         lfo.shape = 'triangle';
      }
      oscLfo.setType(lfo.shape);
    });

    // VCO1 WAVE
    $('label[for="patch_vco1_wave"]').on('click tap', function() {
      toggleVcoWave(osc1, vco1);
    });

    // VCO2 WAVE
    $('label[for="patch_vco2_wave"]').on('click tap', function() {
      toggleVcoWave(osc2, vco2);
    });

    // VCO3 WAVE
    $('label[for="patch_vco3_wave"]').on('click tap', function() {
      toggleVcoWave(osc3, vco3);
    });

    const toggleVcoAmp = function(osc, vco) {
      if (vco.amp == 1) {
        vco.amp = 0;
      } else {
        vco.amp = 1;
      }
      osc.amp(vco.amp);
    };

    // VCO1 ON/OFF
    $('#vco1_active_button').on('click tap', function(){
      toggleVcoAmp(osc1, vco1);
    });

    // VCO2 ON/OFF
    $('#vco2_active_button').on('click tap', function(){
      toggleVcoAmp(osc2, vco2);
    });

    // VCO3 ON/OFF
    $('#vco3_active_button').on('click tap', function(){
      toggleVcoAmp(osc3, vco3);
    });

    $(document).on('mousemove touchmove', function(e) {
      if (VS.activeKnob === null) { return; }

      // FILTER CUTOFF
      if (VS.activeKnob.element.id == 'cutoff') {
        let cutoff, midiValue, percentage, frequency;

        cutoff = VS.activeKnob

        midiValue = $(cutoff.element).data('trueMidi');
        if (midiValue == undefined) { return; }

        percentage = midiValue / 127.0;
        frequency = 20 + (percentage**3 * 19980.0);

        filter.freq(frequency);
      }

      // FILTER PEAK (RESONANCE)
      if (VS.activeKnob.element.id == 'peak') {
        let peak, midiValue, percentage, peakAmount;

        peak = VS.activeKnob

        midiValue = $(peak.element).data('trueMidi');
        if (midiValue == undefined) { return; }

        percentage = midiValue / 127.0;
        peakAmount = (percentage * 30.0);

        filter.res(peakAmount);
      }

      // LFO RATE
      if (VS.activeKnob.element.id == 'lfo_rate') {
        let lfoRate, midiValue, percentage, peakAmount;

        lfoRate = VS.activeKnob

        midiValue = $(lfoRate.element).data('trueMidi');
        if (midiValue == undefined) { return; }

        percentage = midiValue / 127.0;
        lfoRateValue = (percentage**3 * 35) + 0.1;

        oscLfo.freq(lfoRateValue);
      }

      // LFO INT
      if (VS.activeKnob.element.id == 'lfo_int') {
        let lfoInt, midiValue, percentage, peakAmount;

        lfoInt = VS.activeKnob

        midiValue = $(lfoInt.element).data('trueMidi');
        if (midiValue == undefined) { return; }

        percentage = midiValue / 127.0;
        lfoIntValue = percentage * 200;

        oscLfo.amp(lfoIntValue);
      }

      // VCO1 PITCH
      if (VS.activeKnob.element.id == 'vco1_pitch') {
        let vco1Pitch, midiValue, newFrequency;

        vco1Pitch = VS.activeKnob

        midiValue = $(vco1Pitch.element).data('midi');
        if (midiValue == undefined) { return; }

        vco1.pitchMidi = midiValue;
        newFrequency =
          keyMap[notePlaying] *
          octaveMap[octave].frequencyFactor *
          1.05946309435 ** pitchMap[vco1.pitchMidi];

        osc1.freq(newFrequency);
      }

      // VCO2 PITCH
      if (VS.activeKnob.element.id == 'vco2_pitch') {
        let vco2Pitch, midiValue, newFrequency;

        vco2Pitch = VS.activeKnob

        midiValue = $(vco2Pitch.element).data('midi');
        if (midiValue == undefined) { return; }

        vco2.pitchMidi = midiValue;
        newFrequency =
          keyMap[notePlaying] *
          octaveMap[octave].frequencyFactor *
          1.05946309435 ** pitchMap[vco2.pitchMidi]

        osc2.freq(newFrequency);
      }

      // VCO3 PITCH
      if (VS.activeKnob.element.id == 'vco3_pitch') {
        let vco3Pitch, midiValue, newFrequency;

        vco3Pitch = VS.activeKnob

        midiValue = $(vco3Pitch.element).data('midi');
        if (midiValue == undefined) { return; }

        vco3.pitchMidi = midiValue;
        newFrequency =
          keyMap[notePlaying] *
          octaveMap[octave].frequencyFactor *
          1.05946309435 ** pitchMap[vco3.pitchMidi]

        osc3.freq(newFrequency);
      }
    });
  });
};
