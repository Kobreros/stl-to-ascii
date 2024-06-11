import * as THREE from "three";
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

let camera, controls, scene, renderer, effect;
let object;
const start = Date.now();

init();
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function init() {
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.x = 0;
  camera.position.y = -500;
  camera.position.z = 0;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0);

  const pointLight1 = new THREE.PointLight(0xffffff, 1, 0, 0);
  pointLight1.position.set(500, 500, 400);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 0, 0);
  pointLight2.position.set(-500, -500, -400);
  scene.add(pointLight2);

  // Load STL file
  const loader = new STLLoader();
  loader.load("./logo.stl", function (geometry) {
    // Center the geometry
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    center.negate();

    geometry.translate(center.x, center.y, center.z);

    const material = new THREE.MeshPhongMaterial({
      color: 0x7777ff,
      specular: 0x111111,
      shininess: 200,
    });
    object = new THREE.Mesh(geometry, material);
    object.rotation.set(0, 0, 0);

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);

  const effectSize = { amount: 0.205 };

  effect = new AsciiEffect(renderer, " .:-+*=%@#", {
    invert: true,
    resolution: effectSize.amount,
  });

  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = "black";
  effect.domElement.style.backgroundColor = "white";

  document.body.appendChild(effect.domElement);

  controls = new TrackballControls(camera, effect.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const timer = Date.now() - start;

  if (object) {
    object.rotation.z = timer * 0.0006; // Only rotate around the Z-axis
  }

  controls.update();

  effect.render(scene, camera);
}
