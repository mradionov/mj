type Color = [number, number, number, number];

export class RectNode {
  constructor(
    readonly x,
    readonly y,
    readonly width,
    readonly height,
    readonly color: Color = [0, 0, 1, 1],
  ) {}
}
