precision mediump float;

varying vec2 vPosition;

uniform float uProgress;
uniform vec2 uResolution;
uniform float uRadius;
uniform vec2 uPosition;
uniform vec4 uColor;

void main() {
    float thickness = 2.0;

    float progressRadius = uRadius * uProgress;

    vec2 center = uPosition + uRadius;

    bool isOutline = pow(vPosition.x - center.x, 2.0) + pow(vPosition.y - center.y, 2.0) > pow(uRadius - thickness, 2.0);

    bool isProgress = pow(vPosition.x - center.x, 2.0) + pow(vPosition.y - center.y, 2.0) < pow(progressRadius, 2.0);

    if (isOutline || isProgress) {
        gl_FragColor = uColor;
    } else {
        discard;
    }
}
