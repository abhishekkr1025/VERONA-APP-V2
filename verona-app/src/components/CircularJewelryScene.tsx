import  { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function CircularJewelryScene({ modelPath = "/ring-glb.glb", envPath = "/venice.hdr" }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const jewelryRef = useRef<THREE.Group | null>(null);

  // ---- 🖱 Interaction State ----
  const isDraggingRef = useRef(false);
  const previousMouseX = useRef(0);
  const rotationVelocity = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(0, 0.5, 2.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x000000, 0); // <--- **Sets clear color to transparent black**
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(width, height),
    //   0.6,  // Further reduced bloom intensity
    //   0.3,  // Reduced radius
    //   0.9   // Higher threshold
    // );
    // composer.addPass(bloomPass);
    composerRef.current = composer;

    const pmremGen = new THREE.PMREMGenerator(renderer);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    scene.add(hemi);

    const spot = new THREE.SpotLight(0xffffff, 3);  // Reduced intensity
    spot.position.set(4, 6, 3);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 512;  // Reduced from default 1024
    spot.shadow.mapSize.height = 512;
    scene.add(spot);

    const fill = new THREE.DirectionalLight(0xffffff, 0.6);  // Reduced intensity
    fill.position.set(-3, 2, 2);
    scene.add(fill);

    // Reduced key light intensity
    const keyLight = new THREE.SpotLight(0xffffff, 2);
    keyLight.position.set(0, 5, 5);
    scene.add(keyLight);

    const group = new THREE.Group();
    scene.add(group);
    jewelryRef.current = group;

    const loader = new GLTFLoader();
    const HDR = new HDRLoader();

    // Load HDR
    HDR.load(envPath, (hdr) => {
      const envTex = pmremGen.fromEquirectangular(hdr).texture;
      scene.environment = envTex;
      scene.backgroundBlurriness = 0.5;
      hdr.dispose();
      pmremGen.dispose();
    });

    // Optimized gold material
    function makeGoldMaterial() {
      return new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 1,
        roughness: 0.2,  // Slightly increased for performance
        envMapIntensity: 1.5,  // Reduced
        clearcoat: 0.3,  // Reduced
        clearcoatRoughness: 0.2,
      });
    }

    // Optimized diamond material
    // function makeDiamondMaterial() {
    //   return new THREE.MeshPhysicalMaterial({
    //     transmission: 0.9,  // Slightly reduced
    //     ior: 2.42,
    //     thickness: 0.4,  // Reduced
    //     roughness: 0.05,  // Slightly increased
    //     metalness: 0,
    //     envMapIntensity: 3,  // Reduced from 5
    //     clearcoat: 1,
    //     clearcoatRoughness: 0.1,
    //     sheen: 0.6,  // Reduced
    //     sheenColor: new THREE.Color(0xffffff),
    //     sheenRoughness: 0.2,
    //     iridescence: 0.5,  // Reduced
    //     iridescenceIOR: 1.3,
    //     iridescenceThicknessRange: [100, 300],  // Reduced range
    //     side: THREE.FrontSide,  // Changed from DoubleSide for performance
    //   });
    // }

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

        // Apply materials based on mesh name or position
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Optimize geometry
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }

            // Check if it's the diamond
            const isDiamond = child.name.toLowerCase().includes('diamond') ||
              child.name.toLowerCase().includes('stone') ||
              child.name.toLowerCase().includes('gem') ||
              child.position.y > 0.3;

            if (isDiamond) {
              // child.material = makeDiamondMaterial();
            } else {
              child.material = makeGoldMaterial();
            }
          }
        });

        group.add(model);
      }
    );

    clockRef.current = new THREE.Clock();

    // Use throttled rendering for better performance
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);

      const elapsed = currentTime - lastFrameTime;

      if (elapsed > frameInterval) {
        lastFrameTime = currentTime - (elapsed % frameInterval);

        if (jewelryRef.current) {
          jewelryRef.current.rotation.y += 0.03;
        }

        composer.render();
      }
    };

    animate(0);


    // ---- 🖱 Mouse Event Handlers ----
    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMouseX.current = event.clientX;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !jewelryRef.current) return;

      const deltaX = event.clientX - previousMouseX.current;
      previousMouseX.current = event.clientX;

      const rotationStrength = 0.005;
      jewelryRef.current.rotation.y += deltaX * rotationStrength;
      rotationVelocity.current = deltaX * rotationStrength; // continue motion after release
    };

    const stopDragging = () => {
      isDraggingRef.current = false;
    };


    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("mouseleave", stopDragging);


    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      composer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer) renderer.dispose();
      if (composer) composer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });
    };
  }, [modelPath, envPath]);

  return (
    <div
      ref={containerRef}
      style={{ 
        width: window.innerWidth < 768 ? "100%" : "50%", 
        height: window.innerWidth < 768 ? "50vh" : "100vh", 
        position: "fixed", 
        left: 0, 
        top: window.innerWidth < 768 ? "auto" : 0,
        bottom: window.innerWidth < 768 ? 0 : "auto",
        zIndex: 1, 
        background: "transparent" 
      }}
    />
  );
}