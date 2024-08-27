import { RenderLoop } from './loop';
import { TempoTracker } from './tempo';

const WIDTH = 800;
const HEIGHT = 600;

const state: {
  bpm: number;
} = {
  bpm: 0,
};

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const fullscreenButton = document.getElementById('fullscreen-btn');
fullscreenButton.addEventListener('click', async () => {
  await canvas.requestFullscreen();
});

const bpmInput = document.getElementById('bpm-input') as HTMLInputElement;
bpmInput.addEventListener('change', () => {});

function update({ deltaTime }: { deltaTime: number }) {
  state.bpm = Number(bpmInput.value);
  tempoTracker.setBpm(state.bpm);

  tempoTracker.update({ deltaTime });
}

function draw({
  deltaTime,
  beatProgress,
}: {
  deltaTime: number;
  beatProgress: number;
}) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.font = '30px serif';
  ctx.fillStyle = 'red';
  ctx.fillText(`${deltaTime}`, 10, 50);

  drawBeat({ beatProgress });
}

function drawBeat({ beatProgress }: { beatProgress: number }) {
  const x = 30;
  const y = 100;
  const w = 200;
  const h = 200;

  ctx.strokeStyle = 'blue';
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = 'blue';
  ctx.fillRect(
    x + w / 2 - (w / 2) * beatProgress,
    y + h / 2 - (h / 2) * beatProgress,
    w * beatProgress,
    h * beatProgress,
  );
}

function tick({ deltaTime }: { deltaTime: number }) {
  update({ deltaTime });

  const beatProgress = tempoTracker.getBeatProgress();

  draw({ deltaTime, beatProgress });
}

const renderLoop = new RenderLoop({
  onTick: tick,
});
const tempoTracker = new TempoTracker();

async function main() {
  renderLoop.start();
}

void main();
