export class TempoTracker {
  private bpm = 0;
  private beatInterval = 0;
  private lastBeatOverflow = 0;

  setBpm(bpm: number) {
    this.bpm = bpm;
    this.beatInterval = 60 / bpm;
  }

  update({ deltaTime }: { deltaTime: number }) {
    if (this.beatInterval === 0) {
      throw new Error('Beat interval cannot be 0');
    }
    const accumulated = this.lastBeatOverflow + deltaTime;
    if (accumulated < this.beatInterval) {
      this.lastBeatOverflow += deltaTime;
      return;
    }
    this.lastBeatOverflow = accumulated % this.beatInterval;
  }

  getBeatProgress() {
    return this.lastBeatOverflow / this.beatInterval;
  }
}
