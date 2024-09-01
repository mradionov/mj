import { ShaderLoader } from '../shader';

export type NodeLoadArgs = {
  gl: WebGLRenderingContext;
  shaderLoader: ShaderLoader;
};

export type NodeUpdateArgs = {
  gl: WebGLRenderingContext;
  beatProgress: number;
};

export type NodeDrawArgs = { gl: WebGLRenderingContext };

export abstract class Node {
  abstract load(args: NodeLoadArgs): void;

  abstract update(args: NodeUpdateArgs): void;

  abstract draw(args: NodeDrawArgs): void;
}
