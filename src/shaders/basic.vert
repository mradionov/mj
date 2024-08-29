attribute vec4 aVertexPosition;
varying vec2 vPosition;

void main() {
    gl_Position = aVertexPosition;
    vPosition = aVertexPosition.xy;
}
