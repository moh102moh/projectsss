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
  // 1. --- Initialize the Globe ---
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    // --- Use your hexagon settings, but DISABLE the old atmosphere ---
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.4)
    .showAtmosphere(false) // <-- CRITICAL: Turn off the old built-in glow
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

  // 2. --- Create the custom realistic atmosphere ---
  
  // Define the shader code for the gradient glow
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
      falloffPower: { value: 4.0 } // Adjust this for softness/sharpness
    },
    side: three__WEBPACK_IMPORTED_MODULE_3__.BackSide,
    blending: THREE.AdditiveBlending, // This blending mode makes the glow look bright
    transparent: true,
  });

  // Create the atmosphere mesh and add it directly to the Globe object
  const atmosphereMesh = new Mesh(
    new THREE.SphereGeometry(100, 50, 50), // 100 is the Globe's default radius
    customAtmosphereMaterial
  );
  atmosphereMesh.scale.set(1.15, 1.15, 1.15); // Make it slightly larger than the globe
  Globe.add(atmosphereMesh);


  // 3. --- Your Globe's Base Material (unchanged) ---
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.transparent = true;
  globeMaterial.opacity = 0.5;
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
/******/ 		__webpack_require__.h = () => "009a1078a8e3d5ca8d07"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFZOUI7QUFDOEQ7QUFDekI7QUFDTDtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHFCQUFxQixnRUFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwwREFBbUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMERBQW1CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUNBQXVDLGlEQUFjO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZLHdDQUFLLGVBQWU7QUFDbEQscUJBQXFCLGFBQWE7QUFDbEMsS0FBSztBQUNMLFVBQVUsMkNBQVE7QUFDbEI7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3Qzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NuTkEsb0QiLCJmaWxlIjoibWFpbi5kMzAwZDVmMjFlOGNlM2Y5MDU3Ni5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIC8vIEF4ZXNIZWxwZXIsXG4gIC8vIERpcmVjdGlvbmFsTGlnaHRIZWxwZXIsXG4gIC8vIENhbWVyYUhlbHBlcixcbiAgUG9pbnRMaWdodCxcbiAgU2hhZGVyTWF0ZXJpYWwsXG4gIEJhY2tTaWRlLCAgXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgTVlCUkFOQ0hFUyBmcm9tIFwiLi9maWxlcy9CUkFOQ0hFUy5qc29uXCI7XG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICAvLyBIZWxwZXJzXG4gIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDMwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cbi8vIFNFQ1RJT04gR2xvYmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLSBSRVBMQUNFIFlPVVIgT0xEIGluaXRHbG9iZSBGVU5DVElPTiBXSVRIIFRISVMgRU5USVJFIEJMT0NLIC0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIC8vIDEuIC0tLSBJbml0aWFsaXplIHRoZSBHbG9iZSAtLS1cbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC8vIC0tLSBVc2UgeW91ciBoZXhhZ29uIHNldHRpbmdzLCBidXQgRElTQUJMRSB0aGUgb2xkIGF0bW9zcGhlcmUgLS0tXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC40KVxuICAgIC5zaG93QXRtb3NwaGVyZShmYWxzZSkgLy8gPC0tIENSSVRJQ0FMOiBUdXJuIG9mZiB0aGUgb2xkIGJ1aWx0LWluIGdsb3dcbiAgICAuaGV4UG9seWdvbkNvbG9yKCgpID0+ICcjZTBhODBlZmYnKTtcblxuICAvLyAtLS0gWW91ciBvcmlnaW5hbCBsYWJlbHMgYW5kIHBvaW50cyBjb2RlICh1bmNoYW5nZWQpIC0tLVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5sYWJlbHNEYXRhKE1ZQlJBTkNIRVMuQlJBTkNIRVMpXG4gICAgICAubGFiZWxDb2xvcigoKSA9PiAnI2ZmZmZmZmZmJylcbiAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiAoZS50ZXh0ID09PSAnQUxBJyA/ICd0b3AnIDogJ3JpZ2h0JykpXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC42KVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dCgnY2l0eScpXG4gICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgLnBvaW50c0RhdGEoTVlCUkFOQ0hFUy5CUkFOQ0hFUylcbiAgICAgIC5wb2ludENvbG9yKCgpID0+ICcjZmZmZmZmJylcbiAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgIC5wb2ludFJhZGl1cygwLjA1KTtcbiAgfSwgMTAwMCk7XG5cbiAgLy8gMi4gLS0tIENyZWF0ZSB0aGUgY3VzdG9tIHJlYWxpc3RpYyBhdG1vc3BoZXJlIC0tLVxuICBcbiAgLy8gRGVmaW5lIHRoZSBzaGFkZXIgY29kZSBmb3IgdGhlIGdyYWRpZW50IGdsb3dcbiAgY29uc3QgdmVydGV4U2hhZGVyID0gYFxuICAgIHZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIHZOb3JtYWwgPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApO1xuICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApO1xuICAgIH1cbiAgYDtcbiAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBgXG4gICAgdW5pZm9ybSB2ZWMzIGdsb3dDb2xvcjtcbiAgICB1bmlmb3JtIGZsb2F0IGZhbGxvZmZQb3dlcjtcbiAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbDtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICBmbG9hdCBpbnRlbnNpdHkgPSBwb3coIDAuNyAtIGRvdCggdk5vcm1hbCwgdmVjMyggMC4wLCAwLjAsIDEuMCApICksIGZhbGxvZmZQb3dlciApO1xuICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggZ2xvd0NvbG9yLCAxLjAgKSAqIGludGVuc2l0eTtcbiAgICB9XG4gIGA7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzaGFkZXIgbWF0ZXJpYWxcbiAgY29uc3QgY3VzdG9tQXRtb3NwaGVyZU1hdGVyaWFsID0gbmV3IFNoYWRlck1hdGVyaWFsKHtcbiAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgZnJhZ21lbnRTaGFkZXIsXG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIGdsb3dDb2xvcjogeyB2YWx1ZTogbmV3IENvbG9yKCcjN2I4YjJmZmYnKSB9LFxuICAgICAgZmFsbG9mZlBvd2VyOiB7IHZhbHVlOiA0LjAgfSAvLyBBZGp1c3QgdGhpcyBmb3Igc29mdG5lc3Mvc2hhcnBuZXNzXG4gICAgfSxcbiAgICBzaWRlOiBCYWNrU2lkZSxcbiAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZywgLy8gVGhpcyBibGVuZGluZyBtb2RlIG1ha2VzIHRoZSBnbG93IGxvb2sgYnJpZ2h0XG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gIH0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgYXRtb3NwaGVyZSBtZXNoIGFuZCBhZGQgaXQgZGlyZWN0bHkgdG8gdGhlIEdsb2JlIG9iamVjdFxuICBjb25zdCBhdG1vc3BoZXJlTWVzaCA9IG5ldyBNZXNoKFxuICAgIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMDAsIDUwLCA1MCksIC8vIDEwMCBpcyB0aGUgR2xvYmUncyBkZWZhdWx0IHJhZGl1c1xuICAgIGN1c3RvbUF0bW9zcGhlcmVNYXRlcmlhbFxuICApO1xuICBhdG1vc3BoZXJlTWVzaC5zY2FsZS5zZXQoMS4xNSwgMS4xNSwgMS4xNSk7IC8vIE1ha2UgaXQgc2xpZ2h0bHkgbGFyZ2VyIHRoYW4gdGhlIGdsb2JlXG4gIEdsb2JlLmFkZChhdG1vc3BoZXJlTWVzaCk7XG5cblxuICAvLyAzLiAtLS0gWW91ciBHbG9iZSdzIEJhc2UgTWF0ZXJpYWwgKHVuY2hhbmdlZCkgLS0tXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICBnbG9iZU1hdGVyaWFsLm9wYWNpdHkgPSAwLjU7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwO1xuXG5cbiAgLy8gNC4gLS0tIEZpbmFsIEdsb2JlIG9yaWVudGF0aW9uICh1bmNoYW5nZWQpIC0tLVxuICBjb25zdCBsYXQgPSAyNDtcbiAgY29uc3QgbG5nID0gNDU7XG4gIGNvbnN0IHJvdGF0aW9uWSA9IC1sbmcgKiAoTWF0aC5QSSAvIDE4MCk7XG4gIGNvbnN0IHJvdGF0aW9uWiA9IGxhdCAqIChNYXRoLlBJIC8gMTgwKTtcbiAgR2xvYmUucm90YXRlWShyb3RhdGlvblkpO1xuICBHbG9iZS5yb3RhdGVaKHJvdGF0aW9uWik7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG4gIC8vIGNvbnNvbGUubG9nKFwieDogXCIgKyBtb3VzZVggKyBcIiB5OiBcIiArIG1vdXNlWSk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyXG4gICAgICA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDVcbiAgICAgIDogMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcIjAwOWExMDc4YThlM2Q1Y2E4ZDA3XCIiXSwic291cmNlUm9vdCI6IiJ9