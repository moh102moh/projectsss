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
  mouseLight = new three__WEBPACK_IMPORTED_MODULE_3__.PointLight(0xffffff, 1.8, 150); // Color, Intensity, Distance
  mouseLight.visible = false; // Start with the light off
  scene.add(mouseLight);

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

  mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // Your existing camera drift and controls code
  camera.position.x += Math.abs(mouseX) <= windowHalfX / 2 ? (mouseX / 2 - camera.position.x) * 0.005 : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();

  // --- THIS IS THE NEW RAYCASTING LOGIC ---

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mousePos, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(Globe.children, true);

  if (intersects.length > 0) {
    // If the ray hits the globe, move the light to the intersection point
    mouseLight.position.copy(intersects[0].point);
    mouseLight.visible = true; // Turn the light on
  } else {
    // If the ray does not hit the globe, turn the light off
    mouseLight.visible = false;
  }

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
/******/ 		__webpack_require__.h = () => "f127f54fca9e12f6cc8f"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFjOUI7QUFDOEQ7QUFDekI7QUFDTDtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSzs7QUFFOUI7QUFDQSxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQiw0Q0FBUztBQUMzQixpQkFBaUIsMENBQU87QUFDeEIsbUJBQW1CLDZDQUFVLHFCQUFxQjtBQUNsRCw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsMERBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDBEQUFtQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVDQUF1QyxpREFBYztBQUNyRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWSx3Q0FBSyxlQUFlO0FBQ2xELHFCQUFxQjtBQUNyQixLQUFLO0FBQ0wsVUFBVSwyQ0FBUTtBQUNsQixjQUFjLG1EQUFnQjtBQUM5QjtBQUNBLEdBQUc7O0FBRUg7QUFDQSw2QkFBNkIsdUNBQUk7QUFDakMsUUFBUSxpREFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDOU9BLG9EIiwiZmlsZSI6Im1haW4uN2I5MDcxNDQ5YjJkNDA0NWNlZjcuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7XG4gICAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIFBvaW50TGlnaHQsXG4gIFNoYWRlck1hdGVyaWFsLFxuICBCYWNrU2lkZSxcbiAgTWVzaCxcbiAgU3BoZXJlR2VvbWV0cnksICAgIFxuICBBZGRpdGl2ZUJsZW5kaW5nLCAgXG4gIFJheWNhc3RlcixcbiAgVmVjdG9yMixcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCBNWUJSQU5DSEVTIGZyb20gXCIuL2ZpbGVzL0JSQU5DSEVTLmpzb25cIjtcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG52YXIgR2xvYmU7XG5cbnZhciByYXljYXN0ZXIsIG1vdXNlUG9zLCBtb3VzZUxpZ2h0O1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcbiAgLy8gSGVscGVyc1xuICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IEF4ZXNIZWxwZXIoODAwKTtcbiAgLy8gc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlcik7XG4gIC8vIHZhciBoZWxwZXJDYW1lcmEgPSBuZXcgQ2FtZXJhSGVscGVyKGRMaWdodC5zaGFkb3cuY2FtZXJhKTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSAzMDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgcmF5Y2FzdGVyID0gbmV3IFJheWNhc3RlcigpO1xuICBtb3VzZVBvcyA9IG5ldyBWZWN0b3IyKCk7XG4gIG1vdXNlTGlnaHQgPSBuZXcgUG9pbnRMaWdodCgweGZmZmZmZiwgMS44LCAxNTApOyAvLyBDb2xvciwgSW50ZW5zaXR5LCBEaXN0YW5jZVxuICBtb3VzZUxpZ2h0LnZpc2libGUgPSBmYWxzZTsgLy8gU3RhcnQgd2l0aCB0aGUgbGlnaHQgb2ZmXG4gIHNjZW5lLmFkZChtb3VzZUxpZ2h0KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cbi8vIFNFQ1RJT04gR2xvYmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLSBSRVBMQUNFIFlPVVIgT0xEIGluaXRHbG9iZSBGVU5DVElPTiBXSVRIIFRISVMgRU5USVJFIEJMT0NLIC0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIC8vIDEuIC0tLSBJbml0aWFsaXplIHRoZSBHbG9iZSAodW5jaGFuZ2VkKSAtLS1cbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNClcbiAgICAuc2hvd0F0bW9zcGhlcmUoZmFsc2UpIC8vIDwtLSBDb3JyZWN0bHkgdHVybmVkIG9mZlxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKCkgPT4gJyNlMGE4MGVmZicpO1xuXG4gIC8vIC0tLSBZb3VyIG9yaWdpbmFsIGxhYmVscyBhbmQgcG9pbnRzIGNvZGUgKHVuY2hhbmdlZCkgLS0tXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLmxhYmVsc0RhdGEoTVlCUkFOQ0hFUy5CUkFOQ0hFUylcbiAgICAgIC5sYWJlbENvbG9yKCgpID0+ICcjZmZmZmZmZmYnKVxuICAgICAgLmxhYmVsRG90T3JpZW50YXRpb24oKGUpID0+IChlLnRleHQgPT09ICdBTEEnID8gJ3RvcCcgOiAncmlnaHQnKSlcbiAgICAgIC5sYWJlbERvdFJhZGl1cygwLjYpXG4gICAgICAubGFiZWxTaXplKChlKSA9PiBlLnNpemUpXG4gICAgICAubGFiZWxUZXh0KCdjaXR5JylcbiAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAucG9pbnRzRGF0YShNWUJSQU5DSEVTLkJSQU5DSEVTKVxuICAgICAgLnBvaW50Q29sb3IoKCkgPT4gJyNmZmZmZmYnKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICAvLyAyLiAtLS0gQ3JlYXRlIHRoZSBjdXN0b20gcmVhbGlzdGljIGF0bW9zcGhlcmUgKENPUlJFQ1RFRCBDT0RFKSAtLS1cbiAgY29uc3QgdmVydGV4U2hhZGVyID0gYFxuICAgIHZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIHZOb3JtYWwgPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApO1xuICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApO1xuICAgIH1cbiAgYDtcbiAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBgXG4gICAgdW5pZm9ybSB2ZWMzIGdsb3dDb2xvcjtcbiAgICB1bmlmb3JtIGZsb2F0IGZhbGxvZmZQb3dlcjtcbiAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbDtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICBmbG9hdCBpbnRlbnNpdHkgPSBwb3coIDAuNyAtIGRvdCggdk5vcm1hbCwgdmVjMyggMC4wLCAwLjAsIDEuMCApICksIGZhbGxvZmZQb3dlciApO1xuICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggZ2xvd0NvbG9yLCAxLjAgKSAqIGludGVuc2l0eTtcbiAgICB9XG4gIGA7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzaGFkZXIgbWF0ZXJpYWxcbiAgY29uc3QgY3VzdG9tQXRtb3NwaGVyZU1hdGVyaWFsID0gbmV3IFNoYWRlck1hdGVyaWFsKHtcbiAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgZnJhZ21lbnRTaGFkZXIsXG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIGdsb3dDb2xvcjogeyB2YWx1ZTogbmV3IENvbG9yKCcjN2I4YjJmZmYnKSB9LFxuICAgICAgZmFsbG9mZlBvd2VyOiB7IHZhbHVlOiA3LjAgfVxuICAgIH0sXG4gICAgc2lkZTogQmFja1NpZGUsXG4gICAgYmxlbmRpbmc6IEFkZGl0aXZlQmxlbmRpbmcsIC8vIDwtLSBDb3JyZWN0ZWQ6IE5vIFwiVEhSRUUuXCJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBhdG1vc3BoZXJlIG1lc2hcbiAgY29uc3QgYXRtb3NwaGVyZU1lc2ggPSBuZXcgTWVzaChcbiAgICBuZXcgU3BoZXJlR2VvbWV0cnkoMTAwLCA1MCwgNTApLCAvLyA8LS0gQ29ycmVjdGVkOiBObyBcIlRIUkVFLlwiXG4gICAgY3VzdG9tQXRtb3NwaGVyZU1hdGVyaWFsXG4gICk7XG4gIGF0bW9zcGhlcmVNZXNoLnNjYWxlLnNldCgxLjE1LCAxLjE1LCAxLjE1KTtcbiAgR2xvYmUuYWRkKGF0bW9zcGhlcmVNZXNoKTtcblxuXG4gIC8vIDMuIC0tLSBZb3VyIEdsb2JlJ3MgQmFzZSBNYXRlcmlhbCAodW5jaGFuZ2VkKSAtLS1cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gIGdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuOTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDA7XG5cblxuICAvLyA0LiAtLS0gRmluYWwgR2xvYmUgb3JpZW50YXRpb24gKHVuY2hhbmdlZCkgLS0tXG4gIGNvbnN0IGxhdCA9IDI0O1xuICBjb25zdCBsbmcgPSA0NTtcbiAgY29uc3Qgcm90YXRpb25ZID0gLWxuZyAqIChNYXRoLlBJIC8gMTgwKTtcbiAgY29uc3Qgcm90YXRpb25aID0gbGF0ICogKE1hdGguUEkgLyAxODApO1xuICBHbG9iZS5yb3RhdGVZKHJvdGF0aW9uWSk7XG4gIEdsb2JlLnJvdGF0ZVoocm90YXRpb25aKTtcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcblxuICBtb3VzZVBvcy54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgbW91c2VQb3MueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIC8vIFlvdXIgZXhpc3RpbmcgY2FtZXJhIGRyaWZ0IGFuZCBjb250cm9scyBjb2RlXG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9IE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG5cbiAgLy8gLS0tIFRISVMgSVMgVEhFIE5FVyBSQVlDQVNUSU5HIExPR0lDIC0tLVxuXG4gIC8vIFVwZGF0ZSB0aGUgcGlja2luZyByYXkgd2l0aCB0aGUgY2FtZXJhIGFuZCBtb3VzZSBwb3NpdGlvblxuICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZVBvcywgY2FtZXJhKTtcblxuICAvLyBDYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gIGNvbnN0IGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyhHbG9iZS5jaGlsZHJlbiwgdHJ1ZSk7XG5cbiAgaWYgKGludGVyc2VjdHMubGVuZ3RoID4gMCkge1xuICAgIC8vIElmIHRoZSByYXkgaGl0cyB0aGUgZ2xvYmUsIG1vdmUgdGhlIGxpZ2h0IHRvIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnRcbiAgICBtb3VzZUxpZ2h0LnBvc2l0aW9uLmNvcHkoaW50ZXJzZWN0c1swXS5wb2ludCk7XG4gICAgbW91c2VMaWdodC52aXNpYmxlID0gdHJ1ZTsgLy8gVHVybiB0aGUgbGlnaHQgb25cbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB0aGUgcmF5IGRvZXMgbm90IGhpdCB0aGUgZ2xvYmUsIHR1cm4gdGhlIGxpZ2h0IG9mZlxuICAgIG1vdXNlTGlnaHQudmlzaWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImYxMjdmNTRmY2E5ZTEyZjZjYzhmXCIiXSwic291cmNlUm9vdCI6IiJ9