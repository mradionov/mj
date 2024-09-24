precision mediump float;

varying vec2 vPosition;

uniform vec2 uResolution;
uniform vec2 uDimensions;
uniform vec2 uPosition;
uniform float uProgress;
uniform vec4 uColor;

void main() {
    float maxRadius = uDimensions.x / 2.0;

    vec2 center = uPosition + maxRadius;

    float dist = length(center - vPosition);

    float radius = maxRadius * uProgress;

    float circle = smoothstep(radius, radius, dist);

    vec3 color = vec3(uColor - circle);

    gl_FragColor = vec4(color, 1.0);
}
