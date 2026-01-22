import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import countries from './files/globe-data-min.json';
import MYBRANCHES from './files/BRANCHES.json';
import saudiProvinces from './files/saudi-provinces.json';

export function startGlobe(domContainer) {
  if (!domContainer) throw new Error('domContainer required');

  let renderer, scene, camera, controls, Globe;
  let animationId;
  let lowerCover = null;
  let currentMode = null;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);

 
  function createShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');  
    gradient.addColorStop(1, 'rgba(0,0,0,0)');  
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  function getMode() {
    const w = window.innerWidth;
    if (w <= 600) return 'small';
    if (w <= 1024) return 'medium';
    return 'large';
  }

  function createRenderer() {
    const old = domContainer.querySelector('canvas');
    if (old) old.remove();

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, 
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(DPR);
    renderer.setSize(domContainer.clientWidth, domContainer.clientHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    domContainer.appendChild(renderer.domElement);
  }

  function initSceneCameraLights() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 300, 500);
    camera = new THREE.PerspectiveCamera(
      45,
      domContainer.clientWidth / domContainer.clientHeight,
      1,
      1000
    );
    scene.add(camera);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(-300, 500, 400);
    camera.add(key);

    const fill = new THREE.PointLight(0x9a7cff, 0.6);
    fill.position.set(200, 300, 200);
    camera.add(fill);
  }

  function createGlobe() {
    Globe = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    });

    Globe.hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.25)
      .hexPolygonColor(() => '#e5c21f')
      .showAtmosphere(false);

    const allowedProvinces = ['Ar Riyad', 'Riyad', 'Makkah'];

    const provincesToFill = saudiProvinces.features.filter((feature) => {
      const name = feature.properties?.name || feature.properties?.NAME_1 || '';
      return allowedProvinces.some((a) => name.includes(a));
    });

    Globe.polygonsData(provincesToFill)
      .polygonCapColor(() => 'rgba(255,255,255,0.9)')
      .polygonSideColor(() => '#ffffff')
      .polygonAltitude(0.006)
      .polygonStrokeColor(() => '#ffffff');

    provincesToFill.forEach((feature) => {
      const drawRing = (ring) => {
        const points = ring.map(([lng, lat]) =>
          Globe.getCoords(lat, lng, 0.007)
        );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.5,
        });
        Globe.add(new THREE.LineLoop(geometry, material));
      };

      const { type, coordinates } = feature.geometry;
      if (type === 'MultiPolygon') {
        coordinates.forEach((poly) => poly.forEach(drawRing));
      } else if (type === 'Polygon') {
        coordinates.forEach(drawRing);
      }
    });

    const cubeSize = 0.5;
    const cubeHeight = 2;
    const branchCubes = [];

    MYBRANCHES.BRANCHES.forEach((branch) => {
      const { x, y, z } = Globe.getCoords(branch.lat, branch.lng, 0);
      const geometry = new THREE.BoxGeometry(cubeSize, cubeHeight, cubeSize);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const cube = new THREE.Mesh(geometry, material);

      const vector = new THREE.Vector3(x, y, z)
        .normalize()
        .multiplyScalar(100 + cubeHeight / 2);

      cube.position.set(vector.x, vector.y, vector.z);
      cube.lookAt(new THREE.Vector3(0, 0, 0));
      cube.userData.city = branch.city;
      branchCubes.push(cube);
      Globe.add(cube);
    });

    Globe.labelsData(MYBRANCHES.BRANCHES)
      .labelLat(d => d.lat)
      .labelLng(d => d.lng)
      .labelText(d => d.city)
      .labelSize(1.5)
      .labelColor(() => '#000000')
      .labelDotRadius(0)
      .labelAltitude(0.05)
      .labelResolution(2);

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '4px 8px';
    tooltip.style.background = 'rgba(0,0,0,0.7)';
    tooltip.style.color = '#fff';
    tooltip.style.fontSize = '12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(branchCubes);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        tooltip.style.display = 'block';
        tooltip.innerText = obj.userData.city;
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
      } else {
        tooltip.style.display = 'none';
      }
    });

    scene.add(Globe);

    const saudiTarget = Globe.getCoords(24, 45, 0);
    camera.lookAt(saudiTarget);
  }

  function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
  }

  function applyMode(mode) {
    if (!Globe || !camera || !controls) return;

    currentMode = mode;

    if (lowerCover) {
      try { Globe.remove(lowerCover); } catch (e) {}
      lowerCover.geometry?.dispose?.();
      lowerCover.material?.dispose?.();
      lowerCover = null;
    }

    
    const shadowGeo = new THREE.PlaneGeometry(300, 300);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      opacity: 0.8, 
      depthWrite: false,
    });
    lowerCover = new THREE.Mesh(shadowGeo, shadowMat);
    lowerCover.rotation.x = -Math.PI / 2;

    if (mode === 'large') {
      camera.position.set(0, 18, 350);
      Globe.scale.set(1.35, 1.35, 1.35);
      Globe.position.set(0, -20, 0);
      Globe.rotation.y = -0.6;
      controls.dampingFactor = 0.08;
      lowerCover.position.set(0, -105, 0); 
      lowerCover.scale.set(1.5, 1.5, 1.5);

      controls.enableRotate = true;
      controls.enableDamping = true;
      controls.minPolarAngle = Math.PI / 2;
      controls.maxPolarAngle = Math.PI / 2;
    } else if (mode === 'medium') {
      camera.position.set(0, 18, 340);
      Globe.scale.set(1.05, 1.05, 1.05);
      Globe.position.set(0, -20, 0);
      Globe.rotation.y = -0.82;
      lowerCover.position.set(0, -102, 0);
      controls.enableRotate = false;
    } else {
      camera.position.set(0, 10, 380);
      Globe.scale.set(0.75, 0.75, 0.75);
      Globe.position.set(0, 18, 0);
      Globe.rotation.y = -0.85;
      lowerCover.position.set(0, -102, 0);
      controls.enableRotate = false;
    }

    Globe.add(lowerCover);

    renderer.setSize(domContainer.clientWidth, domContainer.clientHeight, false);
    camera.aspect = domContainer.clientWidth / domContainer.clientHeight;
    camera.updateProjectionMatrix();
  }

  function onResize() {
    const mode = getMode();
    if (mode !== currentMode) applyMode(mode);
    else {
      renderer.setSize(domContainer.clientWidth, domContainer.clientHeight);
      camera.aspect = domContainer.clientWidth / domContainer.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  let rotated = 0;
  let direction = 1;
  const HALF_TURN = Math.PI / 6;
  const ROTATE_SPEED = 0.0005;
  const INVERT = -1;

  function animate() {
    if (Globe && currentMode === 'large') {
      Globe.rotation.y += ROTATE_SPEED * direction * INVERT;
      rotated += ROTATE_SPEED * direction;
      if (rotated >= HALF_TURN) direction = -1;
      if (rotated <= 0) direction = 1;
    }
    if (controls) controls.update();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  createRenderer();
  initSceneCameraLights();
  createGlobe();
  initControls();
  applyMode(getMode());

  window.addEventListener('resize', onResize);
  animate();

  return function destroy() {
    window.removeEventListener('resize', onResize);
    cancelAnimationFrame(animationId);
    controls?.dispose();
    scene?.traverse((o) => {
      o.geometry?.dispose();
      if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
      else o.material?.dispose();
    });
    renderer?.dispose();
    renderer = scene = camera = Globe = null;
  };
}