import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export default function MergedJewelryScene({ 
  mainModelPath = "/VERONA.glb",
  floatingModels = ["/2.glb", "/3.glb", "/4.glb", "/5.glb", "/6.glb", "/7.glb"],
  envPath = "/venice.hdr",
  floatingCount = 6
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mainJewelryRef = useRef<THREE.Group | null>(null);
  const floatingGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
    camera.position.set(0, 0.5, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composerRef.current = composer;

    const pmremGen = new THREE.PMREMGenerator(renderer);

    // ---- LIGHTING ----
    const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 0.6);
    scene.add(hemi);

    const spot = new THREE.SpotLight(0xffffff, 5);
    spot.position.set(4, 6, 3);
    spot.castShadow = true;
    spot.angle = Math.PI / 6;
    spot.penumbra = 0.3;
    scene.add(spot);

    const fill = new THREE.DirectionalLight(0xffffff, 1.2);
    fill.position.set(-3, 2, 2);
    scene.add(fill);

    const sparkleLight = new THREE.PointLight(0xffffff, 9, 20);
    sparkleLight.position.set(0, 2, 3);
    scene.add(sparkleLight);

    const rimLight1 = new THREE.PointLight(0x4af2ff, 2, 10);
    rimLight1.position.set(2, 1, -2);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xffa6f9, 1.5, 10);
    rimLight2.position.set(-2, 1, 2);
    scene.add(rimLight2);

    // ---- GROUPS ----
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainJewelryRef.current = mainGroup;

    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
    floatingGroupRef.current = floatingGroup;

    const loader = new GLTFLoader();
    const rgbe = new RGBELoader();

    // Load HDR Environment
    rgbe.load(envPath, (hdr) => {
      const envTex = pmremGen.fromEquirectangular(hdr).texture;
      scene.environment = envTex;
      hdr.dispose();
    });

    // ---- DIAMOND MATERIAL FUNCTION ----
    function makeDiamondMaterial() {
      return new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0,
        transmission: 1,
        ior: 2.45,
        thickness: 5,
        dispersion: 0.05,
        attenuationDistance: 0.1,
        attenuationColor: new THREE.Color("#000"),
        clearcoat: 1,
        clearcoatRoughness: 0,
        specularIntensity: 2.2,
        specularColor: new THREE.Color("#000"),
        iridescence: 1,
        iridescenceIOR: 2.0,
        iridescenceThicknessRange: [200, 1200],
        envMapIntensity: 15,
        color: new THREE.Color("white"),
        side: THREE.DoubleSide,
        transparent: true
      });
    }

    // ---- LOAD MAIN JEWELRY MODEL ----
    loader.load(mainModelPath, (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 0.94 / maxDim;

      model.scale.setScalar(scaleFactor);

      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      model.position.x -= center.x;
      model.position.y -= center.y;
      model.position.z -= center.z;
      model.position.y -= 0.05;

      model.rotation.x = Math.PI / 2;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = makeDiamondMaterial();
        }
      });

      mainGroup.add(model);
    });

    // ---- LOAD FLOATING DIAMONDS ----
    for (let i = 0; i < floatingCount; i++) {
      const randomModel = floatingModels[Math.floor(Math.random() * floatingModels.length)];

      loader.load(randomModel, (gltf) => {
        const model = gltf.scene.clone();

        const scale = THREE.MathUtils.randFloat(0.15, 0.4);
        model.scale.setScalar(scale);

        model.position.set(
          THREE.MathUtils.randFloatSpread(6),
          THREE.MathUtils.randFloatSpread(4),
          THREE.MathUtils.randFloatSpread(3)
        );

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = makeDiamondMaterial();
          }
        });

        (model as any).velocity = new THREE.Vector3(
          THREE.MathUtils.randFloat(-0.002, 0.002),
          THREE.MathUtils.randFloat(-0.002, 0.002),
          THREE.MathUtils.randFloat(-0.002, 0.002)
        );

        floatingGroup.add(model);
      });
    }

    // ---- ANIMATION LOOP ----
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate floating diamonds
      floatingGroup.children.forEach((diamond) => {
        diamond.rotation.y += 0.01;
        diamond.rotation.x += 0.003;

        diamond.position.add((diamond as any).velocity);

        // Bounce off boundaries
        if (diamond.position.x > 3 || diamond.position.x < -3)
          (diamond as any).velocity.x *= -1;
        if (diamond.position.y > 2.2 || diamond.position.y < -2.2)
          (diamond as any).velocity.y *= -1;
      });

      composer.render();
    };

    animate();

    // ---- CLEANUP ----
    return () => {
      if (renderer) renderer.dispose();
      if (composer) composer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mainModelPath, floatingModels, envPath, floatingCount]);

  return (
    <div
      ref={containerRef}
      style={{ 
        width: "100%", 
        height: "100vh", 
        position: "sticky", 
        top: 0, 
        background: "transparent" 
      }}
    />
  );
}