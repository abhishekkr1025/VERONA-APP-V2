import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

type JewelrySceneProps = {
  modelPath?: string;
  sloganPath?: string;
  floatingModels?: string[];
  envPath?: string;
  floatingCount?: number;
};

export default function JewelryScene({
  modelPath = "/VERONA.glb",
  sloganPath = "/SLOGAN.glb",
  floatingModels = [
    "/2.glb",
    "/3.glb",
    "/4.glb",
    "/5.glb",
    "/6.glb",
    "/7.glb",
    "/8.glb",
    "/9.glb",
    "/10.glb",
    "/11.glb",
    "/12.glb",
    "/13.glb",
    "/14.glb",
    "/15.glb",
    "/16.glb",
    "/17.glb",
    "/18.glb",
  ],
  envPath = "/venice.hdr",
  floatingCount = 11,
}: JewelrySceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const mainGroupRef = useRef<THREE.Group | null>(null);
  const floatingGroupRef = useRef<THREE.Group | null>(null);

  const envMapRef = useRef<THREE.Texture | null>(null);
  const diamondMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const animationIdRef = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Touch interaction refs - only for floating diamonds
  const touchStartRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();
    window.addEventListener("resize", checkMobile);

    const container = containerRef.current;
    if (!container) return;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Adjust FOV for mobile (wider FOV to see more on small screens)
    const fov = mobile ? 60 : 50;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 500);
    
    // Adjust camera position for mobile (pull back a bit)
    const cameraZ = mobile ? 3.2 : 2.5;
    const cameraY = mobile ? 0.3 : 0.5;
    camera.position.set(0, cameraY, cameraZ);
    cameraRef.current = camera;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    renderer.setSize(width, height);
    const pixelRatio = mobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = mobile ? 1.0 : 1.1;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !mobile;
    if (!mobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- LIGHTS ---
    const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, mobile ? 0.5 : 0.6);
    scene.add(hemi);

    if (!mobile) {
      const spot = new THREE.SpotLight(0xffffff, 4);
      spot.position.set(4, 6, 3);
      spot.castShadow = true;
      spot.angle = Math.PI / 6;
      spot.penumbra = 0.3;
      scene.add(spot);
    }

    const fill = new THREE.DirectionalLight(0xffffff, mobile ? 1.0 : 1.1);
    fill.position.set(-3, 2, 2);
    scene.add(fill);

    const rimLight1 = new THREE.PointLight(0x4af2ff, mobile ? 1.4 : 1.8, 10);
    rimLight1.position.set(2, 1, -2);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xffa6f9, mobile ? 1.2 : 1.4, 10);
    rimLight2.position.set(-2, 1, 2);
    scene.add(rimLight2);

    // --- GROUPS ---
    // Main group for VERONA and SLOGAN (static, no rotation)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Floating group for diamonds (interactive rotation)
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
    floatingGroupRef.current = floatingGroup;

    // --- LOADERS & ENV MAP ---
    const loader = new GLTFLoader();
    const rgbeLoader = new HDRLoader();
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    rgbeLoader.load(
      envPath,
      (hdr) => {
        const envMap = pmremGen.fromEquirectangular(hdr).texture;
        hdr.dispose();
        scene.environment = envMap;
        envMapRef.current = envMap;

        const diamondMat = new THREE.MeshPhysicalMaterial({
          metalness: 0,
          roughness: 0,
          transmission: 1,
          ior: 2.45,
          thickness: 2,
          dispersion: mobile ? 0.03 : 0.05,
          attenuationDistance: 0.6,
          attenuationColor: new THREE.Color("#000000"),
          clearcoat: 1,
          clearcoatRoughness: 0,
          specularIntensity: mobile ? 1.8 : 2.2,
          specularColor: new THREE.Color("#000000"),
          iridescence: mobile ? 0.8 : 1,
          iridescenceIOR: 2.0,
          iridescenceThicknessRange: [200, 1200],
          envMap,
          envMapIntensity: mobile ? 3.5 : 4.5,
          color: new THREE.Color("white"),
          side: THREE.DoubleSide,
          transparent: true,
        });
        diamondMaterialRef.current = diamondMat;

        const applyDiamondMaterial = (root: THREE.Object3D, withShadows: boolean) => {
          root.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = diamondMat;
              child.castShadow = withShadows && !mobile;
              child.receiveShadow = withShadows && !mobile;
              child.frustumCulled = true;
            }
          });
        };

        // --- LOAD SLOGAN MODEL (STATIC) ---
        loader.load(
          sloganPath,
          (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, 0);
            model.rotation.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scaleFactor = (mobile ? 0.85 : 0.94) / maxDim;
            model.scale.setScalar(scaleFactor);

            box.setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            model.position.x -= center.x;
            model.position.y -= center.y + 0.05;
            model.position.z -= center.z;

            model.rotation.x = Math.PI / 2;

            applyDiamondMaterial(model, true);
            mainGroup.add(model);
          },
          undefined,
          (err) => console.error("Error loading slogan model", err)
        );

        // --- LOAD MAIN JEWELRY MODEL (STATIC) ---
        loader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, 0);
            model.rotation.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scaleFactor = (mobile ? 0.85 : 0.94) / maxDim;
            model.scale.setScalar(scaleFactor);

            box.setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            model.position.x -= center.x;
            model.position.y -= center.y + 0.05;
            model.position.z -= center.z;

            model.rotation.x = Math.PI / 2;

            applyDiamondMaterial(model, true);
            mainGroup.add(model);
          },
          undefined,
          (err) => console.error("Error loading main model", err)
        );

        // --- LOAD FLOATING DIAMONDS (INTERACTIVE) ---
        const count = Math.min(mobile ? Math.floor(floatingCount * 0.6) : floatingCount, floatingModels.length);

        for (let i = 0; i < count; i++) {
          const randomModel =
            floatingModels[Math.floor(Math.random() * floatingModels.length)];

          loader.load(
            randomModel,
            (gltf) => {
              const model = gltf.scene;

              const box = new THREE.Box3().setFromObject(model);
              const size = box.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z) || 1;
              const targetSize = THREE.MathUtils.randFloat(
                mobile ? 0.06 : 0.08,
                mobile ? 0.12 : 0.16
              );
              const scaleFactor = targetSize / maxDim;
              model.scale.setScalar(scaleFactor);

              const angle = (i / count) * Math.PI * 2;
              const radius = mobile ? 1.2 : 1.4 + Math.random() * 0.3;

              const baseY = THREE.MathUtils.randFloat(-0.2, 0.7);
              const baseZ = Math.sin(angle) * radius * 0.5;

              model.position.set(
                Math.cos(angle) * radius,
                baseY,
                baseZ
              );

              (model as any)._floatBaseY = baseY;
              (model as any)._floatSpeed = THREE.MathUtils.randFloat(0.5, 1.1);
              (model as any)._floatAmp = THREE.MathUtils.randFloat(0.04, 0.09);
              (model as any)._rotSpeedX = THREE.MathUtils.randFloat(0.2, 0.5);
              (model as any)._rotSpeedY = THREE.MathUtils.randFloat(0.3, 0.6);
              (model as any)._phase = Math.random() * Math.PI * 2;

              applyDiamondMaterial(model, false);
              floatingGroup.add(model);
            },
            undefined,
            (err) => console.error("Error loading floating model", err)
          );
        }
      },
      undefined,
      (err) => console.error("Error loading HDR env", err)
    );

    // --- TOUCH INTERACTION (Only affects floating diamonds) ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

  const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && floatingGroupRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const deltaX = e.touches[0].clientX - touchStartRef.current.x;
        const deltaY = e.touches[0].clientY - touchStartRef.current.y;

        targetRotationRef.current.y = rotationRef.current.y + deltaX * 0.01;
        targetRotationRef.current.x = rotationRef.current.x + deltaY * 0.01;
        
        targetRotationRef.current.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationRef.current.x));
      }
    };

    const handleTouchEnd = () => {
      rotationRef.current = { ...targetRotationRef.current };
    };

    // Mouse interaction for desktop (only affects floating diamonds)
    let isDragging = false;
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      touchStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && floatingGroupRef.current) {
        const deltaX = e.clientX - touchStartRef.current.x;
        const deltaY = e.clientY - touchStartRef.current.y;

        targetRotationRef.current.y = rotationRef.current.y + deltaX * 0.01;
        targetRotationRef.current.x = rotationRef.current.x + deltaY * 0.01;
        
        targetRotationRef.current.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationRef.current.x));
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      rotationRef.current = { ...targetRotationRef.current };
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    // --- ANIMATION LOOP ---
    const animate = () => {
      const delta = clockRef.current.getDelta();
      const elapsed = clockRef.current.elapsedTime;

      // Smooth rotation interpolation for floating group only
      if (floatingGroupRef.current) {
        floatingGroupRef.current.rotation.y += (targetRotationRef.current.y - floatingGroupRef.current.rotation.y) * 0.1;
        floatingGroupRef.current.rotation.x += (targetRotationRef.current.x - floatingGroupRef.current.rotation.x) * 0.1;
      }

      // Animate floating diamonds
      const fg = floatingGroupRef.current;
      if (fg) {
        for (let i = 0; i < fg.children.length; i++) {
          const child = fg.children[i] as any;
          if (child._floatBaseY !== undefined) {
            const t = elapsed * child._floatSpeed + child._phase;
            child.position.y = child._floatBaseY + Math.sin(t) * child._floatAmp;
            child.rotation.x += child._rotSpeedX * delta;
            child.rotation.y += child._rotSpeedY * delta;
          }
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const newMobile = w < 768;

      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      
      cameraRef.current.fov = newMobile ? 60 : 50;
      cameraRef.current.updateProjectionMatrix();
      
      checkMobile();
    };

    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", checkMobile);

      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);

      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) {
            if (mesh.geometry) mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }

      if (diamondMaterialRef.current) {
        diamondMaterialRef.current.dispose();
      }

      if (envMapRef.current) {
        envMapRef.current.dispose();
      }

      pmremGen.dispose();

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(
            rendererRef.current.domElement
          );
        }
      }

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [modelPath, sloganPath, envPath, floatingModels, floatingCount]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "transparent",
        overflow: "hidden",
        touchAction: "none",
        cursor: "grab",
      }}
    />
  );
}