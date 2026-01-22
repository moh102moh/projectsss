'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default function FooterVideoModel() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        /* ========= SCENE ========= */
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // ✅ متوافق مع إصدارك
        renderer.outputEncoding = THREE.sRGBEncoding;

        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        /* ========= LIGHT ========= */
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(3, 5, 5);
        scene.add(dirLight);

        /* ========= HDR ========= */
        const pmrem = new THREE.PMREMGenerator(renderer);

        new RGBELoader().load(
            'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_indoor_clean_1k.hdr',
            (hdr) => {
                const envMap = pmrem.fromEquirectangular(hdr).texture;
                scene.environment = envMap;
                hdr.dispose();
                pmrem.dispose();
            }
        );

        /* ========= MODEL ========= */
        let model;
        const loader = new GLTFLoader();

        loader.load('/image/finall asset.glb', (gltf) => {
            model = gltf.scene;
            scene.add(model);

            model.scale.set(1.2, 1.2, 1.2);
            model.position.set(0, -0.5, 0);

            // Auto frame
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3()).length();
            const center = box.getCenter(new THREE.Vector3());

            camera.near = size / 100;
            camera.far = size * 10;
            camera.updateProjectionMatrix();

            camera.position.copy(center);
            camera.position.z += size * 1.2;
            camera.lookAt(center);

            // Material
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x5e460b,
                        metalness: 1,
                        roughness: 0.3,
                        clearcoat: 1,
                        clearcoatRoughness: 0.1,
                        envMapIntensity: 2
                    });
                }
            });
        });

        /* ========= ANIMATION ========= */
        const animate = () => {
            requestAnimationFrame(animate);

            if (model) {
                model.rotation.y += 0.004;
            }

            renderer.render(scene, camera);
        };
        animate();

        /* ========= RESIZE ========= */
        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect();
            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        resizeObserver.observe(container);

        /* ========= CLEANUP ========= */
        return () => {
            resizeObserver.disconnect();
            renderer.dispose();
            container.innerHTML = '';
        };

    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        />
    );
}
