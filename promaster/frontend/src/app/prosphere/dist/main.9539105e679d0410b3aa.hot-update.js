self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_BRANCHES_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/BRANCHES.json */ "./src/files/BRANCHES.json");






var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
var renderer, camera, scene, controls;
var Globe;

var raycaster, mousePos, mouseLight;

init();
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  // Initialize renderer
  renderer = new three__WEBPACK_IMPORTED_MODULE_3__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new three__WEBPACK_IMPORTED_MODULE_3__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_3__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000);

  // Initialize camera, light
  camera = new three__WEBPACK_IMPORTED_MODULE_3__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_3__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  // Helpers
  // const axesHelper = new AxesHelper(800);
  // scene.add(axesHelper);
  // var helper = new DirectionalLightHelper(dLight);
  // scene.add(helper);
  // var helperCamera = new CameraHelper(dLight.shadow.camera);
  // scene.add(helperCamera);

  // Initialize controls
  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_4__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 300;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;
  controls.autoRotate = false;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

   raycaster = new three__WEBPACK_IMPORTED_MODULE_3__.Raycaster();
  mousePos = new three__WEBPACK_IMPORTED_MODULE_3__.Vector2();

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}
// SECTION Globe
// ----------------------------------------------------------------
// --- REPLACE YOUR OLD initGlobe FUNCTION WITH THIS ENTIRE BLOCK ---
// ----------------------------------------------------------------

