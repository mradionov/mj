import { ProgramFactory } from '../program';
import { BeatProgress } from '../tempo';

export type NodeLoadArgs = {
  gl: WebGLRenderingContext;
  programFactory: ProgramFactory;
};

export type NodeUpdateArgs = {
  gl: WebGLRenderingContext;
  beatProgress: BeatProgress;
  time: number;
};

export type NodeDrawArgs = { gl: WebGLRenderingContext };

export abstract class Node {
  abstract load(args: NodeLoadArgs): void;

  abstract update(args: NodeUpdateArgs): void;

  abstract draw(args: NodeDrawArgs): void;
}
