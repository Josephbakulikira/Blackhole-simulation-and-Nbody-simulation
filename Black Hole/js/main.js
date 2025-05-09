import * as THREE from 'three';
import { degree_to_radian, Mapping } from './utils.js';
import canvasVertexShader from '../shaders/canvasVertexShader.glsl.js';
import canvasFragmentShader from '../shaders/canvasFragmentShader.glsl.js';

//-----------------------------
//------------SETUP------------
//-----------------------------
const w = window.innerWidth;
const h = window.innerHeight;
const aspect = w/h;

let offsetCameraPosition = new THREE.Vector3(0, 0, 0);

const fov = 50;
const near = 0.1;
const far = 1000;

const min_camera = -100;
const max_camera = 100;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 1;
const fov_y = camera.position.z * Math.tan(degree_to_radian(fov)/2) * 2; 

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// ----- create a plane Mesh and load it textture (background)
const canvas_geo = new THREE.PlaneGeometry(fov_y * camera.aspect, fov_y);
const canvas_texture = new THREE.TextureLoader().load("/images/cosmic.jpg", () => {
    renderer.render(scene, camera);
});

const canvas_mat = new THREE.ShaderMaterial({
    uniforms: {
        uResolution: {
            value: new THREE.Vector2(w, h),
        },
        uCanvasTexture: {
            value: canvas_texture,
        },
        uPov: {
            value: 50.0,
        },
        uCameraTranslate: {
            value: offsetCameraPosition,
        }
    },
    vertexShader: canvasVertexShader,
    fragmentShader: canvasFragmentShader,
});
const canvas = new THREE.Mesh(canvas_geo, canvas_mat);

//------update scene-----
scene.add(canvas);

// function updateCameraPos(mouseX, mouseY){
//     offsetCameraPosition.x = Mapping(mouseX, 0, w, 0,100) * 0.5;
//     // offsetCameraPosition.y = Mapping(mouseX * 2, 0, w, 0, 100) * 0.5;
//     // offsetCameraPosition.z = 


//     // canvas_mat.uniforms.uCameraTranslate = offsetCameraPosition;
//     // console.log(offsetCameraPosition);
//     renderer.render(scene, camera);

// }

var speed_dir = 0.01;


setInterval(() => {
    offsetCameraPosition.x += speed_dir;

    if(offsetCameraPosition.x > 4 || offsetCameraPosition.x <= -4){
        speed_dir *= -1;
    }
    // console.log(offsetCameraPosition.x);
    renderer.render(scene, camera);
}, 80);



// function animate(){
// requestAnimationFrame(animate)

// }
renderer.render(scene, camera);

window.addEventListener("mousemove", ({clientX, clientY}) => {
    // console.log(clientX, clientY);
    // updateCameraPos(clientX, clientY);

} )

window.addEventListener("wheel", ({deltaY}) => {
    // console.log(clientX, clientY);
    // updateCameraPos(clientX, clientY);
    offsetCameraPosition.z += Mapping(deltaY, -h, h, -10, 10) * 0.3;
    renderer.render(scene, camera);
} )
