self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/files/BRANCHES.json":
/*!*********************************!*\
  !*** ./src/files/BRANCHES.json ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"type\":\"AirportsCollection\",\"airports\":[{\"city\":\"ALMANAR\",\"text\":\"MAN\",\"lat\":24.72884572465801,\"lng\":46.80663907290279,\"size\":1},{\"city\":\"ALRIMAL\",\"text\":\"RIM\",\"lat\":15.83750109102638,\"lng\":46.82487166701623,\"size\":1},{\"city\":\"Jeddah\",\"text\":\"JED\",\"lat\":21.4858,\"lng\":39.1925,\"size\":1}]}");

/***/ }),

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
  // 1. --- Initialize the Globe and set up the hexagon style ---
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    //
    // --- KEY CHANGES for VISIBLE, TIGHT HEXAGONS ---
    .hexPolygonResolution(3) // Lower number = BIGGER hexagons
    .hexPolygonMargin(0.4)   // Small number = hexagons are VERY CLOSE
    //
    .showAtmosphere(true)
    .atmosphereColor('#7b8b2fff')
    .atmosphereAltitude(0.25)
    // --- Set a single, bright color for ALL hexagons ---
    .hexPolygonColor(() => '#e0a80eff');

  // 2. --- Your original label and point code ---
  setTimeout(() => {
    Globe.labelsData(_files_BRANCHES_json__WEBPACK_IMPORTED_MODULE_2__.airports)
      .labelColor(() => '#ffffffff')
      .labelDotOrientation((e) => (e.text === 'ALA' ? 'top' : 'right'))
      .labelDotRadius(0.6)
      .labelSize((e) => e.size)
      .labelText('city')
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(_files_BRANCHES_json__WEBPACK_IMPORTED_MODULE_2__.airports)
      .pointColor(() => '#ffffff')
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);
  }, 1000);

  // 3. --- Globe Base Material (THE CRITICAL FIX) ---
  // The globe *underneath* the hexagons must be dark and solid.
  const globeMaterial = Globe.globeMaterial();

