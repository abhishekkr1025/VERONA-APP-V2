import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SpreadingJewelryScene({ modelPath = "/diamond-glb.glb", envPath = "/venice.hdr" }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const jewelryRef = useRef<THREE.Group | null>(null);
  const diamondsRef = useRef<Array<{ clone: THREE.Object3D, finalPos: THREE.Vector3, finalRot: THREE.Euler }>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(width, height),
    //   0.5,  // Reduced bloom strength
    //   0.3,  // Reduced radius
    //   0.3   // Higher threshold
    // );

    // composer.addPass(bloomPass);
    composerRef.current = composer;

    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 1.2);
    scene.add(hemi);

    const mainSpot = new THREE.SpotLight(0xffffff, 6);
    mainSpot.position.set(5, 8, 4);
    mainSpot.angle = Math.PI / 6;
    mainSpot.penumbra = 0.3;
    mainSpot.decay = 2;
    mainSpot.distance = 50;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    const spot2 = new THREE.SpotLight(0xadd8e6, 4);
    spot2.position.set(-5, 6, 3);
    spot2.angle = Math.PI / 5;
    spot2.penumbra = 0.4;
    scene.add(spot2);

    const spot3 = new THREE.SpotLight(0xffd700, 3);
    spot3.position.set(0, -4, 5);
    spot3.angle = Math.PI / 4;
    scene.add(spot3);

    const rimLight = new THREE.DirectionalLight(0x64b5f6, 2);
    rimLight.position.set(-8, 3, -3);
    scene.add(rimLight);

    const fill = new THREE.DirectionalLight(0xffffff, 1.5);
    fill.position.set(4, -2, -4);
    scene.add(fill);

    const pointLight1 = new THREE.PointLight(0xffffff, 3, 15);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x88ccff, 2, 12);
    pointLight2.position.set(-3, 2, -2);
    scene.add(pointLight2);

    const group = new THREE.Group();
    scene.add(group);
    jewelryRef.current = group;

    const loader = new GLTFLoader();
    const rgbe = new RGBELoader();

    rgbe.load(envPath, (hdr) => {
      const envTex = pmremGen.fromEquirectangular(hdr).texture;
      scene.environment = envTex;
      scene.backgroundBlurriness = 0.8;
      hdr.dispose();
      pmremGen.dispose();
    });

    function makeDiamondMaterial() {
      return new THREE.MeshPhysicalMaterial({
        transmission: 0.9,
        ior: 2.417,
        thickness: 1.5,  // Reduced
        roughness: 0.05,  // Slightly increased
        metalness: 0,
        envMapIntensity: 4,  // Reduced from 8
        clearcoat: 1,
        clearcoatRoughness: 0.1,  // Slightly increased
        sheen: 1,  // Reduced
        sheenColor: new THREE.Color(0xffffff),
        sheenRoughness: 0.2,  // Increased
        iridescence: 0.8,  // Reduced
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 400],  // Reduced range
        specularIntensity: 0.8,  // Reduced
        specularColor: new THREE.Color(0xffffff),
        attenuationDistance: 0.5,
        attenuationColor: new THREE.Color(0xffffff),
        side: THREE.FrontSide,  // Changed from DoubleSide
        transparent: true,
        opacity: 0.98,
      });
    }

    // Function to animate spreading
    function animateSpread() {
      diamondsRef.current.forEach(({ clone, finalPos, finalRot }, i) => {
        const duration = 1.2 + Math.random() * 0.8;
        const delay = i * 0.025;

        // Reset to center
        clone.position.set(0, 0, 2);
        clone.rotation.set(0, 0, 0);
        clone.scale.set(0.05, 0.05, 0.05);

        // Animate to spread position
        gsap.to(clone.position, {
          x: finalPos.x,
          y: finalPos.y,
          z: finalPos.z,
          duration,
          delay,
          ease: "power3.out",
        });

        gsap.to(clone.rotation, {
          x: finalRot.x,
          y: finalRot.y,
          z: finalRot.z,
          duration,
          delay,
          ease: "power2.out",
        });

        gsap.to(clone.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          delay,
          ease: "back.out(2)",
        });
      });

      // Calculate total animation time and add 1 second delay
      const totalDuration = 1.2 + 0.8 + (diamondsRef.current.length * 0.025) + 1;

      // Schedule next animation
      setTimeout(() => {
        animateSpread();
      }, totalDuration * 1000);
    }

    loader.load(modelPath, (gltf) => {
      const base = gltf.scene;

      const box = new THREE.Box3().setFromObject(base);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      base.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      base.scale.setScalar(0.05 / maxDim);

      base.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }

          child.material = makeDiamondMaterial();
        }
      });

      const count = 12;
      const spreadRadius = 20;

      for (let i = 0; i < count; i++) {
        const clone = base.clone(true);

        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 0.5 + Math.random() * spreadRadius;

        const finalX = Math.cos(angle) * distance;
        const finalY = (Math.random() - 0.5) * 3;
        const finalZ = Math.sin(angle) * distance - 2 + Math.random() * 4;

        const finalRotX = Math.random() * Math.PI * 2;
        const finalRotY = Math.random() * Math.PI * 2;
        const finalRotZ = Math.random() * Math.PI * 2;

        // Store final positions and rotations
        diamondsRef.current.push({
          clone,
          finalPos: new THREE.Vector3(finalX, finalY, finalZ),
          finalRot: new THREE.Euler(finalRotX, finalRotY, finalRotZ)
        });

        group.add(clone);
      }

      // Start the repeating animation
      animateSpread();
    });

    clockRef.current = new THREE.Clock();

    const animate = () => {
      const delta = clockRef.current!.getDelta();
      const time = clockRef.current!.getElapsedTime();

      if (pointLight1) {
        pointLight1.position.x = Math.sin(time * 0.7) * 4;
        pointLight1.position.z = Math.cos(time * 0.7) * 4;
      }

      if (pointLight2) {
        pointLight2.position.x = Math.cos(time * 0.5) * 3;
        pointLight2.position.z = Math.sin(time * 0.5) * 3;
      }

      if (jewelryRef.current && time > 2) {
        jewelryRef.current.children.forEach((diamond, i) => {
          const floatSpeed = 1.2 + (i % 4) * 0.2;
          const floatAmount = 0.05;

          diamond.position.y += Math.sin(time * floatSpeed + i) * floatAmount * delta;
          diamond.position.z += Math.cos(time * floatSpeed * 0.5 + i) * floatAmount * delta * 0.5;

          diamond.rotation.y += 0.003 * delta;
          diamond.rotation.x += 0.003 * delta;
        });
      }

      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

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
    };
  }, [modelPath, envPath]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", position: "sticky", top: 0, background:"transparent" }}
    />
  );
}