function initGlobe() {
  // 1. --- Initialize the Globe (unchanged) ---
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.4)
    .showAtmosphere(false) // <-- Correctly turned off
    .hexPolygonColor(() => '#e0a80eff');

  // --- Your original labels and points code (unchanged) ---
  setTimeout(() => {
    Globe.labelsData(_files_BRANCHES_json__WEBPACK_IMPORTED_MODULE_2__.BRANCHES)
      .labelColor(() => '#ffffffff')
      .labelDotOrientation((e) => (e.text === 'ALA' ? 'top' : 'right'))
      .labelDotRadius(0.6)
      .labelSize((e) => e.size)
      .labelText('city')
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(_files_BRANCHES_json__WEBPACK_IMPORTED_MODULE_2__.BRANCHES)
      .pointColor(() => '#ffffff')
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);
  }, 1000);

  // 2. --- Create the custom realistic atmosphere (CORRECTED CODE) ---
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize( normalMatrix * normal );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;
  const fragmentShader = `
    uniform vec3 glowColor;
    uniform float falloffPower;
    varying vec3 vNormal;
    void main() {
      float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), falloffPower );
      gl_FragColor = vec4( glowColor, 1.0 ) * intensity;
    }
  `;

  // Create the shader material
  const customAtmosphereMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new three__WEBPACK_IMPORTED_MODULE_3__.Color('#7b8b2fff') },
      falloffPower: { value: 7.0 }
    },
    side: three__WEBPACK_IMPORTED_MODULE_3__.BackSide,
    blending: three__WEBPACK_IMPORTED_MODULE_3__.AdditiveBlending, // <-- Corrected: No "THREE."
    transparent: true,
  });

  // Create the atmosphere mesh
  const atmosphereMesh = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(
    new three__WEBPACK_IMPORTED_MODULE_3__.SphereGeometry(100, 50, 50), // <-- Corrected: No "THREE."
    customAtmosphereMaterial
  );
  atmosphereMesh.scale.set(1.15, 1.15, 1.15);
  Globe.add(atmosphereMesh);


  // 3. --- Your Globe's Base Material (unchanged) ---
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.transparent = true;
  globeMaterial.opacity = 0.9;
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000);
  globeMaterial.shininess = 0;


  // 4. --- Final Globe orientation (unchanged) ---
  const lat = 24;
  const lng = 45;
  const rotationY = -lng * (Math.PI / 180);
  const rotationZ = lat * (Math.PI / 180);
  Globe.rotateY(rotationY);
  Globe.rotateZ(rotationZ);

  scene.add(Globe);
}

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  // console.log("x: " + mouseX + " y: " + mouseY);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  camera.position.x +=
    Math.abs(mouseX) <= windowHalfX / 2
      ? (mouseX / 2 - camera.position.x) * 0.005
      : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "b9b222e9827e64c5da62"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFjOUI7QUFDOEQ7QUFDekI7QUFDTDtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSzs7QUFFOUI7QUFDQSxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQiw0Q0FBUztBQUM1QixpQkFBaUIsMENBQU87O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLDBEQUFtQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiwwREFBbUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1Q0FBdUMsaURBQWM7QUFDckQ7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVksd0NBQUssZUFBZTtBQUNsRCxxQkFBcUI7QUFDckIsS0FBSztBQUNMLFVBQVUsMkNBQVE7QUFDbEIsY0FBYyxtREFBZ0I7QUFDOUI7QUFDQSxHQUFHOztBQUVIO0FBQ0EsNkJBQTZCLHVDQUFJO0FBQ2pDLFFBQVEsaURBQWM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDek5BLG9EIiwiZmlsZSI6Im1haW4uOTUzOTEwNWU2NzlkMDQxMGIzYWEuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7XG4gICAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIFBvaW50TGlnaHQsXG4gIFNoYWRlck1hdGVyaWFsLFxuICBCYWNrU2lkZSxcbiAgTWVzaCxcbiAgU3BoZXJlR2VvbWV0cnksICAgIFxuICBBZGRpdGl2ZUJsZW5kaW5nLCAgXG4gIFJheWNhc3RlcixcbiAgVmVjdG9yMixcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCBNWUJSQU5DSEVTIGZyb20gXCIuL2ZpbGVzL0JSQU5DSEVTLmpzb25cIjtcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG52YXIgR2xvYmU7XG5cbnZhciByYXljYXN0ZXIsIG1vdXNlUG9zLCBtb3VzZUxpZ2h0O1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcbiAgLy8gSGVscGVyc1xuICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IEF4ZXNIZWxwZXIoODAwKTtcbiAgLy8gc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlcik7XG4gIC8vIHZhciBoZWxwZXJDYW1lcmEgPSBuZXcgQ2FtZXJhSGVscGVyKGRMaWdodC5zaGFkb3cuY2FtZXJhKTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSAzMDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgIHJheWNhc3RlciA9IG5ldyBSYXljYXN0ZXIoKTtcbiAgbW91c2VQb3MgPSBuZXcgVmVjdG9yMigpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuLy8gU0VDVElPTiBHbG9iZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tIFJFUExBQ0UgWU9VUiBPTEQgaW5pdEdsb2JlIEZVTkNUSU9OIFdJVEggVEhJUyBFTlRJUkUgQkxPQ0sgLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgLy8gMS4gLS0tIEluaXRpYWxpemUgdGhlIEdsb2JlICh1bmNoYW5nZWQpIC0tLVxuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC40KVxuICAgIC5zaG93QXRtb3NwaGVyZShmYWxzZSkgLy8gPC0tIENvcnJlY3RseSB0dXJuZWQgb2ZmXG4gICAgLmhleFBvbHlnb25Db2xvcigoKSA9PiAnI2UwYTgwZWZmJyk7XG5cbiAgLy8gLS0tIFlvdXIgb3JpZ2luYWwgbGFiZWxzIGFuZCBwb2ludHMgY29kZSAodW5jaGFuZ2VkKSAtLS1cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgR2xvYmUubGFiZWxzRGF0YShNWUJSQU5DSEVTLkJSQU5DSEVTKVxuICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gJyNmZmZmZmZmZicpXG4gICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4gKGUudGV4dCA9PT0gJ0FMQScgPyAndG9wJyA6ICdyaWdodCcpKVxuICAgICAgLmxhYmVsRG90UmFkaXVzKDAuNilcbiAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgIC5sYWJlbFRleHQoJ2NpdHknKVxuICAgICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgICAgLmxhYmVsQWx0aXR1ZGUoMC4wMSlcbiAgICAgIC5wb2ludHNEYXRhKE1ZQlJBTkNIRVMuQlJBTkNIRVMpXG4gICAgICAucG9pbnRDb2xvcigoKSA9PiAnI2ZmZmZmZicpXG4gICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgIC5wb2ludEFsdGl0dWRlKDAuMDcpXG4gICAgICAucG9pbnRSYWRpdXMoMC4wNSk7XG4gIH0sIDEwMDApO1xuXG4gIC8vIDIuIC0tLSBDcmVhdGUgdGhlIGN1c3RvbSByZWFsaXN0aWMgYXRtb3NwaGVyZSAoQ09SUkVDVEVEIENPREUpIC0tLVxuICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBgXG4gICAgdmFyeWluZyB2ZWMzIHZOb3JtYWw7XG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgdk5vcm1hbCA9IG5vcm1hbGl6ZSggbm9ybWFsTWF0cml4ICogbm9ybWFsICk7XG4gICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7XG4gICAgfVxuICBgO1xuICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGBcbiAgICB1bmlmb3JtIHZlYzMgZ2xvd0NvbG9yO1xuICAgIHVuaWZvcm0gZmxvYXQgZmFsbG9mZlBvd2VyO1xuICAgIHZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIGZsb2F0IGludGVuc2l0eSA9IHBvdyggMC43IC0gZG90KCB2Tm9ybWFsLCB2ZWMzKCAwLjAsIDAuMCwgMS4wICkgKSwgZmFsbG9mZlBvd2VyICk7XG4gICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBnbG93Q29sb3IsIDEuMCApICogaW50ZW5zaXR5O1xuICAgIH1cbiAgYDtcblxuICAvLyBDcmVhdGUgdGhlIHNoYWRlciBtYXRlcmlhbFxuICBjb25zdCBjdXN0b21BdG1vc3BoZXJlTWF0ZXJpYWwgPSBuZXcgU2hhZGVyTWF0ZXJpYWwoe1xuICAgIHZlcnRleFNoYWRlcixcbiAgICBmcmFnbWVudFNoYWRlcixcbiAgICB1bmlmb3Jtczoge1xuICAgICAgZ2xvd0NvbG9yOiB7IHZhbHVlOiBuZXcgQ29sb3IoJyM3YjhiMmZmZicpIH0sXG4gICAgICBmYWxsb2ZmUG93ZXI6IHsgdmFsdWU6IDcuMCB9XG4gICAgfSxcbiAgICBzaWRlOiBCYWNrU2lkZSxcbiAgICBibGVuZGluZzogQWRkaXRpdmVCbGVuZGluZywgLy8gPC0tIENvcnJlY3RlZDogTm8gXCJUSFJFRS5cIlxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICB9KTtcblxuICAvLyBDcmVhdGUgdGhlIGF0bW9zcGhlcmUgbWVzaFxuICBjb25zdCBhdG1vc3BoZXJlTWVzaCA9IG5ldyBNZXNoKFxuICAgIG5ldyBTcGhlcmVHZW9tZXRyeSgxMDAsIDUwLCA1MCksIC8vIDwtLSBDb3JyZWN0ZWQ6IE5vIFwiVEhSRUUuXCJcbiAgICBjdXN0b21BdG1vc3BoZXJlTWF0ZXJpYWxcbiAgKTtcbiAgYXRtb3NwaGVyZU1lc2guc2NhbGUuc2V0KDEuMTUsIDEuMTUsIDEuMTUpO1xuICBHbG9iZS5hZGQoYXRtb3NwaGVyZU1lc2gpO1xuXG5cbiAgLy8gMy4gLS0tIFlvdXIgR2xvYmUncyBCYXNlIE1hdGVyaWFsICh1bmNoYW5nZWQpIC0tLVxuICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICBnbG9iZU1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgZ2xvYmVNYXRlcmlhbC5vcGFjaXR5ID0gMC45O1xuICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMDtcblxuXG4gIC8vIDQuIC0tLSBGaW5hbCBHbG9iZSBvcmllbnRhdGlvbiAodW5jaGFuZ2VkKSAtLS1cbiAgY29uc3QgbGF0ID0gMjQ7XG4gIGNvbnN0IGxuZyA9IDQ1O1xuICBjb25zdCByb3RhdGlvblkgPSAtbG5nICogKE1hdGguUEkgLyAxODApO1xuICBjb25zdCByb3RhdGlvblogPSBsYXQgKiAoTWF0aC5QSSAvIDE4MCk7XG4gIEdsb2JlLnJvdGF0ZVkocm90YXRpb25ZKTtcbiAgR2xvYmUucm90YXRlWihyb3RhdGlvblopO1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJiOWIyMjJlOTgyN2U2NGM1ZGE2MlwiIl0sInNvdXJjZVJvb3QiOiIifQ==