// --- Settings for True Transparency ---
globeMaterial.transparent = true;
globeMaterial.opacity = 0.5;      // <-- Adjust this value (0.1 to 0.5 is good)
globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000); 
globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x000000);
globeMaterial.shininess = 0;


  // 4. --- Final Globe orientation and adding to scene ---
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
/******/ 		__webpack_require__.h = () => "ed9372721a9881dc148d"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUN6QjtBQUNEO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLHdDQUFLO0FBQ25CLGdCQUFnQiwrQ0FBWTtBQUM1Qix5QkFBeUIsd0NBQUs7O0FBRTlCO0FBQ0EsZUFBZSxvREFBaUI7QUFDaEM7QUFDQTs7QUFFQSxtQkFBbUIsbURBQWdCO0FBQ25DO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQjtBQUNwQztBQUNBOztBQUVBLG9CQUFvQiw2Q0FBVTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxnREFBVTtBQUN4QjtBQUNBO0FBQ0EsR0FBRztBQUNILHFCQUFxQixnRUFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwwREFBdUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMERBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QiwwQkFBMEIsd0NBQUssVztBQUMvQiw2QkFBNkIsd0NBQUs7QUFDbEM7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NsTEEsb0QiLCJmaWxlIjoibWFpbi5iYTFiNzk0ZTU3OTNiYmE2ZmJmZi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIEZvZyxcbiAgLy8gQXhlc0hlbHBlcixcbiAgLy8gRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgLy8gQ2FtZXJhSGVscGVyLFxuICBQb2ludExpZ2h0LFxuICBTcGhlcmVHZW9tZXRyeSxcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCBhaXJwb3J0SGlzdG9yeSBmcm9tIFwiLi9maWxlcy9CUkFOQ0hFUy5qc29uXCI7XG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICAvLyBIZWxwZXJzXG4gIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDMwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cbi8vIFNFQ1RJT04gR2xvYmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLSBSRVBMQUNFIFlPVVIgT0xEIGluaXRHbG9iZSBGVU5DVElPTiBXSVRIIFRISVMgRU5USVJFIEJMT0NLIC0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIC8vIDEuIC0tLSBJbml0aWFsaXplIHRoZSBHbG9iZSBhbmQgc2V0IHVwIHRoZSBoZXhhZ29uIHN0eWxlIC0tLVxuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLy9cbiAgICAvLyAtLS0gS0VZIENIQU5HRVMgZm9yIFZJU0lCTEUsIFRJR0hUIEhFWEFHT05TIC0tLVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKSAvLyBMb3dlciBudW1iZXIgPSBCSUdHRVIgaGV4YWdvbnNcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjQpICAgLy8gU21hbGwgbnVtYmVyID0gaGV4YWdvbnMgYXJlIFZFUlkgQ0xPU0VcbiAgICAvL1xuICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgIC5hdG1vc3BoZXJlQ29sb3IoJyM3YjhiMmZmZicpXG4gICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuICAgIC8vIC0tLSBTZXQgYSBzaW5nbGUsIGJyaWdodCBjb2xvciBmb3IgQUxMIGhleGFnb25zIC0tLVxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKCkgPT4gJyNlMGE4MGVmZicpO1xuXG4gIC8vIDIuIC0tLSBZb3VyIG9yaWdpbmFsIGxhYmVsIGFuZCBwb2ludCBjb2RlIC0tLVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5sYWJlbHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gJyNmZmZmZmZmZicpXG4gICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4gKGUudGV4dCA9PT0gJ0FMQScgPyAndG9wJyA6ICdyaWdodCcpKVxuICAgICAgLmxhYmVsRG90UmFkaXVzKDAuNilcbiAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgIC5sYWJlbFRleHQoJ2NpdHknKVxuICAgICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgICAgLmxhYmVsQWx0aXR1ZGUoMC4wMSlcbiAgICAgIC5wb2ludHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgICAgLnBvaW50Q29sb3IoKCkgPT4gJyNmZmZmZmYnKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICAvLyAzLiAtLS0gR2xvYmUgQmFzZSBNYXRlcmlhbCAoVEhFIENSSVRJQ0FMIEZJWCkgLS0tXG4gIC8vIFRoZSBnbG9iZSAqdW5kZXJuZWF0aCogdGhlIGhleGFnb25zIG11c3QgYmUgZGFyayBhbmQgc29saWQuXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG5cbi8vIC0tLSBTZXR0aW5ncyBmb3IgVHJ1ZSBUcmFuc3BhcmVuY3kgLS0tXG5nbG9iZU1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbmdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuNTsgICAgICAvLyA8LS0gQWRqdXN0IHRoaXMgdmFsdWUgKDAuMSB0byAwLjUgaXMgZ29vZClcbmdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgwMDAwMDApOyBcbmdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwO1xuXG5cbiAgLy8gNC4gLS0tIEZpbmFsIEdsb2JlIG9yaWVudGF0aW9uIGFuZCBhZGRpbmcgdG8gc2NlbmUgLS0tXG4gIGNvbnN0IGxhdCA9IDI0O1xuICBjb25zdCBsbmcgPSA0NTtcbiAgY29uc3Qgcm90YXRpb25ZID0gLWxuZyAqIChNYXRoLlBJIC8gMTgwKTtcbiAgY29uc3Qgcm90YXRpb25aID0gbGF0ICogKE1hdGguUEkgLyAxODApO1xuICBHbG9iZS5yb3RhdGVZKHJvdGF0aW9uWSk7XG4gIEdsb2JlLnJvdGF0ZVoocm90YXRpb25aKTtcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xuXG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJlZDkzNzI3MjFhOTg4MWRjMTQ4ZFwiIl0sInNvdXJjZVJvb3QiOiIifQ==