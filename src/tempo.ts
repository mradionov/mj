export type BeatProgress = {
  beat: number;
  beat2x: number;
  beat4x: number;
  beat8x: number;
  beat16x: number;
  beat32x: number;
  beat2th: number;
  beat4th: number;
  beat8th: number;
  beat16th: number;
};

export type BeatKey = keyof BeatProgress;

export class TempoTracker {
  // must be equal to the max number of beats multiplier "x"
  private scale = 32;

  private bpm = 0;
  private beatInterval = 0;
  private scaledInterval = 0;
  private lastBeatOverflow = 0;

  setBpm(bpm: number) {
    this.bpm = bpm;
    this.beatInterval = 60 / bpm;
    this.scaledInterval = this.beatInterval * this.scale;
  }

  update({ deltaTime }: { deltaTime: number }) {
    if (this.beatInterval === 0) {
      throw new Error('Beat interval cannot be 0');
    }
    const accumulated = this.lastBeatOverflow + deltaTime;
    if (accumulated < this.scaledInterval) {
      this.lastBeatOverflow += deltaTime;
      return;
    }
    this.lastBeatOverflow = accumulated % this.scaledInterval;
  }

  getBeatProgress(): BeatProgress {
    return {
      beat: this.calcX(1),
      beat2x: this.calcX(2),
      beat4x: this.calcX(4),
      beat8x: this.calcX(8),
      beat16x: this.calcX(16),
      beat32x: this.calcX(32),
      beat2th: this.calcTh(2),
      beat4th: this.calcTh(4),
      beat8th: this.calcTh(8),
      beat16th: this.calcTh(16),
    };
  }

  private calcX(bars: number) {
    const scaledBeat = this.lastBeatOverflow / this.scaledInterval;
    return ((scaledBeat * this.scale) / bars) % 1;
  }

  private calcTh(th: number) {
    const beat = this.calcX(1);
    return (beat * th) % 1;
  }
}
