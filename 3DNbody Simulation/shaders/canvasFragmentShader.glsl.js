const fragmentShader = `
    varying vec2 u_v;

    void main() {
        gl_FragColor = vec4(u_v.x, u_v.y, 255, 1.0);
    }
`;

export default fragmentShader;