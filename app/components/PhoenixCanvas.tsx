import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Types ───────────────────────────────────────────────────
export interface PhoenixViewerHandle {
  playAnimation: (name: string) => void;
  pauseAnimation: () => void;
  setTimeScale: (scale: number) => void;
  getAnimationNames: () => string[];
  getClipDuration: () => number;
  setProgress: (pct: number) => void;
}

interface PhoenixModelProps {
  onReady?: (names: string[]) => void;
  handle: React.MutableRefObject<PhoenixViewerHandle | null>;
  staticPose: boolean;
  speed: number;
  isPlaying: boolean;
  currentClip: string;
}

function PhoenixModel({
  onReady,
  handle,
  staticPose,
  speed,
  isPlaying,
  currentClip,
}: PhoenixModelProps) {
  const outerGroup = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF("/phoenix_bird/scene.gltf");
  const { actions, mixer } = useAnimations(animations, scene);
  const currentAction = useRef<THREE.AnimationAction | null>(null);

  // Scale-up, center the model, and fix materials
  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4.5 / maxDim;
    
    if (outerGroup.current) {
      outerGroup.current.scale.setScalar(scale);
      outerGroup.current.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );
    }

    // Material fixes
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
          
        mats.forEach((mat) => {
          // Transparency depth sorting fix:
          // Fixes the "head flipping to tail" Z-order glitch by forcing depth writing
          // and alpha clipping for overlapping transparent geometry (like feathers).
          if (mat.transparent) {
            mat.depthWrite = true;
            mat.alphaTest = 0.1;
          }
          
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.emissiveIntensity = 2.5;
          }
          mat.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  // Notify parent of available clips
  useEffect(() => {
    const names = Object.keys(actions);
    if (onReady) onReady(names);
  }, [actions, onReady]);

  // Play / pause / switch animation
  useEffect(() => {
    // Stop current
    if (currentAction.current) {
      currentAction.current.fadeOut(0.3);
    }

    if (staticPose) {
      mixer.stopAllAction();
      currentAction.current = null;
      return;
    }

    // Pick action: try exact match, else first available
    const actionKeys = Object.keys(actions);
    let action = actions[currentClip];
    if (!action && actionKeys.length > 0) {
      action = actions[actionKeys[0]];
    }

    if (action) {
      action.reset().fadeIn(0.3).play();
      action.paused = !isPlaying;
      action.timeScale = speed;
      currentAction.current = action;
    }
  }, [staticPose, currentClip, actions, mixer, isPlaying, speed]);

  // Sync playing state and speed dynamically
  useEffect(() => {
    if (currentAction.current) {
      currentAction.current.paused = !isPlaying || staticPose;
      currentAction.current.timeScale = speed;
    }
  }, [isPlaying, speed, staticPose]);

  // Expose imperative handle
  useImperativeHandle(
    handle,
    () => ({
      playAnimation: (name: string) => {
        const a = actions[name];
        if (a) {
          currentAction.current?.fadeOut(0.3);
          a.reset().fadeIn(0.3).play();
          currentAction.current = a;
        }
      },
      pauseAnimation: () => {
        if (currentAction.current) currentAction.current.paused = true;
      },
      setTimeScale: (scale: number) => {
        if (currentAction.current) currentAction.current.timeScale = scale;
      },
      getAnimationNames: () => Object.keys(actions),
      getClipDuration: () => currentAction.current?.getClip().duration ?? 0,
      setProgress: (pct: number) => {
        if (currentAction.current) {
          const dur = currentAction.current.getClip().duration;
          currentAction.current.time = (pct / 100) * dur;
        }
      },
    }),
    [actions],
  );

  // Gentle idle rotation when no animation playing
  useFrame((_, delta) => {
    if (staticPose && outerGroup.current) {
      outerGroup.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={outerGroup}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Scene Lighting ──────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#1a3a5c" />
      {/* Key light — warm orange from below (fire) */}
      <pointLight
        position={[0, -3, 2]}
        intensity={80}
        color="#ff6d00"
        distance={20}
        decay={2}
      />
      {/* Fill light — cool cyan from above */}
      <pointLight
        position={[3, 4, -2]}
        intensity={60}
        color="#00e5ff"
        distance={25}
        decay={2}
      />
      {/* Rim light — deep blue from behind */}
      <directionalLight
        position={[-4, 2, -6]}
        intensity={1.5}
        color="#0066ff"
      />
      {/* Top key */}
      <directionalLight position={[0, 8, 4]} intensity={2} color="#ffffff" />
      {/* Holographic accent */}
      <pointLight
        position={[-3, 1, 3]}
        intensity={30}
        color="#9900ff"
        distance={15}
        decay={2}
      />
    </>
  );
}

// ─── Camera Setup ────────────────────────────────────────────
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─── Main Exported Canvas Wrapper ────────────────────────────
interface PhoenixCanvasProps {
  onReady?: (names: string[]) => void;
  viewerRef: React.MutableRefObject<PhoenixViewerHandle | null>;
  staticPose: boolean;
  speed: number;
  isPlaying: boolean;
  currentClip: string;
}

export function PhoenixCanvas({
  onReady,
  viewerRef,
  staticPose,
  speed,
  isPlaying,
  currentClip,
}: PhoenixCanvasProps) {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      shadows
      dpr={[1, 2]}
    >
      <CameraSetup />
      <SceneLighting />
      <PhoenixModel
        handle={viewerRef}
        onReady={onReady}
        staticPose={staticPose}
        speed={speed}
        isPlaying={isPlaying}
        currentClip={currentClip}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI * 0.75}
        autoRotate={staticPose}
        autoRotateSpeed={1.2}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

// Pre-load the GLTF
useGLTF.preload("/phoenix_bird/scene.gltf");
