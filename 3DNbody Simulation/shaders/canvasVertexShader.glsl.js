const vertexShader = `
    varying vec2 u_v;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        u_v = uv;
    }
`;

export default vertexShader;