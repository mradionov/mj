import { RectNode } from './node';

export class Renderer {
  private progressLocation: WebGLUniformLocation;
  private resolutionLocation: WebGLUniformLocation;
  private dimensionsLocation: WebGLUniformLocation;
  private positionLocation: WebGLUniformLocation;
  private colorLocation: WebGLUniformLocation;
  private vertexBuffer: WebGLBuffer;

  constructor(private readonly gl: WebGLRenderingContext) {}

  async load() {
    const { gl } = this;

    const vertexShaderText = await fetch('shaders/rect_pulse.vert').then((r) =>
      r.text(),
    );
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(vertexShader);
      gl.deleteShader(vertexShader);
      throw new Error(`Shader error: ${error}`);
    }

    const fragmentShaderText = await fetch('shaders/rect_pulse.frag').then(
      (r) => r.text(),
    );
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(fragmentShader);
      gl.deleteShader(fragmentShader);
      throw new Error(`Shader error: ${error}`);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program error: ${error}`);
    }

    gl.useProgram(program);

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    const position = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    this.progressLocation = gl.getUniformLocation(program, 'uProgress');

    this.resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);

    this.dimensionsLocation = gl.getUniformLocation(program, 'uDimensions');
    this.positionLocation = gl.getUniformLocation(program, 'uPosition');
    this.colorLocation = gl.getUniformLocation(program, 'uColor');
  }

  update({ beatProgress }: { beatProgress: number }) {
    const { gl } = this;

    gl.uniform1f(this.progressLocation, beatProgress);
  }

  draw({ nodes }: { nodes: RectNode[] }) {
    const { gl } = this;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const node of nodes) {
      const x1 = node.x;
      const x2 = node.x + node.width;
      const y1 = node.y;
      const y2 = node.y + node.height;

      const vertices = new Float32Array([
        x1,
        y1,
        x2,
        y1,
        x1,
        y2,
        x1,
        y2,
        x2,
        y1,
        x2,
        y2,
      ]);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      gl.uniform2f(this.positionLocation, x1, y1);
      gl.uniform2f(this.dimensionsLocation, node.width, node.height);
      gl.uniform4f(this.colorLocation, ...node.color);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}
