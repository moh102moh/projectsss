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
Globe.arcsData(_files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__.flights)
// SECTION Globe
function initGlobe() {
  // Initialize the Globe
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
  waitForGlobeReady: true,
  animateIn: true,
})
  .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__.features)
  .hexPolygonResolution(3)
  .hexPolygonMargin(0.7)
  .showAtmosphere(true)
  .atmosphereColor("#3a228a")
  .atmosphereAltitude(0.25)
  .hexPolygonColor((e) => {
    if (
      ["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(
        e.properties.ISO_A3
      )
    ) {
      return "rgba(255,255,255, 1)";
    } else return "rgba(255,255,255, 0.7)";
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
/******/ 		__webpack_require__.h = () => "792b69d3d4d6f2f6e0f3"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUM1QjtBQUNHO0FBQ0E7QUFDRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDJEQUFxQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsbUJBQW1CLGdFQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsbUJBQW1CLDJEQUFxQjtBQUN4QztBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDZEQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiw2REFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NoTUEsb0QiLCJmaWxlIjoibWFpbi44ZThiNzA2NjY5OThlMTRmOTJkNS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIEZvZyxcbiAgLy8gQXhlc0hlbHBlcixcbiAgLy8gRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgLy8gQ2FtZXJhSGVscGVyLFxuICBQb2ludExpZ2h0LFxuICBTcGhlcmVHZW9tZXRyeSxcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVHbG93TWVzaCB9IGZyb20gXCJ0aHJlZS1nbG93LW1lc2hcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IHRyYXZlbEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktZmxpZ2h0cy5qc29uXCI7XG5pbXBvcnQgYWlycG9ydEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktYWlycG9ydHMuanNvblwiO1xudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAvLyBIZWxwZXJzXG4gIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cbkdsb2JlLmFyY3NEYXRhKHRyYXZlbEhpc3RvcnkuZmxpZ2h0cylcbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICBhbmltYXRlSW46IHRydWUsXG59KVxuICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgIGlmIChcbiAgICAgIFtcIktHWlwiLCBcIktPUlwiLCBcIlRIQVwiLCBcIlJVU1wiLCBcIlVaQlwiLCBcIklETlwiLCBcIktBWlwiLCBcIk1ZU1wiXS5pbmNsdWRlcyhcbiAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BM1xuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMSlcIjtcbiAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC43KVwiO1xuICB9KTtcblxuICAvLyBOT1RFIEFyYyBhbmltYXRpb25zIGFyZSBmb2xsb3dlZCBhZnRlciB0aGUgZ2xvYmUgZW50ZXJzIHRoZSBzY2VuZVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5hcmNzRGF0YSh0cmF2ZWxIaXN0b3J5LmZsaWdodHMpXG4gICAgICAuYXJjQ29sb3IoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIjtcbiAgICAgIH0pXG4gICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuYXJjQWx0O1xuICAgICAgfSlcbiAgICAgIC5hcmNTdHJva2UoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMC41IDogMC4zO1xuICAgICAgfSlcbiAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApXG4gICAgICAuYXJjc1RyYW5zaXRpb25EdXJhdGlvbigxMDAwKVxuICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgIC5sYWJlbHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZmZjYjIxXCIpXG4gICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgIH0pXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dChcImNpdHlcIilcbiAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAucG9pbnRzRGF0YShhaXJwb3J0SGlzdG9yeS5haXJwb3J0cylcbiAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyA5KSk7XG4gIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweEY2OUYwMCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC41O1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcbiAgZ2xvYmVNYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gIGdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuMjtcbiAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI3OTJiNjlkM2Q0ZDZmMmY2ZTBmM1wiIl0sInNvdXJjZVJvb3QiOiIifQ==