import * as THREE from 'three';
import { degree_to_radian } from './utils.js';
import canvasVertexShader from '../shaders/canvasVertexShader.glsl.js';
import canvasFragmentShader from '../shaders/canvasFragmentShader.glsl.js';

//-----------------------------
//------------SETUP------------
//-----------------------------
const w = window.innerWidth;
const h = window.innerHeight;
const aspect = w/h;

const fov = 75;
const near = 0.1;
const far = 1000;
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

const canvas_geo = new THREE.PlaneGeometry(fov_y * camera.aspect, fov_y);
const canvas_mat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: canvasVertexShader,
    fragmentShader: canvasFragmentShader,
});
const canvas = new THREE.Mesh(canvas_geo, canvas_mat);

//------update scene-----
scene.add(canvas);

renderer.render(scene, camera);
