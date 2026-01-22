self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_glow_mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-glow-mesh */ "./node_modules/three-glow-mesh/dist/index.module.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");
/* harmony import */ var _files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./files/my-airports.json */ "./src/files/my-airports.json");








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
  renderer = new three__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new three__WEBPACK_IMPORTED_MODULE_5__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_5__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x000000);

  // Initialize camera, light
  camera = new three__WEBPACK_IMPORTED_MODULE_5__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_5__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);

  // Additional effects
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_5__.Fog(0x535ef3, 400, 2000);

  // Helpers
  // const axesHelper = new AxesHelper(800);
  // scene.add(axesHelper);
  // var helper = new DirectionalLightHelper(dLight);
  // scene.add(helper);
  // var helperCamera = new CameraHelper(dLight.shadow.camera);
  // scene.add(helperCamera);

  // Initialize controls
  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_6__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 500;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;
  controls.autoRotate = false;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}

// SECTION Globe
function initGlobe() {
  // Initialize the Globe
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
  waitForGlobeReady: true,
  animateIn: true,
})
  .showAtmosphere(true)
  .atmosphereColor('#00d5ff')   // This is the bright blue atmospheric glow
  .atmosphereAltitude(0.2)
  .polygonCapColor(() => '#00d5ff') // The color of the country surfaces
  .polygonSideColor(() => 'rgba(0, 255, 255, 0.05)') // Faint glow on the sides
  .polygonStrokeColor(() => '#33aaff'); // The outline of the countries

// This new part fetches the country outline data and applies it
fetch('//unpkg.com/three-globe/example/datasets/ne_110m_admin_0_countries.geojson')
  .then(res => res.json())
  .then(countries => {
    Globe.polygonsData(countries.features);
  });

  // NOTE Arc animations are followed after the globe enters the scene
  setTimeout(() => {
    Globe.arcsData(_files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__.flights)
      .arcColor((e) => {
        return e.status ? "#9cff00" : "#FF4000";
      })
      .arcAltitude((e) => {
        return e.arcAlt;
      })
      .arcStroke((e) => {
        return e.status ? 0.5 : 0.3;
      })
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap((e) => e.order * 1)
      .labelsData(_files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__.airports)
      .labelColor(() => "#ffcb21")
      .labelDotOrientation((e) => {
        return e.text === "ALA" ? "top" : "right";
      })
      .labelDotRadius(0.3)
      .labelSize((e) => e.size)
      .labelText("city")
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(_files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__.airports)
      .pointColor(() => "#ffffff")
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);
  }, 1000);

  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0xF69F00);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.5;
  globeMaterial.shininess = 0.7;
  globeMaterial.transparent = true;
  globeMaterial.opacity = 0.2;
  // globeMaterial.wireframe = true;

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
/******/ 		__webpack_require__.h = () => "0b90973ea442dfedafc3"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUM1QjtBQUNHO0FBQ0E7QUFDRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxnREFBVTtBQUN4QjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxtQkFBbUIsMkRBQXFCO0FBQ3hDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsNkRBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDZEQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQzlMQSxvRCIsImZpbGUiOiJtYWluLmZmY2U2Y2I2ZDA1ODM2YjAyZjVlLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQge1xuICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBDb2xvcixcbiAgRm9nLFxuICAvLyBBeGVzSGVscGVyLFxuICAvLyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyLFxuICAvLyBDYW1lcmFIZWxwZXIsXG4gIFBvaW50TGlnaHQsXG4gIFNwaGVyZUdlb21ldHJ5LFxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUdsb3dNZXNoIH0gZnJvbSBcInRocmVlLWdsb3ctbWVzaFwiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjtcbmltcG9ydCBhaXJwb3J0SGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1haXJwb3J0cy5qc29uXCI7XG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gIC8vIEFkZGl0aW9uYWwgZWZmZWN0c1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIC8vIEhlbHBlcnNcbiAgLy8gY29uc3QgYXhlc0hlbHBlciA9IG5ldyBBeGVzSGVscGVyKDgwMCk7XG4gIC8vIHNjZW5lLmFkZChheGVzSGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlciA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyKGRMaWdodCk7XG4gIC8vIHNjZW5lLmFkZChoZWxwZXIpO1xuICAvLyB2YXIgaGVscGVyQ2FtZXJhID0gbmV3IENhbWVyYUhlbHBlcihkTGlnaHQuc2hhZG93LmNhbWVyYSk7XG4gIC8vIHNjZW5lLmFkZChoZWxwZXJDYW1lcmEpO1xuXG4gIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBTRUNUSU9OIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIC8vIEluaXRpYWxpemUgdGhlIEdsb2JlXG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgYW5pbWF0ZUluOiB0cnVlLFxufSlcbiAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gIC5hdG1vc3BoZXJlQ29sb3IoJyMwMGQ1ZmYnKSAgIC8vIFRoaXMgaXMgdGhlIGJyaWdodCBibHVlIGF0bW9zcGhlcmljIGdsb3dcbiAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjIpXG4gIC5wb2x5Z29uQ2FwQ29sb3IoKCkgPT4gJyMwMGQ1ZmYnKSAvLyBUaGUgY29sb3Igb2YgdGhlIGNvdW50cnkgc3VyZmFjZXNcbiAgLnBvbHlnb25TaWRlQ29sb3IoKCkgPT4gJ3JnYmEoMCwgMjU1LCAyNTUsIDAuMDUpJykgLy8gRmFpbnQgZ2xvdyBvbiB0aGUgc2lkZXNcbiAgLnBvbHlnb25TdHJva2VDb2xvcigoKSA9PiAnIzMzYWFmZicpOyAvLyBUaGUgb3V0bGluZSBvZiB0aGUgY291bnRyaWVzXG5cbi8vIFRoaXMgbmV3IHBhcnQgZmV0Y2hlcyB0aGUgY291bnRyeSBvdXRsaW5lIGRhdGEgYW5kIGFwcGxpZXMgaXRcbmZldGNoKCcvL3VucGtnLmNvbS90aHJlZS1nbG9iZS9leGFtcGxlL2RhdGFzZXRzL25lXzExMG1fYWRtaW5fMF9jb3VudHJpZXMuZ2VvanNvbicpXG4gIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAudGhlbihjb3VudHJpZXMgPT4ge1xuICAgIEdsb2JlLnBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpO1xuICB9KTtcblxuICAvLyBOT1RFIEFyYyBhbmltYXRpb25zIGFyZSBmb2xsb3dlZCBhZnRlciB0aGUgZ2xvYmUgZW50ZXJzIHRoZSBzY2VuZVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5hcmNzRGF0YSh0cmF2ZWxIaXN0b3J5LmZsaWdodHMpXG4gICAgICAuYXJjQ29sb3IoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIjtcbiAgICAgIH0pXG4gICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuYXJjQWx0O1xuICAgICAgfSlcbiAgICAgIC5hcmNTdHJva2UoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMC41IDogMC4zO1xuICAgICAgfSlcbiAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApXG4gICAgICAuYXJjc1RyYW5zaXRpb25EdXJhdGlvbigxMDAwKVxuICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgIC5sYWJlbHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZmZjYjIxXCIpXG4gICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgIH0pXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dChcImNpdHlcIilcbiAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAucG9pbnRzRGF0YShhaXJwb3J0SGlzdG9yeS5haXJwb3J0cylcbiAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyA5KSk7XG4gIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweEY2OUYwMCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC41O1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcbiAgZ2xvYmVNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gIGdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuMjtcbiAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCIwYjkwOTczZWE0NDJkZmVkYWZjM1wiIl0sInNvdXJjZVJvb3QiOiIifQ==