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
  .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__.features)
  .hexPolygonResolution(3)
  .hexPolygonMargin(0.7)
  .showAtmosphere(true)
  .atmosphereColor("#ffffffff")
  .atmosphereAltitude(0.15)
  .hexPolygonColor((e) => {
    if (
      ["MAN", "JED", "RIM",].includes(
        e.properties.ISO_A3
      )
    ) {
      return "rgba(255,255,255, 1)";
    } else return "rgba(255,255,255, 0.7)";
  });

  // NOTE Arc animations are followed after the globe enters the scene
 // REPLACE YOUR OLD setTimeout BLOCK WITH THIS ENTIRE ONE

setTimeout(() => {
  // --- STEP 1: Keep the labels, but make their original dot invisible ---
  Globe.labelsData(_files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__.airports)
    .labelColor(() => "#ffcb21")
    .labelDotOrientation((e) => (e.text === "ALA" ? "top" : "right"))
    //
    // --- THIS IS THE KEY CHANGE FOR HIDING THE DOT ---
    .labelDotRadius(0) // Set radius to 0 to make it disappear
    //
    .labelSize((e) => e.size)
    .labelText("city")
    .labelResolution(6)
    .labelAltitude(0.01)

    // --- STEP 2: Draw custom hexagons in place of the old points ---
    .customLayerData(_files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__.airports) // Use the same airport data
    .customThreeObject(d => {
      // Create a hexagon shape (a circle with 6 sides)
      const hexagonGeometry = new CircleGeometry(0.4, 6); // Change 0.4 to adjust size
      const hexagonMaterial = new MeshBasicMaterial({ color: '#ffffff' });
      return new Mesh(hexagonGeometry, hexagonMaterial);
    })
    .customThreeObjectUpdate((obj, d) => {
      // Position the hexagon correctly on the globe's surface
      const coords = Globe.getCoords(d.lat, d.lng, 0.08); // Altitude must match your old pointAltitude
      Object.assign(obj.position, coords);
      
      // Orient it to be flat against the globe
      const globeNormal = Globe.getCoords(d.lat, d.lng, 1);
      obj.lookAt(globeNormal);
    });
}, 1000);



 // --- Set initial rotation to Saudi Arabia (lat: 24, lng: 45) ---
const lat = -15;
const lng = 45;
const rotationY = -lng * (Math.PI / 180); // Rotate to the longitude
const rotationZ = lat * (Math.PI / 180);  // Tilt to the latitude

