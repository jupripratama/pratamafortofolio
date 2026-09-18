import React, { useEffect, useLayoutEffect, useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRapier, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';
import { createProfileCardTexture, createLanyardBandTexture } from '../lib/cardTextures';
import { createLanyardGeometry, createLanyardUpdater, STRAP_WIDTH } from '../lib/lanyardGeometry';
import { ErrorBoundary } from './ErrorBoundary';

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';
const ROPE_SEGMENT_LENGTH = 2.45;
const MODEL_SCALE = 2.6;
const MODEL_OFFSET: [number, number, number] = [0, -1.2, -0.05];
const VIEW_HEIGHT = 6.2;
const DRAG_SENSITIVITY = 1.95;

function CardCamera() {
  const camera = useThree((state) => state.camera);
  const height = useThree((state) => state.size.height);
  useLayoutEffect(() => {
    const orthographic = camera as THREE.OrthographicCamera;
    orthographic.zoom = height / VIEW_HEIGHT;
    orthographic.updateProjectionMatrix();
  }, [camera, height]);
  return null;
}

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
  flipped: boolean;
  onFlip: () => void;
}

function Band({ profile, textureMode, flipped, onFlip }: BandProps) {
  const { rapier } = useRapier();
  const canvas = useThree((state) => state.gl.domElement);
  const cardModel = useRef<THREE.Group>(null);
  const anchorVisual = useRef<THREE.Group>(null);
  const guideVisual = useRef<THREE.Group>(null);
  const middleVisual = useRef<THREE.Group>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const quat = useMemo(() => new THREE.Quaternion(), []);
  const clampTop = useMemo(() => new THREE.Vector3(), []);
  const guide = useMemo(() => new THREE.Vector3(), []);
  const middle = useMemo(() => new THREE.Vector3(), []);
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const strapGeometry = useMemo(createLanyardGeometry, []);
  const updateStrap = useMemo(() => createLanyardUpdater(strapGeometry), [strapGeometry]);
  useEffect(() => () => strapGeometry.dispose(), [strapGeometry]);

  const { width: canvasWidth, height: canvasHeight } = useThree((state) => state.size);
  const viewportWidth = VIEW_HEIGHT * canvasWidth / canvasHeight;
  const isMobile = canvasWidth < 1024;
  const anchorX = isMobile ? 0 : Math.min(3.8, Math.max(2.2, viewportWidth * 0.25));

  const segmentProps = useMemo(() => ({
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 0.8,
    linearDamping: 0.65,
  }), []);

  const { nodes, materials } = useGLTF(GLTF_PATH) as any;
  const cardBounds = useMemo(() => {
    nodes.card.geometry.computeBoundingBox();
    return (nodes.card.geometry.boundingBox as THREE.Box3).clone()
      .applyMatrix4(new THREE.Matrix4().makeScale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE))
      .translate(new THREE.Vector3(...MODEL_OFFSET));
  }, [nodes]);
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

  const [dragged, drag] = useState(false);
  const dragSession = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    clientX: number;
    clientY: number;
    unitsPerPixel: number;
    position: THREE.Vector3;
  } | null>(null);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useSphericalJoint(j3, card, [[0, 0, 0], attachment.joint]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const session = dragSession.current;
      if (!session || event.pointerId !== session.pointerId) return;
      session.clientX = event.clientX;
      session.clientY = event.clientY;
    };
    const release = (event?: PointerEvent) => {
      const session = dragSession.current;
      if (!session || (event && event.pointerId !== session.pointerId)) return;
      dragSession.current = null;
      if (canvas.hasPointerCapture(session.pointerId)) canvas.releasePointerCapture(session.pointerId);
      const body = card.current;
      if (body) {
        // Preserve the simulated drag velocity so release continues the swing.
        const velocity = { ...body.linvel() };
        body.setBodyType(rapier.RigidBodyType.Dynamic, true);
        body.setLinvel(velocity, true);
      }
      drag(false);
    };
    const blur = () => release();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', blur);
    canvas.addEventListener('lostpointercapture', release);
    return () => {
      release();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', blur);
      canvas.removeEventListener('lostpointercapture', release);
    };
  }, [canvas, rapier]);

  useEffect(() => {
    if (hovered || dragged) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const session = dragSession.current;
    if (session) {
      // Move relative to the pressed point, using one coordinate system for
      // the whole gesture. A press with no movement leaves the pose unchanged.
      const x = session.position.x + (session.clientX - session.startX) * session.unitsPerPixel;
      const y = session.position.y - (session.clientY - session.startY) * session.unitsPerPixel;
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      const margin = 0.06;
      card.current?.setNextKinematicTranslation({
        x: THREE.MathUtils.clamp(x,
          -viewportWidth / 2 - cardBounds.min.x + margin,
          viewportWidth / 2 - cardBounds.max.x - margin),
        y: THREE.MathUtils.clamp(y,
          state.camera.position.y - VIEW_HEIGHT / 2 - cardBounds.min.y + margin,
          state.camera.position.y + VIEW_HEIGHT / 2 - cardBounds.max.y - margin),
        z: session.position.z,
      });
    }

    if (card.current && !session) {
      // Gently steer only the facing direction; physics owns tilt and swing.
      const rotation = card.current.rotation();
      const velocity = card.current.angvel();
      const yaw = Math.atan2(
        2 * (rotation.w * rotation.y + rotation.x * rotation.z),
        1 - 2 * (rotation.y * rotation.y + rotation.x * rotation.x),
      );
      const target = flipped ? Math.PI : 0;
      const error = Math.atan2(Math.sin(target - yaw), Math.cos(target - yaw));
      if (Math.abs(error) > 0.002 || Math.abs(velocity.y) > 0.002) {
        card.current.setAngvel({
          x: velocity.x,
          y: velocity.y + (12 * error - 4 * velocity.y) * Math.min(delta, 0.05),
          z: velocity.z,
        }, true);
      }
    }
  }, -3);

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
      onFlip();
    }
  };

  return (
    <>
      {/* Leave extra space below the card for a short downward pull. */}
      <group position={[anchorX, 8.45, 0]}>
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
          type="dynamic"
        >
          <CuboidCollider args={[0.92, 1.3, 0.01]} />
          <group
            ref={cardModel}
            scale={MODEL_SCALE}
            position={MODEL_OFFSET}
            onPointerOver={() => {
              hover(true);
              soundFx.playHover();
            }}
            onPointerOut={() => hover(false)}
            onPointerDown={(e) => {
              if (e.button !== 0 || !card.current || dragSession.current) return;
              e.stopPropagation();
              const body = card.current;
              const position = new THREE.Vector3().copy(body.translation());
              dragSession.current = {
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                clientX: e.clientX,
                clientY: e.clientY,
                unitsPerPixel: (VIEW_HEIGHT / canvas.getBoundingClientRect().height) * DRAG_SENSITIVITY,
                position,
              };
              canvas.setPointerCapture(e.pointerId);
              body.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
              body.setNextKinematicTranslation(position);
              drag(true);
              soundFx.playClick();
            }}
            onDoubleClick={handleFlip}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={activeCardTexture}
                map-anisotropy={16}
                clearcoat={0}
                roughness={0.35}
                metalness={0.0}
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
  const [flipped, setFlipped] = useState(false);
  const flipCard = () => {
    setFlipped((value) => !value);
    soundFx.playCardFlip();
  };
  return (
    <div className="w-full h-full relative select-none pointer-events-none">
      {isReady && (
        <ErrorBoundary>
          <Canvas
            orthographic
            camera={{ position: [0, -0.4, 11.0], zoom: 100 }}
            gl={{ alpha: true, antialias: true }}
            className="w-full h-full pointer-events-auto"
            style={{ width: '100%', height: '100%', touchAction: 'none' }}
          >
              <CardCamera />
              <Suspense fallback={null}>
                <ambientLight intensity={1.75} />
                <Physics interpolate updatePriority={-2} gravity={[0, -40, 0]} timeStep={1 / 60}>
                  <Band profile={profile} textureMode="custom" flipped={flipped} onFlip={flipCard} />
                </Physics>
                <Environment blur={0.75}>
                  <Lightformer
                    intensity={0.8}
                    color="#bae6fd"
                    position={[0, -1, 5]}
                    rotation={[0, 0, Math.PI / 3]}
                    scale={[40, 2, 1]}
                  />
                  <Lightformer
                    intensity={0.6}
                    color="#a7f3d0"
                    position={[2, 1, 2]}
                    rotation={[0, 0, -Math.PI / 4]}
                    scale={[25, 2, 1]}
                  />
                </Environment>
              </Suspense>
            </Canvas>
          </ErrorBoundary>
        )}
    </div>
  );
}
