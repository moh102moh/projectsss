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







// Global variables
var renderer, camera, scene, controls;
var Globe;
var raycaster, mousePos, mouseLight; // Added for mouse light

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

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

  // --- MOUSE LIGHT SETUP ---
  // 1. Initialize the Raycaster and a vector for the mouse position
  raycaster = new three__WEBPACK_IMPORTED_MODULE_3__.Raycaster();
  mousePos = new three__WEBPACK_IMPORTED_MODULE_3__.Vector2();

  // 2. Create the new light that will follow the mouse
  mouseLight = new three__WEBPACK_IMPORTED_MODULE_3__.PointLight(0xffffff, 1.8, 150); // (Color, Intensity, Distance)
  mouseLight.visible = false; // Start with the light off
  scene.add(mouseLight);
  // --- END OF MOUSE LIGHT SETUP ---

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}

// SECTION Globe
function initGlobe() {
  // 1. --- Initialize the Globe ---
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  });
  Globe.name = 'RAYCA'; // Give the globe a name for raycasting

  // --- Hexagon and Atmosphere Setup ---
  Globe.hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.4)
    .showAtmosphere(false) // Turn off the old atmosphere
    .hexPolygonColor(() => '#e0a80eff');

  // --- Labels and Points ---
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

  // 2. --- Create the custom realistic atmosphere ---
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

  const customAtmosphereMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new three__WEBPACK_IMPORTED_MODULE_3__.Color('#7b8b2fff') },
      falloffPower: { value: 7.0 },
    },
    side: three__WEBPACK_IMPORTED_MODULE_3__.BackSide,
    blending: three__WEBPACK_IMPORTED_MODULE_3__.AdditiveBlending,
    transparent: true,
  });

  const atmosphereMesh = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(
    new three__WEBPACK_IMPORTED_MODULE_3__.SphereGeometry(100, 50, 50),
    customAtmosphereMaterial
  );
  atmosphereMesh.scale.set(1.15, 1.15, 1.15);
  Globe.add(atmosphereMesh);

  // 3. --- Globe's Base Material ---
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.transparent = true;
  globeMaterial.opacity = 0.9;
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000);
  globeMaterial.shininess = 0;

  // 4. --- Final Globe orientation ---
  const lat = 24;
  const lng = 45;
  const rotationY = -lng * (Math.PI / 180);
  const rotationZ = lat * (Math.PI / 180);
  Globe.rotateY(rotationY);
  Globe.rotateZ(rotationZ);

  scene.add(Globe);
}

