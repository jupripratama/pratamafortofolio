import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';
import { createProfileCardTexture, createLanyardBandTexture } from '../lib/cardTextures';
import { createLanyardGeometry, createLanyardUpdater, STRAP_WIDTH } from '../lib/lanyardGeometry';

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';
const ROPE_SEGMENT_LENGTH = 2.45;
const MODEL_SCALE = 2.25;
const MODEL_OFFSET: [number, number, number] = [0, -1.2, -0.05];

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
}

function Band({ profile, textureMode }: BandProps) {
  const cardModel = useRef<THREE.Group>(null);
  const anchorVisual = useRef<THREE.Group>(null);
  const guideVisual = useRef<THREE.Group>(null);
  const middleVisual = useRef<THREE.Group>(null);
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
  const guide = useMemo(() => new THREE.Vector3(), []);
  const middle = useMemo(() => new THREE.Vector3(), []);
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const strapGeometry = useMemo(createLanyardGeometry, []);
  const updateStrap = useMemo(() => createLanyardUpdater(strapGeometry), [strapGeometry]);
  useEffect(() => () => strapGeometry.dispose(), [strapGeometry]);

  const segmentProps = useMemo(() => ({
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }), []);

  const { nodes, materials } = useGLTF(GLTF_PATH) as any;
  const attachment = useMemo(() => {
    const geometry = nodes.clip.geometry as THREE.BufferGeometry;
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox!;
    const local = new THREE.Vector3((bounds.min.x + bounds.max.x) / 2, bounds.max.y - 0.002, -0.012);
    const joint = local.clone().multiplyScalar(MODEL_SCALE).add(new THREE.Vector3(...MODEL_OFFSET));
    return { local, joint: joint.toArray() as [number, number, number] };
  }, [nodes]);
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
    return createLanyardBandTexture('JUPRI EKA PRATAMA');
  }, []);

  const activeCardTexture = textureMode === 'custom' ? customCardTexture : materials.base.map;
  const activeBandTexture = textureMode === 'custom' ? customBandTexture : originalTexture;

  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useSphericalJoint(j3, card, [[0, 0, 0], attachment.joint]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state) => {
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

    if (card.current) {
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

  // Physics runs first (-2); draw the ribbon from the SAME interpolated visual
  // transforms as the metal. Raw rigid-body poses lead the rendered card by a tick.
  useFrame(() => {
    if (!cardModel.current || !anchorVisual.current || !guideVisual.current || !middleVisual.current) return;
    cardModel.current.updateWorldMatrix(true, false);
    clampTop.copy(attachment.local);
    cardModel.current.localToWorld(clampTop);
    cardModel.current.getWorldQuaternion(quat);
    guideVisual.current.getWorldPosition(guide);
    middleVisual.current.getWorldPosition(middle);
    anchorVisual.current.getWorldPosition(anchor);
    updateStrap(clampTop, quat, middle, guide, anchor);
  }, -1);

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
        <RigidBody ref={fixed} {...segmentProps} type="fixed"><group ref={anchorVisual} /></RigidBody>
        <RigidBody position={[0, -ROPE_SEGMENT_LENGTH, 0]} ref={j1} {...segmentProps}>
          <group ref={guideVisual} />
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -ROPE_SEGMENT_LENGTH * 2, 0]} ref={j2} {...segmentProps}>
          <group ref={middleVisual} />
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -ROPE_SEGMENT_LENGTH * 3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[-attachment.joint[0], -ROPE_SEGMENT_LENGTH * 3 - attachment.joint[1], -attachment.joint[2]]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardModel}
            scale={MODEL_SCALE}
            position={MODEL_OFFSET}
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
            <mesh geometry={nodes.card.geometry}>
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
            >
              <meshStandardMaterial color="#454c50" metalness={0.75} roughness={0.48} />
            </mesh>
            <mesh
              geometry={nodes.clamp.geometry}
            >
              <meshStandardMaterial color="#454c50" metalness={0.75} roughness={0.48} />
            </mesh>
            {/* Short folded fabric tab, attached to the same transform as the ring.
                Its front face is separated from the main ribbon to avoid z-fighting. */}
            <mesh position={[attachment.local.x, attachment.local.y + 0.052, 0.008]}>
              <boxGeometry args={[STRAP_WIDTH / MODEL_SCALE, 0.112, 0.018]} />
              <meshStandardMaterial color="#181d20" roughness={0.96} />
            </mesh>
            <mesh position={[attachment.local.x, attachment.local.y + 0.094, 0.018]}>
              <boxGeometry args={[STRAP_WIDTH / MODEL_SCALE * 0.76, 0.002, 0.002]} />
              <meshStandardMaterial color="#535a5e" roughness={1} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh geometry={strapGeometry} frustumCulled={false}>
        <meshStandardMaterial
          map={activeBandTexture}
          side={THREE.DoubleSide}
          roughness={0.96}
          metalness={0}
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
              <Physics interpolate updatePriority={-2} gravity={[0, -40, 0]} timeStep={1 / 60}>
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
