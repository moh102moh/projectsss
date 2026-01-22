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
  Globe.name = 'RAYCAST'; // Give the globe a name for raycasting

  // --- Hexagon and Atmosphere Setup ---
  Globe.hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(4)
    .hexPolygonMargin(.0)
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
/******/ 		__webpack_require__.h = () => "2eec98b269b5d1bc9e18"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFjOUI7QUFDOEQ7QUFDekI7QUFDTDs7QUFFL0M7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLDRDQUFTO0FBQzNCLGlCQUFpQiwwQ0FBTzs7QUFFeEI7QUFDQSxtQkFBbUIsNkNBQVUscUJBQXFCO0FBQ2xELDZCQUE2QjtBQUM3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gseUJBQXlCOztBQUV6QjtBQUNBLHdCQUF3QixnRUFBa0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwwREFBbUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMERBQW1CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVDQUF1QyxpREFBYztBQUNyRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWSx3Q0FBSyxlQUFlO0FBQ2xELHFCQUFxQixhQUFhO0FBQ2xDLEtBQUs7QUFDTCxVQUFVLDJDQUFRO0FBQ2xCLGNBQWMsbURBQWdCO0FBQzlCO0FBQ0EsR0FBRzs7QUFFSCw2QkFBNkIsdUNBQUk7QUFDakMsUUFBUSxpREFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQy9PQSxvRCIsImZpbGUiOiJtYWluLjM4ZjQxNzdkMjBjMjMwYzZkMzAxLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQge1xuICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBDb2xvcixcbiAgUG9pbnRMaWdodCxcbiAgU2hhZGVyTWF0ZXJpYWwsXG4gIEJhY2tTaWRlLFxuICBNZXNoLFxuICBTcGhlcmVHZW9tZXRyeSxcbiAgQWRkaXRpdmVCbGVuZGluZyxcbiAgUmF5Y2FzdGVyLCAvLyBBZGRlZCBmb3IgbW91c2UgbGlnaHRcbiAgVmVjdG9yMiwgICAvLyBBZGRlZCBmb3IgbW91c2UgbGlnaHRcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCBNWUJSQU5DSEVTIGZyb20gXCIuL2ZpbGVzL0JSQU5DSEVTLmpzb25cIjtcblxuLy8gR2xvYmFsIHZhcmlhYmxlc1xudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbnZhciBHbG9iZTtcbnZhciByYXljYXN0ZXIsIG1vdXNlUG9zLCBtb3VzZUxpZ2h0OyAvLyBBZGRlZCBmb3IgbW91c2UgbGlnaHRcblxubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gMzAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICAvLyAtLS0gTU9VU0UgTElHSFQgU0VUVVAgLS0tXG4gIC8vIDEuIEluaXRpYWxpemUgdGhlIFJheWNhc3RlciBhbmQgYSB2ZWN0b3IgZm9yIHRoZSBtb3VzZSBwb3NpdGlvblxuICByYXljYXN0ZXIgPSBuZXcgUmF5Y2FzdGVyKCk7XG4gIG1vdXNlUG9zID0gbmV3IFZlY3RvcjIoKTtcblxuICAvLyAyLiBDcmVhdGUgdGhlIG5ldyBsaWdodCB0aGF0IHdpbGwgZm9sbG93IHRoZSBtb3VzZVxuICBtb3VzZUxpZ2h0ID0gbmV3IFBvaW50TGlnaHQoMHhmZmZmZmYsIDEuOCwgMTUwKTsgLy8gKENvbG9yLCBJbnRlbnNpdHksIERpc3RhbmNlKVxuICBtb3VzZUxpZ2h0LnZpc2libGUgPSBmYWxzZTsgLy8gU3RhcnQgd2l0aCB0aGUgbGlnaHQgb2ZmXG4gIHNjZW5lLmFkZChtb3VzZUxpZ2h0KTtcbiAgLy8gLS0tIEVORCBPRiBNT1VTRSBMSUdIVCBTRVRVUCAtLS1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cblxuLy8gU0VDVElPTiBHbG9iZVxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAvLyAxLiAtLS0gSW5pdGlhbGl6ZSB0aGUgR2xvYmUgLS0tXG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSk7XG4gIEdsb2JlLm5hbWUgPSAnUkFZQ0FTVCc7IC8vIEdpdmUgdGhlIGdsb2JlIGEgbmFtZSBmb3IgcmF5Y2FzdGluZ1xuXG4gIC8vIC0tLSBIZXhhZ29uIGFuZCBBdG1vc3BoZXJlIFNldHVwIC0tLVxuICBHbG9iZS5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbig0KVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKC4wKVxuICAgIC5zaG93QXRtb3NwaGVyZShmYWxzZSkgLy8gVHVybiBvZmYgdGhlIG9sZCBhdG1vc3BoZXJlXG4gICAgLmhleFBvbHlnb25Db2xvcigoKSA9PiAnI2UwYTgwZWZmJyk7XG5cbiAgLy8gLS0tIExhYmVscyBhbmQgUG9pbnRzIC0tLVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5sYWJlbHNEYXRhKE1ZQlJBTkNIRVMuQlJBTkNIRVMpXG4gICAgICAubGFiZWxDb2xvcigoKSA9PiAnI2ZmZmZmZmZmJylcbiAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiAoZS50ZXh0ID09PSAnQUxBJyA/ICd0b3AnIDogJ3JpZ2h0JykpXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC42KVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dCgnY2l0eScpXG4gICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgLnBvaW50c0RhdGEoTVlCUkFOQ0hFUy5CUkFOQ0hFUylcbiAgICAgIC5wb2ludENvbG9yKCgpID0+ICcjZmZmZmZmJylcbiAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgIC5wb2ludFJhZGl1cygwLjA1KTtcbiAgfSwgMTAwMCk7XG5cbiAgLy8gMi4gLS0tIENyZWF0ZSB0aGUgY3VzdG9tIHJlYWxpc3RpYyBhdG1vc3BoZXJlIC0tLVxuICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBgXG4gICAgdmFyeWluZyB2ZWMzIHZOb3JtYWw7XG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgdk5vcm1hbCA9IG5vcm1hbGl6ZSggbm9ybWFsTWF0cml4ICogbm9ybWFsICk7XG4gICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7XG4gICAgfVxuICBgO1xuICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGBcbiAgICB1bmlmb3JtIHZlYzMgZ2xvd0NvbG9yO1xuICAgIHVuaWZvcm0gZmxvYXQgZmFsbG9mZlBvd2VyO1xuICAgIHZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIGZsb2F0IGludGVuc2l0eSA9IHBvdyggMC43IC0gZG90KCB2Tm9ybWFsLCB2ZWMzKCAwLjAsIDAuMCwgMS4wICkgKSwgZmFsbG9mZlBvd2VyICk7XG4gICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBnbG93Q29sb3IsIDEuMCApICogaW50ZW5zaXR5O1xuICAgIH1cbiAgYDtcblxuICBjb25zdCBjdXN0b21BdG1vc3BoZXJlTWF0ZXJpYWwgPSBuZXcgU2hhZGVyTWF0ZXJpYWwoe1xuICAgIHZlcnRleFNoYWRlcixcbiAgICBmcmFnbWVudFNoYWRlcixcbiAgICB1bmlmb3Jtczoge1xuICAgICAgZ2xvd0NvbG9yOiB7IHZhbHVlOiBuZXcgQ29sb3IoJyM3YjhiMmZmZicpIH0sXG4gICAgICBmYWxsb2ZmUG93ZXI6IHsgdmFsdWU6IDcuMCB9LFxuICAgIH0sXG4gICAgc2lkZTogQmFja1NpZGUsXG4gICAgYmxlbmRpbmc6IEFkZGl0aXZlQmxlbmRpbmcsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gIH0pO1xuXG4gIGNvbnN0IGF0bW9zcGhlcmVNZXNoID0gbmV3IE1lc2goXG4gICAgbmV3IFNwaGVyZUdlb21ldHJ5KDEwMCwgNTAsIDUwKSxcbiAgICBjdXN0b21BdG1vc3BoZXJlTWF0ZXJpYWxcbiAgKTtcbiAgYXRtb3NwaGVyZU1lc2guc2NhbGUuc2V0KDEuMTUsIDEuMTUsIDEuMTUpO1xuICBHbG9iZS5hZGQoYXRtb3NwaGVyZU1lc2gpO1xuXG4gIC8vIDMuIC0tLSBHbG9iZSdzIEJhc2UgTWF0ZXJpYWwgLS0tXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICBnbG9iZU1hdGVyaWFsLm9wYWNpdHkgPSAwLjk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwO1xuXG4gIC8vIDQuIC0tLSBGaW5hbCBHbG9iZSBvcmllbnRhdGlvbiAtLS1cbiAgY29uc3QgbGF0ID0gMjQ7XG4gIGNvbnN0IGxuZyA9IDQ1O1xuICBjb25zdCByb3RhdGlvblkgPSAtbG5nICogKE1hdGguUEkgLyAxODApO1xuICBjb25zdCByb3RhdGlvblogPSBsYXQgKiAoTWF0aC5QSSAvIDE4MCk7XG4gIEdsb2JlLnJvdGF0ZVkocm90YXRpb25ZKTtcbiAgR2xvYmUucm90YXRlWihyb3RhdGlvblopO1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbi8vIFVQREFURUQgZm9yIHRoZSBtb3VzZSBsaWdodFxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgLy8gRm9yIGNhbWVyYSBkcmlmdCBlZmZlY3RcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG5cbiAgLy8gRm9yIHRoZSBSYXljYXN0ZXJcbiAgbW91c2VQb3MueCA9IChldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDE7XG4gIG1vdXNlUG9zLnkgPSAtKGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDE7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBSRVBMQUNFRCB3aXRoIHRoZSBuZXcgbG9naWMgZm9yIHRoZSBtb3VzZSBsaWdodFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgLy8gQ2FtZXJhIGRyaWZ0IGFuZCBjb250cm9sc1xuICBjYW1lcmEucG9zaXRpb24ueCArPSBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMiA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDUgOiAwO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gIC8vIC0tLSBNT1VTRSBMSUdIVCBSQVlDQVNUSU5HIExPR0lDIC0tLVxuICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZVBvcywgY2FtZXJhKTtcbiAgY29uc3QgZ2xvYmVPYmplY3QgPSBzY2VuZS5nZXRPYmplY3RCeU5hbWUoJ3RoZUdsb2JlJyk7XG5cbiAgaWYgKGdsb2JlT2JqZWN0KSB7XG4gICAgY29uc3QgaW50ZXJzZWN0cyA9IHJheWNhc3Rlci5pbnRlcnNlY3RPYmplY3RzKGdsb2JlT2JqZWN0LmNoaWxkcmVuLCB0cnVlKTtcbiAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdEhpdCA9IGludGVyc2VjdHMuZmluZChoaXQgPT4gaGl0Lm9iamVjdC50eXBlPSAnTWVzaCcpO1xuICAgICAgaWYgKGZpcnN0SGl0KSB7XG4gICAgICAgIG1vdXNlTGlnaHQucG9zaXRpb24uY29weShmaXJzdEhpdC5wb2ludCk7XG4gICAgICAgIG1vdXNlTGlnaHQudmlzaWJsZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb3VzZUxpZ2h0LnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbW91c2VMaWdodC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1vdXNlTGlnaHQudmlzaWJsZSA9IGZhbHNlO1xuICB9XG4gIC8vIC0tLSBFTkQgT0YgTU9VU0UgTElHSFQgTE9HSUMgLS0tXG5cbiAgLy8gUmVuZGVyIHRoZSBzY2VuZVxuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiMmVlYzk4YjI2OWI1ZDFiYzllMThcIiJdLCJzb3VyY2VSb290IjoiIn0=