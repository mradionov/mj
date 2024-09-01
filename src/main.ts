import { RenderLoop } from './loop';
import { TempoTracker } from './tempo';
import { Renderer } from './renderer';
import { RectNode } from './node';

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
  renderer.draw({ nodes });
}

function tick({ deltaTime }: { deltaTime: number }) {
  update({ deltaTime });
  draw();
}

const nodes: RectNode[] = [
  new RectNode(10, 10, 100, 100, [1, 0, 0, 1]),
  new RectNode(200, 150, 100, 30, [0, 1, 0, 1]),
  new RectNode(250, 350, 70, 230, [0, 0, 1, 1]),
];

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
