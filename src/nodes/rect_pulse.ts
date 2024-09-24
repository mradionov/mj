import { Node, NodeDrawArgs, NodeLoadArgs, NodeUpdateArgs } from './node';

type Color = [number, number, number, number];

export class RectPulse extends Node {
  private readonly vertices: number[];

  private program: WebGLProgram;

  private vertexBuffer: WebGLBuffer;
  private vertexLocation: GLuint;
  private resolutionLocation: WebGLUniformLocation;
  private positionLocation: WebGLUniformLocation;
  private dimensionsLocation: WebGLUniformLocation;
  private progressLocation: WebGLUniformLocation;
  private colorLocation: WebGLUniformLocation;

  constructor(
    readonly x,
    readonly y,
    readonly width,
    readonly height,
    readonly color: Color = [0, 0, 1, 1],
  ) {
    super();

    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    this.vertices = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
  }

  async load({ gl, programFactory }: NodeLoadArgs) {
    const program = await programFactory.create({
      vertexShaderPath: 'nodes/rect_pulse.vert',
      fragmentShaderPath: 'nodes/rect_pulse.frag',
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

    this.resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);

    this.dimensionsLocation = gl.getUniformLocation(program, 'uDimensions');
    gl.uniform2f(this.dimensionsLocation, this.width, this.height);

    this.positionLocation = gl.getUniformLocation(program, 'uPosition');
    gl.uniform2f(this.positionLocation, this.x, this.y);

    this.colorLocation = gl.getUniformLocation(program, 'uColor');
    gl.uniform4f(this.colorLocation, ...this.color);

    this.progressLocation = gl.getUniformLocation(program, 'uProgress');
  }

  update({ gl, beatProgress }: NodeUpdateArgs) {
    gl.useProgram(this.program);

    gl.uniform1f(this.progressLocation, beatProgress.beat);
  }

  draw({ gl }: NodeDrawArgs) {
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
