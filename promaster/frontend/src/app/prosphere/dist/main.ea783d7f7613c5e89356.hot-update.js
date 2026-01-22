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
/******/ 		__webpack_require__.h = () => "6ec6d4d128bba2aedae1"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFjOUI7QUFDOEQ7QUFDekI7QUFDTDtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsMERBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDBEQUFtQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVDQUF1QyxpREFBYztBQUNyRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWSx3Q0FBSyxlQUFlO0FBQ2xELHFCQUFxQjtBQUNyQixLQUFLO0FBQ0wsVUFBVSwyQ0FBUTtBQUNsQixjQUFjLG1EQUFnQjtBQUM5QjtBQUNBLEdBQUc7O0FBRUg7QUFDQSw2QkFBNkIsdUNBQUk7QUFDakMsUUFBUSxpREFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NsTkEsb0QiLCJmaWxlIjoibWFpbi5lYTc4M2Q3Zjc2MTNjNWU4OTM1Ni5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBDb2xvcixcbiAgUG9pbnRMaWdodCxcbiAgU2hhZGVyTWF0ZXJpYWwsXG4gIEJhY2tTaWRlLFxuICBNZXNoLFxuICBTcGhlcmVHZW9tZXRyeSwgICAgXG4gIEFkZGl0aXZlQmxlbmRpbmcsICBcbiAgUmF5Y2FzdGVyLCBcbiAgXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgTVlCUkFOQ0hFUyBmcm9tIFwiLi9maWxlcy9CUkFOQ0hFUy5qc29uXCI7XG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICAvLyBIZWxwZXJzXG4gIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDMwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cbi8vIFNFQ1RJT04gR2xvYmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLSBSRVBMQUNFIFlPVVIgT0xEIGluaXRHbG9iZSBGVU5DVElPTiBXSVRIIFRISVMgRU5USVJFIEJMT0NLIC0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIC8vIDEuIC0tLSBJbml0aWFsaXplIHRoZSBHbG9iZSAodW5jaGFuZ2VkKSAtLS1cbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNClcbiAgICAuc2hvd0F0bW9zcGhlcmUoZmFsc2UpIC8vIDwtLSBDb3JyZWN0bHkgdHVybmVkIG9mZlxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKCkgPT4gJyNlMGE4MGVmZicpO1xuXG4gIC8vIC0tLSBZb3VyIG9yaWdpbmFsIGxhYmVscyBhbmQgcG9pbnRzIGNvZGUgKHVuY2hhbmdlZCkgLS0tXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLmxhYmVsc0RhdGEoTVlCUkFOQ0hFUy5CUkFOQ0hFUylcbiAgICAgIC5sYWJlbENvbG9yKCgpID0+ICcjZmZmZmZmZmYnKVxuICAgICAgLmxhYmVsRG90T3JpZW50YXRpb24oKGUpID0+IChlLnRleHQgPT09ICdBTEEnID8gJ3RvcCcgOiAncmlnaHQnKSlcbiAgICAgIC5sYWJlbERvdFJhZGl1cygwLjYpXG4gICAgICAubGFiZWxTaXplKChlKSA9PiBlLnNpemUpXG4gICAgICAubGFiZWxUZXh0KCdjaXR5JylcbiAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAucG9pbnRzRGF0YShNWUJSQU5DSEVTLkJSQU5DSEVTKVxuICAgICAgLnBvaW50Q29sb3IoKCkgPT4gJyNmZmZmZmYnKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICAvLyAyLiAtLS0gQ3JlYXRlIHRoZSBjdXN0b20gcmVhbGlzdGljIGF0bW9zcGhlcmUgKENPUlJFQ1RFRCBDT0RFKSAtLS1cbiAgY29uc3QgdmVydGV4U2hhZGVyID0gYFxuICAgIHZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIHZOb3JtYWwgPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApO1xuICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApO1xuICAgIH1cbiAgYDtcbiAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBgXG4gICAgdW5pZm9ybSB2ZWMzIGdsb3dDb2xvcjtcbiAgICB1bmlmb3JtIGZsb2F0IGZhbGxvZmZQb3dlcjtcbiAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbDtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICBmbG9hdCBpbnRlbnNpdHkgPSBwb3coIDAuNyAtIGRvdCggdk5vcm1hbCwgdmVjMyggMC4wLCAwLjAsIDEuMCApICksIGZhbGxvZmZQb3dlciApO1xuICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggZ2xvd0NvbG9yLCAxLjAgKSAqIGludGVuc2l0eTtcbiAgICB9XG4gIGA7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzaGFkZXIgbWF0ZXJpYWxcbiAgY29uc3QgY3VzdG9tQXRtb3NwaGVyZU1hdGVyaWFsID0gbmV3IFNoYWRlck1hdGVyaWFsKHtcbiAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgZnJhZ21lbnRTaGFkZXIsXG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIGdsb3dDb2xvcjogeyB2YWx1ZTogbmV3IENvbG9yKCcjN2I4YjJmZmYnKSB9LFxuICAgICAgZmFsbG9mZlBvd2VyOiB7IHZhbHVlOiA3LjAgfVxuICAgIH0sXG4gICAgc2lkZTogQmFja1NpZGUsXG4gICAgYmxlbmRpbmc6IEFkZGl0aXZlQmxlbmRpbmcsIC8vIDwtLSBDb3JyZWN0ZWQ6IE5vIFwiVEhSRUUuXCJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBhdG1vc3BoZXJlIG1lc2hcbiAgY29uc3QgYXRtb3NwaGVyZU1lc2ggPSBuZXcgTWVzaChcbiAgICBuZXcgU3BoZXJlR2VvbWV0cnkoMTAwLCA1MCwgNTApLCAvLyA8LS0gQ29ycmVjdGVkOiBObyBcIlRIUkVFLlwiXG4gICAgY3VzdG9tQXRtb3NwaGVyZU1hdGVyaWFsXG4gICk7XG4gIGF0bW9zcGhlcmVNZXNoLnNjYWxlLnNldCgxLjE1LCAxLjE1LCAxLjE1KTtcbiAgR2xvYmUuYWRkKGF0bW9zcGhlcmVNZXNoKTtcblxuXG4gIC8vIDMuIC0tLSBZb3VyIEdsb2JlJ3MgQmFzZSBNYXRlcmlhbCAodW5jaGFuZ2VkKSAtLS1cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gIGdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuOTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDA7XG5cblxuICAvLyA0LiAtLS0gRmluYWwgR2xvYmUgb3JpZW50YXRpb24gKHVuY2hhbmdlZCkgLS0tXG4gIGNvbnN0IGxhdCA9IDI0O1xuICBjb25zdCBsbmcgPSA0NTtcbiAgY29uc3Qgcm90YXRpb25ZID0gLWxuZyAqIChNYXRoLlBJIC8gMTgwKTtcbiAgY29uc3Qgcm90YXRpb25aID0gbGF0ICogKE1hdGguUEkgLyAxODApO1xuICBHbG9iZS5yb3RhdGVZKHJvdGF0aW9uWSk7XG4gIEdsb2JlLnJvdGF0ZVoocm90YXRpb25aKTtcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbiAgLy8gY29uc29sZS5sb2coXCJ4OiBcIiArIG1vdXNlWCArIFwiIHk6IFwiICsgbW91c2VZKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDJcbiAgICAgID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNVxuICAgICAgOiAwO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiNmVjNmQ0ZDEyOGJiYTJhZWRhZTFcIiJdLCJzb3VyY2VSb290IjoiIn0=