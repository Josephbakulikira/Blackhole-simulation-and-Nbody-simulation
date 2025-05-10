import * as THREE from 'three';
import { degree_to_radian, Mapping } from './utils.js';
import canvasVertexShader from '../shaders/canvasVertexShader.glsl.js';
import canvasFragmentShader from '../shaders/canvasFragmentShader.glsl.js';
import {GUI} from 'dat.gui';

//-----------------------------
//------------SETUP------------
//-----------------------------
const w = window.innerWidth;
const h = window.innerHeight;
const aspect = w/h;
var refreshintervalueID;

var offsetCameraPosition = new THREE.Vector3(0, 0, 0);
const settings = {
    accretion_disk: false,
    animate: false,
    speed: 0.01,
    max_iterations: 400,

};

const fov = 50;
const near = 0.1;
const far = 1000;

GUI.TEXT_OPEN = "Parameters";
GUI.TEXT_CLOSED = "Close";
const gui = new GUI();

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
const canvas_texture = new THREE.TextureLoader().load("/images/sky2.jpg", () => {
    renderer.render(scene, camera);
});

const canvas_mat = new THREE.ShaderMaterial({
    uniforms: {
        uAccretionDisk: {
            value: settings.accretion_disk ? 1 : 0,
        },
        uResolution: {
            value: new THREE.Vector2(w, h),
        },
        uCanvasTexture: {
            value: canvas_texture,
        },
        uMaxIterations: {
            value: settings.max_iterations,
        },
        uPov: {
            value: 75.0,
        },

        uStepSize: {
            value: 2.5 / settings.max_iterations,
        },
        uCameraTranslate: {
            value: offsetCameraPosition,
        }
    },
    vertexShader: canvasVertexShader,
    fragmentShader: canvasFragmentShader,
});
var canvas = new THREE.Mesh(canvas_geo, canvas_mat);

//--------------------------------------------
//-------------- DAT.GUI SETUP ---------------
//--------------------------------------------

gui.add(settings, "max_iterations", 0, 2000).step(1).name("Iterations").onChange(()=>{
    canvas_mat.uniforms.uAccretionDisk = {value: settings.max_iterations}

    renderer.render(scene, camera);
});
gui.add(settings, "speed", 0, 1).name("Speed").step(0.001);
gui.add(settings, "accretion_disk").name("Accretion Disk").onChange(() => {
    canvas_mat.uniforms.uAccretionDisk = {value: settings.accretion_disk ? 1 : 0}
    renderer.render(scene, camera);
});
gui.add(settings, "animate").onChange(() => {
    if(settings.animate){
        animation();
    }else{
        clearInterval(refreshintervalueID);
    }
});
const camera_pos_gui = gui.addFolder('camera position');
camera_pos_gui.add(offsetCameraPosition, 'x', -4, 4).step(0.0001).onChange(() => {
    renderer.render(scene, camera)
});
camera_pos_gui.add(offsetCameraPosition, 'y', -4, 4).step(0.0001).onChange(() => {
    renderer.render(scene, camera)
});
camera_pos_gui.add(offsetCameraPosition, 'z', -4, 4).step(0.0001).onChange(() => {
    renderer.render(scene, camera);
});
camera_pos_gui.open();


//------update scene-----
scene.add(canvas);

function animation(){
    refreshintervalueID = setInterval(() => {
        offsetCameraPosition.x += settings.speed;
    
        if(offsetCameraPosition.x > 4 || offsetCameraPosition.x <= -4){
            settings.speed *= -1;
        }
        // console.log(offsetCameraPosition.x);
        renderer.render(scene, camera);
    }, 100);
}
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
