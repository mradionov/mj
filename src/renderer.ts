import { Node } from './nodes/node';
import { BeatProgress } from './tempo';

export class Renderer {
  constructor(private readonly gl: WebGLRenderingContext) {}

  update({
    nodes,
    beatProgress,
    time,
  }: {
    nodes: Node[];
    beatProgress: BeatProgress;
    time: number;
  }) {
    const { gl } = this;

    for (const node of nodes) {
      node.update({ gl, beatProgress, time });
    }
  }

  draw({ nodes }: { nodes: Node[] }) {
    const { gl } = this;

    gl.useProgram(null);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const node of nodes) {
      node.draw({ gl });
    }
  }
}
