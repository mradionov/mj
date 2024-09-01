import { Node, NodeLoadArgs } from './node';

type Color = [number, number, number, number];

export class CirclePulse extends Node {
  private readonly vertices: number[];

  private program: WebGLProgram;

  private vertexBuffer: WebGLBuffer;
  private vertexLocation: GLuint;
  private resolutionLocation: WebGLUniformLocation;
  private positionLocation: WebGLUniformLocation;
  private radiusLocation: WebGLUniformLocation;
  private progressLocation: WebGLUniformLocation;
  private colorLocation: WebGLUniformLocation;

  constructor(
    readonly x,
    readonly y,
    readonly radius,
    readonly color: Color = [0, 0, 1, 1],
    readonly segmentCount = 100,
  ) {
    super();

    const centerX = x + radius;
    const centerY = y + radius;

    const vertices = [];

    const angleStep = (2 * Math.PI) / segmentCount;

    for (let i = 0; i < segmentCount; i++) {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      vertices.push(x, y);
    }

    this.vertices = vertices;
  }

  async load({ gl, shaderLoader }: NodeLoadArgs) {
    const shaders = await shaderLoader.load([
      'nodes/circle_pulse.vert',
      'nodes/circle_pulse.frag',
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

    this.radiusLocation = gl.getUniformLocation(program, 'uRadius');
    gl.uniform1f(this.radiusLocation, this.radius);

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

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segmentCount);
  }
}
