import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FloatingJewelryScene({ modelPath = "/ring-glb.glb", envPath = "/venice.hdr" }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const clockRef = useRef<THREE.Clock | null>(null);
    const jewelryRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        sceneRef.current = scene;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
        camera.position.set(0, 0.5, 2.5);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.2,
            0.4,
            0.0
        );
        composer.addPass(bloomPass);
        composerRef.current = composer;

        const pmremGen = new THREE.PMREMGenerator(renderer);

        const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 0.6);
        scene.add(hemi);

        const spot = new THREE.SpotLight(0xffffff, 3);
        spot.position.set(4, 6, 3);
        spot.castShadow = true;
        scene.add(spot);

        const fill = new THREE.DirectionalLight(0xffffff, 0.7);
        fill.position.set(-3, 2, 2);
        scene.add(fill);

        const group = new THREE.Group();
        scene.add(group);
        jewelryRef.current = group;

        const loader = new GLTFLoader();
        const rgbe = new RGBELoader();

        // Load HDR
        rgbe.load(envPath, (hdr) => {
            const envTex = pmremGen.fromEquirectangular(hdr).texture;
            scene.environment = envTex;
            hdr.dispose();
        });

        function makeDiamondMaterial() {
            return new THREE.MeshPhysicalMaterial({
                transmission: 1,
                ior: 2.42,
                thickness: 8,
                roughness: 0,
                metalness: 0,
                envMapIntensity: 4,
                clearcoat: 1,
                clearcoatRoughness: 0,
                sheen: 1,
                sheenColor: new THREE.Color(0xffffff),
                sheenRoughness: 0,
                iridescence: 1.3,
                iridescenceIOR: 0.9,
                iridescenceThicknessRange: [50, 400],
                side: THREE.DoubleSide,
            });
        }

        loader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            model.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z);
            model.scale.setScalar(1 / maxDim);

            model.traverse((child) => {
              if (child instanceof THREE.Mesh)  {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = makeDiamondMaterial();
              }
            });

            group.add(model);
          }
        );

        // loader.load(modelPath, (gltf) => {
        //     const base = gltf.scene;

        //     // --- CENTER & SCALE THE MODEL ---
        //     const box = new THREE.Box3().setFromObject(base);
        //     const size = box.getSize(new THREE.Vector3());
        //     const center = box.getCenter(new THREE.Vector3());

        //     base.position.sub(center);                   // move pivot to center
        //     const maxDim = Math.max(size.x, size.y, size.z);
        //     base.scale.setScalar(0.5 / maxDim);          // scale down properly


        //     // --- MATERIAL SETUP ---
        //     base.traverse((child) => {
        //         if (child instanceof THREE.Mesh) {
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //             child.material = makeDiamondMaterial();
        //         }
        //     });

        //     // --- CIRCLE LAYOUT ---
        //     const count = 8;
        //     const radius = 1.2;    // <<< MUCH BIGGER RADIUS

        //     for (let i = 0; i < count; i++) {
        //         const clone = base.clone(true);

        //         const angle = (i / count) * Math.PI * 2;

        //         clone.position.set(
        //             Math.cos(angle) * radius,
        //             0,
        //             Math.sin(angle) * radius
        //         );

        //         clone.lookAt(0, 0, 0); // make each diamond point inward

        //         group.add(clone);
        //     }
        // });

        // loader.load(modelPath, (gltf) => {
        //   const base = gltf.scene;

        //   // --- CENTER & SCALE THE MODEL ---
        //   const box = new THREE.Box3().setFromObject(base);
        //   const size = box.getSize(new THREE.Vector3());
        //   const center = box.getCenter(new THREE.Vector3());

        //   base.position.sub(center);
        //   const maxDim = Math.max(size.x, size.y, size.z);
        //   base.scale.setScalar(0.5 / maxDim);

        //   // --- DIAMOND MATERIAL ---
        //   base.traverse((child) => {
        //     if (child instanceof THREE.Mesh) {
        //       child.castShadow = true;
        //       child.receiveShadow = true;
        //       child.material = makeDiamondMaterial();
        //     }
        //   });

        //   // --- SPIRAL CAROUSEL LAYOUT ---
        //   const count = 36;        // total diamonds
        //   const radius = 1.8;      // how wide the spiral is
        //   const height = 1.6;      // how tall the spiral climbs
        //   const turns = 2;         // how many spiral rotations

        //   for (let i = 0; i < count; i++) {
        //     const clone = base.clone(true);

        //     const t = i / count;
        //     const angle = t * Math.PI * 2 * turns;

        //     clone.position.set(
        //       Math.cos(angle) * radius,
        //       t * height - height / 2, // centered vertically
        //       Math.sin(angle) * radius
        //     );

        //     // Diamonds rotate to face center AND tilt slightly upward
        //     clone.lookAt(0, 0.2, 0);

        //     group.add(clone);
        //   }
        // });




        clockRef.current = new THREE.Clock();

        const animate = () => {
            // const delta = clockRef.current!.getDelta();
            const time = performance.now() * 0.001;



            if (jewelryRef.current) {
                // Rotate entire spiral
                jewelryRef.current.rotation.y += 0.003;

                // Float whole spiral
                jewelryRef.current.position.y = Math.sin(time * 1.2) * 0.15;

                // Micro-floating for each diamond
                jewelryRef.current.children.forEach((d) => {
                    d.position.y += Math.sin(time * 4 + d.userData.offset) * 0.002;
                });
            }

            composer.render();
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (renderer) renderer.dispose();
            if (composer) composer.dispose();
        };
    }, [modelPath, envPath]);

    return (
        <div
            ref={containerRef}
            className="bg-red"
            style={{ width: "100%", height: "100vh", position: "sticky", top: 0 }}
        />
    );
}