// UPDATED for the mouse light
function onMouseMove(event) {
  // For camera drift effect
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  // For the Raycaster
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

// REPLACED with the new logic for the mouse light
function animate() {
  // Camera drift and controls
  camera.position.x += Math.abs(mouseX) <= windowHalfX / 2 ? (mouseX / 2 - camera.position.x) * 0.005 : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();

  // --- MOUSE LIGHT RAYCASTING LOGIC ---
  raycaster.setFromCamera(mousePos, camera);
  const globeObject = scene.getObjectByName('theGlobe');

  if (globeObject) {
    const intersects = raycaster.intersectObjects(globeObject.children, true);
    if (intersects.length > 0) {
      const firstHit = intersects.find(hit => hit.object.type= 'Mesh');
      if (firstHit) {
        mouseLight.position.copy(firstHit.point);
        mouseLight.visible = true;
      } else {
        mouseLight.visible = false;
      }
    } else {
      mouseLight.visible = false;
    }
  } else {
    mouseLight.visible = false;
  }
  // --- END OF MOUSE LIGHT LOGIC ---

  // Render the scene
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
/******/ 		__webpack_require__.h = () => "79bbf129f294697ff4ba"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFjOUI7QUFDOEQ7QUFDekI7QUFDTDs7QUFFL0M7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLDRDQUFTO0FBQzNCLGlCQUFpQiwwQ0FBTzs7QUFFeEI7QUFDQSxtQkFBbUIsNkNBQVUscUJBQXFCO0FBQ2xELDZCQUE2QjtBQUM3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsdUJBQXVCOztBQUV2QjtBQUNBLHdCQUF3QixnRUFBa0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwwREFBbUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMERBQW1CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVDQUF1QyxpREFBYztBQUNyRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWSx3Q0FBSyxlQUFlO0FBQ2xELHFCQUFxQixhQUFhO0FBQ2xDLEtBQUs7QUFDTCxVQUFVLDJDQUFRO0FBQ2xCLGNBQWMsbURBQWdCO0FBQzlCO0FBQ0EsR0FBRzs7QUFFSCw2QkFBNkIsdUNBQUk7QUFDakMsUUFBUSxpREFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQy9PQSxvRCIsImZpbGUiOiJtYWluLmI2MTA2OGE1YmJhMWIxZGY5ZjczLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQge1xuICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBDb2xvcixcbiAgUG9pbnRMaWdodCxcbiAgU2hhZGVyTWF0ZXJpYWwsXG4gIEJhY2tTaWRlLFxuICBNZXNoLFxuICBTcGhlcmVHZW9tZXRyeSxcbiAgQWRkaXRpdmVCbGVuZGluZyxcbiAgUmF5Y2FzdGVyLCAvLyBBZGRlZCBmb3IgbW91c2UgbGlnaHRcbiAgVmVjdG9yMiwgICAvLyBBZGRlZCBmb3IgbW91c2UgbGlnaHRcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCBNWUJSQU5DSEVTIGZyb20gXCIuL2ZpbGVzL0JSQU5DSEVTLmpzb25cIjtcblxuLy8gR2xvYmFsIHZhcmlhYmxlc1xudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbnZhciBHbG9iZTtcbnZhciByYXljYXN0ZXIsIG1vdXNlUG9zLCBtb3VzZUxpZ2h0OyAvLyBBZGRlZCBmb3IgbW91c2UgbGlnaHRcblxubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gMzAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICAvLyAtLS0gTU9VU0UgTElHSFQgU0VUVVAgLS0tXG4gIC8vIDEuIEluaXRpYWxpemUgdGhlIFJheWNhc3RlciBhbmQgYSB2ZWN0b3IgZm9yIHRoZSBtb3VzZSBwb3NpdGlvblxuICByYXljYXN0ZXIgPSBuZXcgUmF5Y2FzdGVyKCk7XG4gIG1vdXNlUG9zID0gbmV3IFZlY3RvcjIoKTtcblxuICAvLyAyLiBDcmVhdGUgdGhlIG5ldyBsaWdodCB0aGF0IHdpbGwgZm9sbG93IHRoZSBtb3VzZVxuICBtb3VzZUxpZ2h0ID0gbmV3IFBvaW50TGlnaHQoMHhmZmZmZmYsIDEuOCwgMTUwKTsgLy8gKENvbG9yLCBJbnRlbnNpdHksIERpc3RhbmNlKVxuICBtb3VzZUxpZ2h0LnZpc2libGUgPSBmYWxzZTsgLy8gU3RhcnQgd2l0aCB0aGUgbGlnaHQgb2ZmXG4gIHNjZW5lLmFkZChtb3VzZUxpZ2h0KTtcbiAgLy8gLS0tIEVORCBPRiBNT1VTRSBMSUdIVCBTRVRVUCAtLS1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cblxuLy8gU0VDVElPTiBHbG9iZVxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAvLyAxLiAtLS0gSW5pdGlhbGl6ZSB0aGUgR2xvYmUgLS0tXG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSk7XG4gIEdsb2JlLm5hbWUgPSAnUkFZQ0EnOyAvLyBHaXZlIHRoZSBnbG9iZSBhIG5hbWUgZm9yIHJheWNhc3RpbmdcblxuICAvLyAtLS0gSGV4YWdvbiBhbmQgQXRtb3NwaGVyZSBTZXR1cCAtLS1cbiAgR2xvYmUuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjQpXG4gICAgLnNob3dBdG1vc3BoZXJlKGZhbHNlKSAvLyBUdXJuIG9mZiB0aGUgb2xkIGF0bW9zcGhlcmVcbiAgICAuaGV4UG9seWdvbkNvbG9yKCgpID0+ICcjZTBhODBlZmYnKTtcblxuICAvLyAtLS0gTGFiZWxzIGFuZCBQb2ludHMgLS0tXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLmxhYmVsc0RhdGEoTVlCUkFOQ0hFUy5CUkFOQ0hFUylcbiAgICAgIC5sYWJlbENvbG9yKCgpID0+ICcjZmZmZmZmZmYnKVxuICAgICAgLmxhYmVsRG90T3JpZW50YXRpb24oKGUpID0+IChlLnRleHQgPT09ICdBTEEnID8gJ3RvcCcgOiAncmlnaHQnKSlcbiAgICAgIC5sYWJlbERvdFJhZGl1cygwLjYpXG4gICAgICAubGFiZWxTaXplKChlKSA9PiBlLnNpemUpXG4gICAgICAubGFiZWxUZXh0KCdjaXR5JylcbiAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAucG9pbnRzRGF0YShNWUJSQU5DSEVTLkJSQU5DSEVTKVxuICAgICAgLnBvaW50Q29sb3IoKCkgPT4gJyNmZmZmZmYnKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICAvLyAyLiAtLS0gQ3JlYXRlIHRoZSBjdXN0b20gcmVhbGlzdGljIGF0bW9zcGhlcmUgLS0tXG4gIGNvbnN0IHZlcnRleFNoYWRlciA9IGBcbiAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbDtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICB2Tm9ybWFsID0gbm9ybWFsaXplKCBub3JtYWxNYXRyaXggKiBub3JtYWwgKTtcbiAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTtcbiAgICB9XG4gIGA7XG4gIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gYFxuICAgIHVuaWZvcm0gdmVjMyBnbG93Q29sb3I7XG4gICAgdW5pZm9ybSBmbG9hdCBmYWxsb2ZmUG93ZXI7XG4gICAgdmFyeWluZyB2ZWMzIHZOb3JtYWw7XG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgZmxvYXQgaW50ZW5zaXR5ID0gcG93KCAwLjcgLSBkb3QoIHZOb3JtYWwsIHZlYzMoIDAuMCwgMC4wLCAxLjAgKSApLCBmYWxsb2ZmUG93ZXIgKTtcbiAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoIGdsb3dDb2xvciwgMS4wICkgKiBpbnRlbnNpdHk7XG4gICAgfVxuICBgO1xuXG4gIGNvbnN0IGN1c3RvbUF0bW9zcGhlcmVNYXRlcmlhbCA9IG5ldyBTaGFkZXJNYXRlcmlhbCh7XG4gICAgdmVydGV4U2hhZGVyLFxuICAgIGZyYWdtZW50U2hhZGVyLFxuICAgIHVuaWZvcm1zOiB7XG4gICAgICBnbG93Q29sb3I6IHsgdmFsdWU6IG5ldyBDb2xvcignIzdiOGIyZmZmJykgfSxcbiAgICAgIGZhbGxvZmZQb3dlcjogeyB2YWx1ZTogNy4wIH0sXG4gICAgfSxcbiAgICBzaWRlOiBCYWNrU2lkZSxcbiAgICBibGVuZGluZzogQWRkaXRpdmVCbGVuZGluZyxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3QgYXRtb3NwaGVyZU1lc2ggPSBuZXcgTWVzaChcbiAgICBuZXcgU3BoZXJlR2VvbWV0cnkoMTAwLCA1MCwgNTApLFxuICAgIGN1c3RvbUF0bW9zcGhlcmVNYXRlcmlhbFxuICApO1xuICBhdG1vc3BoZXJlTWVzaC5zY2FsZS5zZXQoMS4xNSwgMS4xNSwgMS4xNSk7XG4gIEdsb2JlLmFkZChhdG1vc3BoZXJlTWVzaCk7XG5cbiAgLy8gMy4gLS0tIEdsb2JlJ3MgQmFzZSBNYXRlcmlhbCAtLS1cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gIGdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuOTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDA7XG5cbiAgLy8gNC4gLS0tIEZpbmFsIEdsb2JlIG9yaWVudGF0aW9uIC0tLVxuICBjb25zdCBsYXQgPSAyNDtcbiAgY29uc3QgbG5nID0gNDU7XG4gIGNvbnN0IHJvdGF0aW9uWSA9IC1sbmcgKiAoTWF0aC5QSSAvIDE4MCk7XG4gIGNvbnN0IHJvdGF0aW9uWiA9IGxhdCAqIChNYXRoLlBJIC8gMTgwKTtcbiAgR2xvYmUucm90YXRlWShyb3RhdGlvblkpO1xuICBHbG9iZS5yb3RhdGVaKHJvdGF0aW9uWik7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gVVBEQVRFRCBmb3IgdGhlIG1vdXNlIGxpZ2h0XG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAvLyBGb3IgY2FtZXJhIGRyaWZ0IGVmZmVjdFxuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcblxuICAvLyBGb3IgdGhlIFJheWNhc3RlclxuICBtb3VzZVBvcy54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgbW91c2VQb3MueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbi8vIFJFUExBQ0VEIHdpdGggdGhlIG5ldyBsb2dpYyBmb3IgdGhlIG1vdXNlIGxpZ2h0XG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAvLyBDYW1lcmEgZHJpZnQgYW5kIGNvbnRyb2xzXG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9IE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG5cbiAgLy8gLS0tIE1PVVNFIExJR0hUIFJBWUNBU1RJTkcgTE9HSUMgLS0tXG4gIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKG1vdXNlUG9zLCBjYW1lcmEpO1xuICBjb25zdCBnbG9iZU9iamVjdCA9IHNjZW5lLmdldE9iamVjdEJ5TmFtZSgndGhlR2xvYmUnKTtcblxuICBpZiAoZ2xvYmVPYmplY3QpIHtcbiAgICBjb25zdCBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMoZ2xvYmVPYmplY3QuY2hpbGRyZW4sIHRydWUpO1xuICAgIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gaW50ZXJzZWN0cy5maW5kKGhpdCA9PiBoaXQub2JqZWN0LnR5cGU9ICdNZXNoJyk7XG4gICAgICBpZiAoZmlyc3RIaXQpIHtcbiAgICAgICAgbW91c2VMaWdodC5wb3NpdGlvbi5jb3B5KGZpcnN0SGl0LnBvaW50KTtcbiAgICAgICAgbW91c2VMaWdodC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdXNlTGlnaHQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtb3VzZUxpZ2h0LnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbW91c2VMaWdodC52aXNpYmxlID0gZmFsc2U7XG4gIH1cbiAgLy8gLS0tIEVORCBPRiBNT1VTRSBMSUdIVCBMT0dJQyAtLS1cblxuICAvLyBSZW5kZXIgdGhlIHNjZW5lXG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI3OWJiZjEyOWYyOTQ2OTdmZjRiYVwiIl0sInNvdXJjZVJvb3QiOiIifQ==