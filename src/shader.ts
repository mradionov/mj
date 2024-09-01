export class ShaderLoader {
  private cache = new Map<string, WebGLShader>();

  constructor(private readonly gl: WebGLRenderingContext) {}

  async load(paths: string[]): Promise<WebGLShader[]> {
    return Promise.all(paths.map((path) => this.loadOne(path)));
  }

  async loadOne(path: string): Promise<WebGLShader> {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    const response = await fetch(path);
    const source = await response.text();

    const { gl } = this;

    const type = this.getShaderType(path);
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const errorText = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader error: ${errorText}`);
    }

    this.cache.set(path, shader);

    return shader;
  }

  private getShaderType(path: string): GLenum {
    const ext = path.slice(path.lastIndexOf('.'));
    switch (ext) {
      case '.frag':
        return this.gl.FRAGMENT_SHADER;
      case '.vert':
        return this.gl.VERTEX_SHADER;
      default:
        throw new Error(`Unknown shader extension: "${ext}"`);
    }
  }
}
