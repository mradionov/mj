precision mediump float;

varying vec2 vPosition;

uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uDimensions;
uniform vec2 uPosition;
uniform vec4 uColor;

void main() {
    float thickness = 2.0;

    bool isOutline = (vPosition.x < uPosition.x + thickness)
        || (vPosition.x > uPosition.x + uDimensions.x - thickness)
        || (vPosition.y < uPosition.y + thickness)
        || (vPosition.y > uPosition.y + uDimensions.y - thickness);

    vec2 progressDimensions = uDimensions * uProgress;

    bool isProgress = vPosition.x > uPosition.x + uDimensions.x / 2.0 - progressDimensions.x / 2.0
        && vPosition.x < uPosition.x + uDimensions.x / 2.0 + progressDimensions.x / 2.0
        && vPosition.y > uPosition.y + uDimensions.y / 2.0 - progressDimensions.y / 2.0
        && vPosition.y < uPosition.y + uDimensions.y / 2.0 + progressDimensions.y / 2.0;

    if (isOutline || isProgress) {
        gl_FragColor = uColor;
    } else {
        discard;
    }
}
