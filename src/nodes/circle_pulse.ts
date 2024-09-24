import { Node, NodeDrawArgs, NodeLoadArgs, NodeUpdateArgs } from './node';
import { BeatKey } from '../tempo';

type Color = [number, number, number, number];

export class CirclePulse extends Node {
  private readonly vertices: number[];
  private timeLocation: WebGLUniformLocation;
  private progressLocation: WebGLUniformLocation;

  private program: WebGLProgram;

  private vertexBuffer: WebGLBuffer;
  private vertexLocation: GLuint;

  constructor(
    readonly x,
    readonly y,
    readonly size,
    readonly color: Color = [0, 0, 1, 1],
    readonly beatKey: BeatKey = 'beat',
  ) {
    super();

    const x1 = x;
    const x2 = x + size;
    const y1 = y;
    const y2 = y + size;

    this.vertices = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
  }

  async load({ gl, programFactory }: NodeLoadArgs) {
    const program = await programFactory.create({
      vertexShaderPath: 'nodes/circle_pulse.vert',
      fragmentShaderPath: 'nodes/circle_pulse.frag',
    });
    this.program = program;
    gl.useProgram(program);

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW,
    );

    this.vertexLocation = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vertexLocation);

    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    const dimensionsLocation = gl.getUniformLocation(program, 'uDimensions');
    gl.uniform2f(dimensionsLocation, this.size, this.size);

    const positionLocation = gl.getUniformLocation(program, 'uPosition');
    gl.uniform2f(positionLocation, this.x, this.y);

    const colorLocation = gl.getUniformLocation(program, 'uColor');
    gl.uniform4f(colorLocation, ...this.color);

    this.progressLocation = gl.getUniformLocation(program, 'uProgress');
  }

  update({ gl, time, beatProgress }: NodeUpdateArgs): void {
    gl.useProgram(this.program);

    gl.uniform1f(this.timeLocation, time);
    gl.uniform1f(this.progressLocation, beatProgress[this.beatKey]);
  }

  draw({ gl }: NodeDrawArgs) {
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
