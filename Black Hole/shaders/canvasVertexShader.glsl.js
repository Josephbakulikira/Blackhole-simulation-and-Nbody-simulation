const vertexShader = `
    varying vec2 vu;
    uniform vec2 uResolution;
    
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vu = uv;
    }
`;

export default vertexShader;