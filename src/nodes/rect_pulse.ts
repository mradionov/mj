import { Node, NodeLoadArgs } from './node';

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

  async load({ gl, shaderLoader }: NodeLoadArgs) {
    const shaders = await shaderLoader.load([
      'nodes/rect_pulse.vert',
      'nodes/rect_pulse.frag',
    ]);

    const program = gl.createProgram();

    for (const shader of shaders) {
      gl.attachShader(program, shader);
    }

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program error: ${error}`);
    }

    gl.useProgram(program);

    this.program = program;

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

  update({
    gl,
    beatProgress,
  }: {
    gl: WebGLRenderingContext;
    beatProgress: number;
  }) {
    gl.useProgram(this.program);

    gl.uniform1f(this.progressLocation, beatProgress);
  }

  draw({ gl }: { gl: WebGLRenderingContext }) {
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
