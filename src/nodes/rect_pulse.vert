precision mediump float;

attribute vec2 aPosition;
varying vec2 vPosition;

uniform vec2 uResolution;

void main() {
    // convert to clip space and flip y-axis
    vec2 clip = ((aPosition / uResolution) * 2.0 - 1.0) * vec2(1, -1);

    gl_Position = vec4(clip, 0, 1);

    // send interpolated coordinate to fragment shader
    vPosition = aPosition;
}
