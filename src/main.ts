import { RenderLoop } from './loop';
import { TempoTracker } from './tempo';
import { Renderer } from './renderer';
import { Node } from './nodes/node';
import { RectPulse } from './nodes/rect_pulse';
import { ShaderLoader } from './shader';
import { ProgramFactory } from './program';
import { CirclePulse } from './nodes/circle_pulse';

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

function update({ time, deltaTime }: { time: number; deltaTime: number }) {
  const bpm = Number(bpmInput.value);
  tempoTracker.setBpm(bpm);
  tempoTracker.update({ deltaTime });

  const beatProgress = tempoTracker.getBeatProgress();

  renderer.update({ nodes, time, beatProgress });
}

function draw() {
  renderer.draw({ nodes });
}

function tick({ time, deltaTime }: { time: number; deltaTime: number }) {
  update({ time, deltaTime });
  draw();
}

const nodes: Node[] = [
  new CirclePulse(0, 0, 50, [1, 1, 0, 1], 'beat16th'),
  new CirclePulse(0, 0, 50, [1, 1, 0, 1], 'beat8th'),
  new CirclePulse(50, 0, 50, [1, 1, 0, 1], 'beat4th'),
  new CirclePulse(100, 0, 50, [1, 1, 0, 1], 'beat2th'),
  new CirclePulse(150, 0, 50, [1, 1, 0, 1], 'beat'),
  new CirclePulse(200, 0, 50, [1, 1, 0, 1], 'beat2x'),
  new CirclePulse(250, 0, 50, [1, 1, 0, 1], 'beat4x'),
  new CirclePulse(300, 0, 50, [1, 1, 0, 1], 'beat8x'),
  new CirclePulse(350, 0, 50, [1, 1, 0, 1], 'beat16x'),
  new CirclePulse(400, 0, 50, [1, 1, 0, 1], 'beat32x'),
  new CirclePulse(450, 150, 30, [1, 0, 1, 1]),
  new RectPulse(200, 150, 100, 30, [0, 1, 0, 1]),
  new RectPulse(250, 350, 70, 230, [0, 0, 1, 1]),
];

const shaderLoader = new ShaderLoader(gl);
const programFactory = new ProgramFactory(gl, shaderLoader);
const renderLoop = new RenderLoop({
  onTick: tick,
});
const tempoTracker = new TempoTracker();
const renderer = new Renderer(gl);

async function main() {
  for (const node of nodes) {
    await node.load({ gl, programFactory });
  }

  // renderLoop.next();
  renderLoop.start();
}

void main();
