import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import "./ai-hud.css";

function GlowSphere() {
  const glowRef = useRef();
  useFrame((state) => {
    if (glowRef.current) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      glowRef.current.scale.set(breathe * 1.3, breathe * 1.3, breathe * 1.3);
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });
  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color="#0088ff" transparent opacity={0.15} side={THREE.BackSide} />
    </mesh>
  );
}

function AISphere() {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(1);
  const targetIntensity = useRef(0.5);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;

      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      const hoverScale = hovered ? 1.1 : 1;
      targetScale.current = breathe * hoverScale;
      targetIntensity.current = hovered ? 1.5 : 0.6;

      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current),
        0.08
      );
      materialRef.current.emissiveIntensity += (targetIntensity.current - materialRef.current.emissiveIntensity) * 0.08;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#00ddff"
        emissive="#00aaff"
        emissiveIntensity={0.6}
        wireframe
      />
    </mesh>
  );
}

function DynamicLights() {
  const light1Ref = useRef();
  const light2Ref = useRef();
  const light3Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.5) * 8;
      light1Ref.current.position.z = Math.cos(t * 0.5) * 8;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(t * 0.3 + 2) * 6;
      light2Ref.current.position.y = Math.cos(t * 0.4 + 2) * 6;
    }
    if (light3Ref.current) {
      light3Ref.current.position.y = Math.sin(t * 0.7 + 4) * 5;
      light3Ref.current.position.z = Math.cos(t * 0.7 + 4) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[8, 0, 0]} intensity={1.5} color="#0066ff" />
      <pointLight ref={light2Ref} position={[0, 6, 0]} intensity={1} color="#00aaff" />
      <pointLight ref={light3Ref} position={[0, 0, 5]} intensity={0.8} color="#0088ff" />
    </>
  );
}

function Particles() {
  const pointsRef = useRef();
  const { viewport, mouse } = useThree();
  const particleCount = 150;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.5 + Math.random() * 1.5;
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        posArray[ix] += velocities[ix] + mouse.x * 0.01;
        posArray[iy] += velocities[iy] + mouse.y * 0.01;
        posArray[iz] += velocities[iz];
        const x = posArray[ix], y = posArray[iy], z = posArray[iz];
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist < 2 || dist > 5) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 2.5 + Math.random() * 1.5;
          posArray[ix] = r * Math.sin(phi) * Math.cos(theta);
          posArray[iy] = r * Math.sin(phi) * Math.sin(theta);
          posArray[iz] = r * Math.cos(phi);
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AIHud() {
  const [cpu] = useState(47 + Math.random() * 20);
  const [memory] = useState(62 + Math.random() * 15);
  const [latency] = useState(12 + Math.random() * 20);
  const [particles] = useState(150);

  return (
    <div className="ai-hud">
      <div className="scan-line" />
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      <div className="ai-hud-header">
        <div className="ai-icon">AI</div>
        <div>
          <div className="ai-title">NEXUS CORE</div>
          <div className="ai-subtitle">Quantum Interface v2.4</div>
        </div>
      </div>

      <div className="ai-status">
        <div className="status-row">
          <span className="status-label">SYSTEM</span>
          <span className="status-value">ONLINE</span>
        </div>
        <div className="status-row">
          <span className="status-label">NEURAL NET</span>
          <span className="status-value">ACTIVE</span>
        </div>
        <div className="status-row">
          <span className="status-label">THREAT LEVEL</span>
          <span className="status-value warning">ELEVATED</span>
        </div>
      </div>

      <div className="ai-progress">
        <div className="progress-label">
          <span>CPU LOAD</span>
          <span>{cpu.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${cpu}%` }} />
        </div>
      </div>

      <div className="ai-progress">
        <div className="progress-label">
          <span>MEMORY</span>
          <span>{memory.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${memory}%` }} />
        </div>
      </div>

      <div className="ai-stats">
        <div className="stat-box">
          <div className="stat-value">{latency.toFixed(0)}ms</div>
          <div className="stat-label">LATENCY</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{particles}</div>
          <div className="stat-label">PARTICLES</div>
        </div>
      </div>
    </div>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#000510", 5, 25]} />
      <Stars radius={80} depth={100} count={5000} factor={3} saturation={0.2} fade speed={0.5} />
      <Particles />
      <GlowSphere />
      <AISphere />
      <ambientLight intensity={0.3} />
      <DynamicLights />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={["#000510"]} />
        <Scene />
      </Canvas>
      <AIHud />
    </div>
  );
}