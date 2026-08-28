import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useThree, useFrame, ThreeElement } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';
import { createProfileCardTexture, createLanyardBandTexture } from '../lib/cardTextures';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);

interface HangingTagCardProps {
  profile: ProfileSettings;
  onOpenHireModal?: () => void;
  isReady?: boolean;
}

interface BandProps {
  profile: ProfileSettings;
  textureMode: 'custom' | 'original';
  maxSpeed?: number;
  minSpeed?: number;
}

// Width callback to smoothly taper the bottom 4% of ribbon to fit inside metal collar without corner protrusion
const widthCallback = (p: number) => {
  if (p < 0.04) {
    return 0.32 + (p / 0.04) * 0.68;
  }
  return 1.0;
};

function Band({ profile, textureMode, maxSpeed = 50, minSpeed = 10 }: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const clampTop = useMemo(() => new THREE.Vector3(), []);

  const segmentProps = useMemo(() => ({
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }), []);

  const { nodes, materials } = useGLTF(GLTF_PATH) as any;
  const originalTexture = useTexture(TEXTURE_PATH);
  originalTexture.wrapS = originalTexture.wrapT = THREE.RepeatWrapping;

  const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (profile.avatarUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.src = profile.avatarUrl;
      img.onload = () => setProfileImage(img);
    }
  }, [profile.avatarUrl]);

  const customCardTexture = useMemo(() => {
    return createProfileCardTexture(profile, profileImage);
  }, [profile, profileImage]);

  const customBandTexture = useMemo(() => {
    return createLanyardBandTexture('JUPRI EKA PRATAMA • ');
  }, []);

  const activeCardTexture = textureMode === 'custom' ? customCardTexture : materials.base.map;
  const activeBandTexture = textureMode === 'custom' ? customBandTexture : originalTexture;

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
  );

  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  // Extended rope joint lengths (2.3) so the lanyard strap is long, elegant, and readable
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 2.3]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 2.3]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 2.3]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });

      // Synchronize ribbon endpoint precisely with top collar entrance of clamp
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      quat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
      clampTop.set(0, 1.57, 0).applyQuaternion(quat);

      curve.points[0].set(
        cardPos.x + clampTop.x,
        cardPos.y + clampTop.y,
        cardPos.z + clampTop.z,
      );
      curve.points[1].copy(j2.current.lerped || j2.current.translation());
      curve.points[2].copy(j1.current.lerped || j1.current.translation());
      curve.points[3].copy(fixed.current.translation());

      if (band.current && band.current.geometry) {
        band.current.geometry.setPoints(curve.getPoints(32), widthCallback);
      }

      if (!dragged) {
        try {
          ang.copy(card.current.angvel());
          const cRot = card.current.rotation();
          rot.set(cRot.x, cRot.y, cRot.z);
          card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
        } catch {
          // ignore
        }
      }
    }
  });

  curve.curveType = 'chordal';

  const handleFlip = () => {
    if (card.current && !dragged) {
      try {
        card.current.wakeUp();
        card.current.applyTorqueImpulse({ x: 0, y: 2.2, z: 0 }, true);
        soundFx.playCardFlip();
      } catch {
        // ignore
      }
    }
  };

  return (
    <>
      {/* Anchor fixed at ceiling height (Y = 8.5) */}
      <group position={[0, 8.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -2.3, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -4.6, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -6.9, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -8.35, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => {
              hover(true);
              soundFx.playHover();
            }}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              try {
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {
                // ignore
              }
              drag(false);
              soundFx.playClick();
            }}
            onPointerDown={(e) => {
              try {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
              } catch {
                // ignore
              }
              soundFx.playClick();
              if (card.current) {
                const trans = card.current.translation();
                drag(new THREE.Vector3().copy(e.point).sub(vec.set(trans.x, trans.y, trans.z)));
              }
            }}
            onDoubleClick={handleFlip}
          >
            <mesh geometry={nodes.card.geometry} renderOrder={5}>
              <meshPhysicalMaterial
                map={activeCardTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
              renderOrder={10}
            />
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
              renderOrder={10}
            />
          </group>
        </RigidBody>
      </group>

      {/* Ribbon MeshLine */}
      <mesh ref={band} renderOrder={1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap={1 as any}
          map={activeBandTexture}
          repeat={[2.2, 1]}
          lineWidth={0.92}
        />
      </mesh>
    </>
  );
}

export function HangingTagCard({ profile, isReady = true }: HangingTagCardProps) {
  return (
    <div className="relative w-full flex flex-col items-center select-none overflow-visible pt-0 pb-0">
      {/* Ceiling Spotlight Ambient Beam */}
      <div
        className="absolute -top-72 w-[480px] sm:w-[640px] lg:w-[860px] h-[1100px] left-1/2 -translate-x-1/2 pointer-events-none z-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.24) 0%, rgba(34, 197, 94, 0.12) 45%, rgba(0,0,0,0) 70%)',
          clipPath: 'polygon(46% 0%, 54% 0%, 98% 100%, 2% 100%)',
        }}
      />

      {/* 3D Canvas with extra vertical height for longer visible lanyard */}
      <div className="relative w-full max-w-[580px] sm:max-w-[660px] lg:max-w-[760px] h-[920px] sm:h-[1020px] lg:h-[1100px] flex justify-center items-center overflow-visible -mt-26 sm:-mt-30 lg:-mt-34">
        {isReady && (
          <Canvas
            camera={{ position: [0, -0.2, 14.5], fov: 28 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={Math.PI} />
              <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                <Band profile={profile} textureMode="custom" />
              </Physics>
              <Environment blur={0.75}>
                <Lightformer
                  intensity={2}
                  color="white"
                  position={[0, -1, 5]}
                  rotation={[0, 0, Math.PI / 3]}
                  scale={[100, 0.1, 1]}
                />
                <Lightformer
                  intensity={3}
                  color="white"
                  position={[-1, -1, 1]}
                  rotation={[0, 0, Math.PI / 3]}
                  scale={[100, 0.1, 1]}
                />
                <Lightformer
                  intensity={3}
                  color="white"
                  position={[1, 1, 1]}
                  rotation={[0, 0, Math.PI / 3]}
                  scale={[100, 0.1, 1]}
                />
                <Lightformer
                  intensity={10}
                  color="white"
                  position={[-10, 0, 14]}
                  rotation={[0, Math.PI / 2, Math.PI / 3]}
                  scale={[100, 10, 1]}
                />
              </Environment>
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
}
