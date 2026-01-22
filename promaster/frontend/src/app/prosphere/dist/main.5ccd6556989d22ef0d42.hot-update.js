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
  mouseLight = new three__WEBPACK_IMPORTED_MODULE_3__.PointLight(0xffff0, 1.8, 150); // Color, Intensity, Distance
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

  renderer.render(scene, camera); // or composer.render();
  requestAnimationFrame(animate);
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "f3e13badbf94ff62bfc8"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFjOUI7QUFDOEQ7QUFDekI7QUFDTDtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSzs7QUFFOUI7QUFDQSxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQiw0Q0FBUztBQUMzQixpQkFBaUIsMENBQU87QUFDeEIsbUJBQW1CLDZDQUFVLG9CQUFvQjtBQUNqRCw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsMERBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDBEQUFtQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVDQUF1QyxpREFBYztBQUNyRDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWSx3Q0FBSyxlQUFlO0FBQ2xELHFCQUFxQjtBQUNyQixLQUFLO0FBQ0wsVUFBVSwyQ0FBUTtBQUNsQixjQUFjLG1EQUFnQjtBQUM5QjtBQUNBLEdBQUc7O0FBRUg7QUFDQSw2QkFBNkIsdUNBQUk7QUFDakMsUUFBUSxpREFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUM7QUFDakM7QUFDQTs7Ozs7Ozs7Ozs7V0M5T0Esb0QiLCJmaWxlIjoibWFpbi41Y2NkNjU1Njk4OWQyMmVmMGQ0Mi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBDb2xvcixcbiAgUG9pbnRMaWdodCxcbiAgU2hhZGVyTWF0ZXJpYWwsXG4gIEJhY2tTaWRlLFxuICBNZXNoLFxuICBTcGhlcmVHZW9tZXRyeSwgICAgXG4gIEFkZGl0aXZlQmxlbmRpbmcsICBcbiAgUmF5Y2FzdGVyLFxuICBWZWN0b3IyLFxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IE1ZQlJBTkNIRVMgZnJvbSBcIi4vZmlsZXMvQlJBTkNIRVMuanNvblwiO1xudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbnZhciBHbG9iZTtcblxudmFyIHJheWNhc3RlciwgbW91c2VQb3MsIG1vdXNlTGlnaHQ7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICAvLyBIZWxwZXJzXG4gIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDMwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICByYXljYXN0ZXIgPSBuZXcgUmF5Y2FzdGVyKCk7XG4gIG1vdXNlUG9zID0gbmV3IFZlY3RvcjIoKTtcbiAgbW91c2VMaWdodCA9IG5ldyBQb2ludExpZ2h0KDB4ZmZmZjAsIDEuOCwgMTUwKTsgLy8gQ29sb3IsIEludGVuc2l0eSwgRGlzdGFuY2VcbiAgbW91c2VMaWdodC52aXNpYmxlID0gZmFsc2U7IC8vIFN0YXJ0IHdpdGggdGhlIGxpZ2h0IG9mZlxuICBzY2VuZS5hZGQobW91c2VMaWdodCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG4vLyBTRUNUSU9OIEdsb2JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0gUkVQTEFDRSBZT1VSIE9MRCBpbml0R2xvYmUgRlVOQ1RJT04gV0lUSCBUSElTIEVOVElSRSBCTE9DSyAtLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAvLyAxLiAtLS0gSW5pdGlhbGl6ZSB0aGUgR2xvYmUgKHVuY2hhbmdlZCkgLS0tXG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjQpXG4gICAgLnNob3dBdG1vc3BoZXJlKGZhbHNlKSAvLyA8LS0gQ29ycmVjdGx5IHR1cm5lZCBvZmZcbiAgICAuaGV4UG9seWdvbkNvbG9yKCgpID0+ICcjZTBhODBlZmYnKTtcblxuICAvLyAtLS0gWW91ciBvcmlnaW5hbCBsYWJlbHMgYW5kIHBvaW50cyBjb2RlICh1bmNoYW5nZWQpIC0tLVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5sYWJlbHNEYXRhKE1ZQlJBTkNIRVMuQlJBTkNIRVMpXG4gICAgICAubGFiZWxDb2xvcigoKSA9PiAnI2ZmZmZmZmZmJylcbiAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiAoZS50ZXh0ID09PSAnQUxBJyA/ICd0b3AnIDogJ3JpZ2h0JykpXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC42KVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dCgnY2l0eScpXG4gICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgLnBvaW50c0RhdGEoTVlCUkFOQ0hFUy5CUkFOQ0hFUylcbiAgICAgIC5wb2ludENvbG9yKCgpID0+ICcjZmZmZmZmJylcbiAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgIC5wb2ludFJhZGl1cygwLjA1KTtcbiAgfSwgMTAwMCk7XG5cbiAgLy8gMi4gLS0tIENyZWF0ZSB0aGUgY3VzdG9tIHJlYWxpc3RpYyBhdG1vc3BoZXJlIChDT1JSRUNURUQgQ09ERSkgLS0tXG4gIGNvbnN0IHZlcnRleFNoYWRlciA9IGBcbiAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbDtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICB2Tm9ybWFsID0gbm9ybWFsaXplKCBub3JtYWxNYXRyaXggKiBub3JtYWwgKTtcbiAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTtcbiAgICB9XG4gIGA7XG4gIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gYFxuICAgIHVuaWZvcm0gdmVjMyBnbG93Q29sb3I7XG4gICAgdW5pZm9ybSBmbG9hdCBmYWxsb2ZmUG93ZXI7XG4gICAgdmFyeWluZyB2ZWMzIHZOb3JtYWw7XG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgZmxvYXQgaW50ZW5zaXR5ID0gcG93KCAwLjcgLSBkb3QoIHZOb3JtYWwsIHZlYzMoIDAuMCwgMC4wLCAxLjAgKSApLCBmYWxsb2ZmUG93ZXIgKTtcbiAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoIGdsb3dDb2xvciwgMS4wICkgKiBpbnRlbnNpdHk7XG4gICAgfVxuICBgO1xuXG4gIC8vIENyZWF0ZSB0aGUgc2hhZGVyIG1hdGVyaWFsXG4gIGNvbnN0IGN1c3RvbUF0bW9zcGhlcmVNYXRlcmlhbCA9IG5ldyBTaGFkZXJNYXRlcmlhbCh7XG4gICAgdmVydGV4U2hhZGVyLFxuICAgIGZyYWdtZW50U2hhZGVyLFxuICAgIHVuaWZvcm1zOiB7XG4gICAgICBnbG93Q29sb3I6IHsgdmFsdWU6IG5ldyBDb2xvcignIzdiOGIyZmZmJykgfSxcbiAgICAgIGZhbGxvZmZQb3dlcjogeyB2YWx1ZTogNy4wIH1cbiAgICB9LFxuICAgIHNpZGU6IEJhY2tTaWRlLFxuICAgIGJsZW5kaW5nOiBBZGRpdGl2ZUJsZW5kaW5nLCAvLyA8LS0gQ29ycmVjdGVkOiBObyBcIlRIUkVFLlwiXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gIH0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgYXRtb3NwaGVyZSBtZXNoXG4gIGNvbnN0IGF0bW9zcGhlcmVNZXNoID0gbmV3IE1lc2goXG4gICAgbmV3IFNwaGVyZUdlb21ldHJ5KDEwMCwgNTAsIDUwKSwgLy8gPC0tIENvcnJlY3RlZDogTm8gXCJUSFJFRS5cIlxuICAgIGN1c3RvbUF0bW9zcGhlcmVNYXRlcmlhbFxuICApO1xuICBhdG1vc3BoZXJlTWVzaC5zY2FsZS5zZXQoMS4xNSwgMS4xNSwgMS4xNSk7XG4gIEdsb2JlLmFkZChhdG1vc3BoZXJlTWVzaCk7XG5cblxuICAvLyAzLiAtLS0gWW91ciBHbG9iZSdzIEJhc2UgTWF0ZXJpYWwgKHVuY2hhbmdlZCkgLS0tXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICBnbG9iZU1hdGVyaWFsLm9wYWNpdHkgPSAwLjk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwO1xuXG5cbiAgLy8gNC4gLS0tIEZpbmFsIEdsb2JlIG9yaWVudGF0aW9uICh1bmNoYW5nZWQpIC0tLVxuICBjb25zdCBsYXQgPSAyNDtcbiAgY29uc3QgbG5nID0gNDU7XG4gIGNvbnN0IHJvdGF0aW9uWSA9IC1sbmcgKiAoTWF0aC5QSSAvIDE4MCk7XG4gIGNvbnN0IHJvdGF0aW9uWiA9IGxhdCAqIChNYXRoLlBJIC8gMTgwKTtcbiAgR2xvYmUucm90YXRlWShyb3RhdGlvblkpO1xuICBHbG9iZS5yb3RhdGVaKHJvdGF0aW9uWik7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG5cbiAgbW91c2VQb3MueCA9IChldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDE7XG4gIG1vdXNlUG9zLnkgPSAtKGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDE7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAvLyBZb3VyIGV4aXN0aW5nIGNhbWVyYSBkcmlmdCBhbmQgY29udHJvbHMgY29kZVxuICBjYW1lcmEucG9zaXRpb24ueCArPSBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMiA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDUgOiAwO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gIC8vIC0tLSBUSElTIElTIFRIRSBORVcgUkFZQ0FTVElORyBMT0dJQyAtLS1cblxuICAvLyBVcGRhdGUgdGhlIHBpY2tpbmcgcmF5IHdpdGggdGhlIGNhbWVyYSBhbmQgbW91c2UgcG9zaXRpb25cbiAgcmF5Y2FzdGVyLnNldEZyb21DYW1lcmEobW91c2VQb3MsIGNhbWVyYSk7XG5cbiAgLy8gQ2FsY3VsYXRlIG9iamVjdHMgaW50ZXJzZWN0aW5nIHRoZSBwaWNraW5nIHJheVxuICBjb25zdCBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMoR2xvYmUuY2hpbGRyZW4sIHRydWUpO1xuXG4gIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAvLyBJZiB0aGUgcmF5IGhpdHMgdGhlIGdsb2JlLCBtb3ZlIHRoZSBsaWdodCB0byB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XG4gICAgbW91c2VMaWdodC5wb3NpdGlvbi5jb3B5KGludGVyc2VjdHNbMF0ucG9pbnQpO1xuICAgIG1vdXNlTGlnaHQudmlzaWJsZSA9IHRydWU7IC8vIFR1cm4gdGhlIGxpZ2h0IG9uXG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgdGhlIHJheSBkb2VzIG5vdCBoaXQgdGhlIGdsb2JlLCB0dXJuIHRoZSBsaWdodCBvZmZcbiAgICBtb3VzZUxpZ2h0LnZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTsgLy8gb3IgY29tcG9zZXIucmVuZGVyKCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiZjNlMTNiYWRiZjk0ZmY2MmJmYzhcIiJdLCJzb3VyY2VSb290IjoiIn0=