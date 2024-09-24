export class ProgramFactory {
  constructor(
    private readonly gl,
    private readonly shaderLoader,
  ) {}

  async create({
    vertexShaderPath,
    fragmentShaderPath,
  }: {
    vertexShaderPath: string;
    fragmentShaderPath: string;
  }) {
    const { gl } = this;

    const shaders = await this.shaderLoader.load([
      vertexShaderPath,
      fragmentShaderPath,
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

    return program;
  }
}
