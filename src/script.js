// import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import html2canvas from "html2canvas";

//LightMode
let lightMode = true;

//Create a clock for rotation
const clock = new THREE.Clock();

// Set rotate boolean variable
let rotateModel = true;

//Ugh, don't ask about this stuff
var userUploaded = false;
let controls;

// Creates empty mesh container
const myMesh = new THREE.Mesh();

// Scene
const scene = new THREE.Scene();
scene.background = null;
scene.background = new THREE.Color(0, 0, 0);

//Lights
const pointLight1 = new THREE.PointLight(0xffffff, 1.6, 0, 0);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 0, 0);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

// Parameters
const stlLoader = new STLLoader();

//Material
const material = new THREE.MeshStandardMaterial();
material.flatShading = true;
material.side = THREE.DoubleSide;

// Select the .hero__anim element
const heroAnimElement = document.querySelector(".hero__anim");

// Sizes
const sizes = {
  width: heroAnimElement.clientWidth,
  height: heroAnimElement.clientHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  2000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });

let effect;

let characters = " .:-+*=%@#";
const effectSize = { amount: 0.205 };
let backgroundColor = "white";
let ASCIIColor = "black";

function createEffect() {
  effect = new AsciiEffect(renderer, characters, {
    invert: true,
    resolution: effectSize.amount,
  });
  effect.setSize(sizes.width, sizes.height);
  effect.domElement.style.color = ASCIIColor;
  effect.domElement.style.backgroundColor = "transparent";
  // effect.domElement.style.backgroundColor = backgroundColor;
}

createEffect();

// Append the effect element to the .hero__anim element
heroAnimElement.appendChild(effect.domElement);

const stlLink = "https://ton-ventures.pages.dev/logo.stl";
stlLoader.load(stlLink, function (geometry) {
  myMesh.material = material;
  myMesh.geometry = geometry;

  var tempGeometry = new THREE.Mesh(geometry, material);
  myMesh.position.copy = tempGeometry.position;

  geometry.computeVertexNormals();
  myMesh.geometry.center();

  myMesh.rotation.x = (-90 * Math.PI) / 180;

  myMesh.geometry.computeBoundingBox();
  var bbox = myMesh.geometry.boundingBox;

  myMesh.position.y = (bbox.max.z - bbox.min.z) / 100;

  camera.position.x = bbox.max.x * 2;
  camera.position.y = bbox.max.y;
  camera.position.z = bbox.max.z * 3;

  scene.add(myMesh);

  controls = new OrbitControls(camera, effect.domElement);
  controls.enabled = false;

  function tick() {
    if (rotateModel == true) {
      const elapsedTime = clock.getElapsedTime();
      myMesh.rotation.z = elapsedTime / 3;
      render();
      window.requestAnimationFrame(tick);
    } else {
      render();
      window.requestAnimationFrame(tick);
    }
  }

  function render() {
    effect.render(scene, camera);
  }

  tick();
});

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  // Update sizes
  sizes.width = heroAnimElement.clientWidth;
  sizes.height = heroAnimElement.clientHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer and effect size
  renderer.setSize(sizes.width, sizes.height);
  effect.setSize(sizes.width, sizes.height);
}
