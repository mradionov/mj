import { RenderLoop } from './loop';

const WIDTH = 1920;
const HEIGHT = 1080;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const fullscreenButton = document.getElementById('fullscreen-btn');
fullscreenButton.addEventListener('click', async () => {
  await canvas.requestFullscreen();
});

function tick({ deltaTime }: { deltaTime: number }) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.font = '30px serif';
  ctx.fillStyle = 'red';
  ctx.fillText(`${deltaTime}`, 10, 50);
}

const loop = new RenderLoop({
  onTick: tick,
});

async function main() {
  loop.start();
}

void main();