Globe.rotateY(rotationY);
Globe.rotateZ(rotationZ);
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
/******/ 		__webpack_require__.h = () => "537d0cbff10df497aaa4"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUM1QjtBQUNHO0FBQ0E7QUFDRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsbUJBQW1CLGdFQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsNkRBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLDZEQUF1QjtBQUM1QztBQUNBO0FBQ0EseURBQXlEO0FBQ3pELHFEQUFxRCxtQkFBbUI7QUFDeEU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7OztBQUlEO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6Qyx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0N6TUEsb0QiLCJmaWxlIjoibWFpbi5lNjBlNzg5ODM3NjhmODAwZWQyNS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIEZvZyxcbiAgLy8gQXhlc0hlbHBlcixcbiAgLy8gRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgLy8gQ2FtZXJhSGVscGVyLFxuICBQb2ludExpZ2h0LFxuICBTcGhlcmVHZW9tZXRyeSxcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVHbG93TWVzaCB9IGZyb20gXCJ0aHJlZS1nbG93LW1lc2hcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IHRyYXZlbEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktZmxpZ2h0cy5qc29uXCI7XG5pbXBvcnQgYWlycG9ydEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktYWlycG9ydHMuanNvblwiO1xudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAvLyBIZWxwZXJzXG4gIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICBhbmltYXRlSW46IHRydWUsXG59KVxuICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gIC5hdG1vc3BoZXJlQ29sb3IoXCIjZmZmZmZmZmZcIilcbiAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjE1KVxuICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgaWYgKFxuICAgICAgW1wiTUFOXCIsIFwiSkVEXCIsIFwiUklNXCIsXS5pbmNsdWRlcyhcbiAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BM1xuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMSlcIjtcbiAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC43KVwiO1xuICB9KTtcblxuICAvLyBOT1RFIEFyYyBhbmltYXRpb25zIGFyZSBmb2xsb3dlZCBhZnRlciB0aGUgZ2xvYmUgZW50ZXJzIHRoZSBzY2VuZVxuIC8vIFJFUExBQ0UgWU9VUiBPTEQgc2V0VGltZW91dCBCTE9DSyBXSVRIIFRISVMgRU5USVJFIE9ORVxuXG5zZXRUaW1lb3V0KCgpID0+IHtcbiAgLy8gLS0tIFNURVAgMTogS2VlcCB0aGUgbGFiZWxzLCBidXQgbWFrZSB0aGVpciBvcmlnaW5hbCBkb3QgaW52aXNpYmxlIC0tLVxuICBHbG9iZS5sYWJlbHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgIC5sYWJlbENvbG9yKCgpID0+IFwiI2ZmY2IyMVwiKVxuICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiAoZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIikpXG4gICAgLy9cbiAgICAvLyAtLS0gVEhJUyBJUyBUSEUgS0VZIENIQU5HRSBGT1IgSElESU5HIFRIRSBET1QgLS0tXG4gICAgLmxhYmVsRG90UmFkaXVzKDApIC8vIFNldCByYWRpdXMgdG8gMCB0byBtYWtlIGl0IGRpc2FwcGVhclxuICAgIC8vXG4gICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgIC5sYWJlbFRleHQoXCJjaXR5XCIpXG4gICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG5cbiAgICAvLyAtLS0gU1RFUCAyOiBEcmF3IGN1c3RvbSBoZXhhZ29ucyBpbiBwbGFjZSBvZiB0aGUgb2xkIHBvaW50cyAtLS1cbiAgICAuY3VzdG9tTGF5ZXJEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKSAvLyBVc2UgdGhlIHNhbWUgYWlycG9ydCBkYXRhXG4gICAgLmN1c3RvbVRocmVlT2JqZWN0KGQgPT4ge1xuICAgICAgLy8gQ3JlYXRlIGEgaGV4YWdvbiBzaGFwZSAoYSBjaXJjbGUgd2l0aCA2IHNpZGVzKVxuICAgICAgY29uc3QgaGV4YWdvbkdlb21ldHJ5ID0gbmV3IENpcmNsZUdlb21ldHJ5KDAuNCwgNik7IC8vIENoYW5nZSAwLjQgdG8gYWRqdXN0IHNpemVcbiAgICAgIGNvbnN0IGhleGFnb25NYXRlcmlhbCA9IG5ldyBNZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAnI2ZmZmZmZicgfSk7XG4gICAgICByZXR1cm4gbmV3IE1lc2goaGV4YWdvbkdlb21ldHJ5LCBoZXhhZ29uTWF0ZXJpYWwpO1xuICAgIH0pXG4gICAgLmN1c3RvbVRocmVlT2JqZWN0VXBkYXRlKChvYmosIGQpID0+IHtcbiAgICAgIC8vIFBvc2l0aW9uIHRoZSBoZXhhZ29uIGNvcnJlY3RseSBvbiB0aGUgZ2xvYmUncyBzdXJmYWNlXG4gICAgICBjb25zdCBjb29yZHMgPSBHbG9iZS5nZXRDb29yZHMoZC5sYXQsIGQubG5nLCAwLjA4KTsgLy8gQWx0aXR1ZGUgbXVzdCBtYXRjaCB5b3VyIG9sZCBwb2ludEFsdGl0dWRlXG4gICAgICBPYmplY3QuYXNzaWduKG9iai5wb3NpdGlvbiwgY29vcmRzKTtcbiAgICAgIFxuICAgICAgLy8gT3JpZW50IGl0IHRvIGJlIGZsYXQgYWdhaW5zdCB0aGUgZ2xvYmVcbiAgICAgIGNvbnN0IGdsb2JlTm9ybWFsID0gR2xvYmUuZ2V0Q29vcmRzKGQubGF0LCBkLmxuZywgMSk7XG4gICAgICBvYmoubG9va0F0KGdsb2JlTm9ybWFsKTtcbiAgICB9KTtcbn0sIDEwMDApO1xuXG5cblxuIC8vIC0tLSBTZXQgaW5pdGlhbCByb3RhdGlvbiB0byBTYXVkaSBBcmFiaWEgKGxhdDogMjQsIGxuZzogNDUpIC0tLVxuY29uc3QgbGF0ID0gLTE1O1xuY29uc3QgbG5nID0gNDU7XG5jb25zdCByb3RhdGlvblkgPSAtbG5nICogKE1hdGguUEkgLyAxODApOyAvLyBSb3RhdGUgdG8gdGhlIGxvbmdpdHVkZVxuY29uc3Qgcm90YXRpb25aID0gbGF0ICogKE1hdGguUEkgLyAxODApOyAgLy8gVGlsdCB0byB0aGUgbGF0aXR1ZGVcblxuR2xvYmUucm90YXRlWShyb3RhdGlvblkpO1xuR2xvYmUucm90YXRlWihyb3RhdGlvblopO1xuICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4RjY5RjAwKTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjU7XG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuICBnbG9iZU1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgZ2xvYmVNYXRlcmlhbC5vcGFjaXR5ID0gMC4yO1xuICAvLyBnbG9iZU1hdGVyaWFsLndpcmVmcmFtZSA9IHRydWU7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG4gIC8vIGNvbnNvbGUubG9nKFwieDogXCIgKyBtb3VzZVggKyBcIiB5OiBcIiArIG1vdXNlWSk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyXG4gICAgICA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDVcbiAgICAgIDogMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcIjUzN2QwY2JmZjEwZGY0OTdhYWE0XCIiXSwic291cmNlUm9vdCI6IiJ9