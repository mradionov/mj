import { RenderLoop } from './loop';
import { TempoTracker } from './tempo';
import { Renderer } from './renderer';

const WIDTH = 800;
const HEIGHT = 600;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl');

const fullscreenButton = document.getElementById('fullscreen-btn');
fullscreenButton.addEventListener('click', async () => {
  await canvas.requestFullscreen();
});

const bpmInput = document.getElementById('bpm-input') as HTMLInputElement;
bpmInput.addEventListener('change', () => {});

function update({ deltaTime }: { deltaTime: number }) {
  const bpm = Number(bpmInput.value);
  tempoTracker.setBpm(bpm);
  tempoTracker.update({ deltaTime });

  const beatProgress = tempoTracker.getBeatProgress();

  renderer.update({ beatProgress });
}

function draw() {
  renderer.draw();
}

function tick({ deltaTime }: { deltaTime: number }) {
  update({ deltaTime });
  draw();
}

const renderLoop = new RenderLoop({
  onTick: tick,
});
const tempoTracker = new TempoTracker();
const renderer = new Renderer(gl);

async function main() {
  await renderer.load();
  renderLoop.start();
}

void main();
