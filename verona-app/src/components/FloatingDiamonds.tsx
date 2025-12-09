import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default function FloatingDiamonds({
  models = ["/2.glb", "/3.glb", "/4.glb", "/5.glb"],
  envPath = "/venice.hdr",
  count = 12
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // ---- POST PROCESSING ----
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // composer.addPass(
    //   new UnrealBloomPass(new THREE.Vector2(width, height), 1.4, 0.3, 0.7)
    // );

    // ---- LIGHTING ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const sparkleLight = new THREE.PointLight(0xffffff, 9, 20);
    sparkleLight.position.set(0, 2, 3);
    scene.add(sparkleLight);

    // HDR ENV MAP
    const pmrem = new THREE.PMREMGenerator(renderer);
    new RGBELoader().load(envPath, (hdr) => {
      scene.environment = pmrem.fromEquirectangular(hdr).texture;
      hdr.dispose();
    });

    const loader = new GLTFLoader();
    const group = new THREE.Group();
    scene.add(group);

    // ---- MATERIAL ----
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      ior: 2.45,
      roughness: 0,
      thickness: 6,
      dispersion: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 15,
      specularIntensity: 2,
      side: THREE.DoubleSide
    });

    // ---- SPAWN MULTIPLE DIAMONDS ----
    for (let i = 0; i < count; i++) {
      const randomModel = models[Math.floor(Math.random() * models.length)];

      loader.load(randomModel, (gltf) => {
        const model = gltf.scene.clone();

        const scale = THREE.MathUtils.randFloat(0.2, 0.55);
        model.scale.setScalar(scale);

        model.position.set(
          THREE.MathUtils.randFloatSpread(6),
          THREE.MathUtils.randFloatSpread(4),
          THREE.MathUtils.randFloatSpread(3)
        );

        // model.traverse((child) => {
        //   if (child instanceof THREE.Mesh) child.material = diamondMaterial;
        // });

        

        (model as any).velocity = new THREE.Vector3(
          THREE.MathUtils.randFloat(-0.002, 0.002),
          THREE.MathUtils.randFloat(-0.002, 0.002),
          THREE.MathUtils.randFloat(-0.002, 0.002)
        );

        group.add(model);
      });
    }

    // ---- ANIMATION LOOP ----
    const animate = () => {
      requestAnimationFrame(animate);

      // Move & rotate every diamond
      group.children.forEach((diamond) => {
        diamond.rotation.y += 0.01;
        diamond.rotation.x += 0.003;

        diamond.position.add((diamond as any).velocity);

        // Screen bounds bounce
        if (diamond.position.x > 3 || diamond.position.x < -3)
          (diamond as any).velocity.x *= -1;
        if (diamond.position.y > 2.2 || diamond.position.y < -2.2)
          (diamond as any).velocity.y *= -1;
      });

      composer.render();
    };

    animate();

    return () => {
      renderer.dispose();
      composer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [models, envPath, count]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", background: "transparent" }}
    />
  );
}
