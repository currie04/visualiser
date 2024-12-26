

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Create scene
const scene = new THREE.Scene();

//Create Camera
const camera = new THREE.PerspectiveCamera( 
    45, 
    window.innerWidth/window.innerHeight, 
    5, 
    1000
);


//Set orbit controls to move camera
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(6, 8, 14);
orbit.update();



//time uniform
const uniforms = {
    u_time: { value: 0.0 },
    u_frequency: { value: 0.0},
  };


//Creating and adding a sphere to the scene
const geometry = new THREE.IcosahedronGeometry(5, 30); 
const material = new THREE.ShaderMaterial({ 
    wireframe: true,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    uniforms: uniforms,
});
const visualiser = new THREE.Mesh(geometry, material)
scene.add(visualiser);



//audio
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('sample-5.ogg', function (buffer) {
  sound.setBuffer(buffer);
  window.addEventListener('click', function () {
    sound.play();
  });
});

const analyser = new THREE.AudioAnalyser(sound, 32);


//animate and clock
const clock = new THREE.Clock();
function animate() {
    uniforms.u_frequency.value = analyser.getAverageFrequency();
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });



