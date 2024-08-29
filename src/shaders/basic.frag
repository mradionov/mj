precision mediump float;

varying vec2 vPosition;
uniform float uProgress;

void main() {
    float thickness = 0.01;

    vec2 size = vec2(0.5, 0.5);
    vec2 absPosition = abs(vPosition);
    vec2 progressPosition = size * uProgress;

    if (absPosition.x > size.x - thickness || absPosition.y > size.y - thickness) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } else if (absPosition.x < progressPosition.x && absPosition.y < progressPosition.y) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    } else {
        discard;
    }
}
