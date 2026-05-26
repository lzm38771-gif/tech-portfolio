import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import "./ai-hud.css";

function GlowSphere({ hovered }) {
  const glowRef = useRef();
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (glowRef.current) {
      targetPos.current.x += (state.mouse.x * 0.5 - targetPos.current.x) * 0.05;
      targetPos.current.y += (state.mouse.y * 0.5 - targetPos.current.y) * 0.05;
      glowRef.current.position.x = targetPos.current.x;
      glowRef.current.position.y = targetPos.current.y;

      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      const hoverBoost = hovered ? 1.2 : 1;
      const baseScale = breathe * 1.3 * hoverBoost;
      glowRef.current.scale.set(baseScale, baseScale, baseScale);
      const targetOpacity = hovered ? 0.3 : 0.15;
      glowRef.current.material.opacity += (targetOpacity + Math.sin(state.clock.elapsedTime * 1.5) * 0.03 - glowRef.current.material.opacity) * 0.08;
    }
  });
  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color="#0088ff" transparent opacity={0.15} side={THREE.BackSide} />
    </mesh>
  );
}

function AISphere({ onHover }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;

      targetPos.current.x += (state.mouse.x * 0.5 - targetPos.current.x) * 0.05;
      targetPos.current.y += (state.mouse.y * 0.5 - targetPos.current.y) * 0.05;
      meshRef.current.position.x = targetPos.current.x;
      meshRef.current.position.y = targetPos.current.y;

      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      const hoverScale = onHover ? 1.15 : 1;
      const targetScale = breathe * hoverScale;
      const targetIntensity = onHover ? 1.8 : 0.7;

      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      );
      materialRef.current.emissiveIntensity += (targetIntensity - materialRef.current.emissiveIntensity) * 0.08;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => onHover && onHover(true)}
      onPointerOut={() => onHover && onHover(false)}
    >
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#00ddff"
        emissive="#00aaff"
        emissiveIntensity={0.7}
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
  const particleCount = 200;
  const particleData = useRef([]);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 2;
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      particleData.current[i] = {
        angle: Math.random() * Math.PI * 2,
        radius: radius,
        speed: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
      };
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      const mx = state.mouse.x * 2;
      const my = state.mouse.y * 2;

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const data = particleData.current[i];

        data.angle += data.speed;
        const baseX = Math.cos(data.angle) * data.radius;
        const baseY = Math.sin(data.angle + data.phase) * 0.3;
        const baseZ = Math.sin(data.angle) * data.radius;

        const dx = mx - posArray[ix];
        const dy = my - posArray[iy];
        const dist = Math.sqrt(dx * dx + dy * dy);
        const attraction = dist > 0.1 ? 0.002 / (dist * dist + 0.1) : 0;

        posArray[ix] += (baseX - posArray[ix]) * 0.02 + dx * attraction + Math.sin(time * 2 + data.phase) * 0.002;
        posArray[iy] += (baseY - posArray[iy]) * 0.02 + dy * attraction + Math.cos(time * 2 + data.phase) * 0.002;
        posArray[iz] += (baseZ - posArray[iz]) * 0.02;

        const totalDist = Math.sqrt(posArray[ix] * posArray[ix] + posArray[iy] * posArray[iy] + posArray[iz] * posArray[iz]);
        if (totalDist < 1.5 || totalDist > 5) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 2 + Math.random() * 2;
          posArray[ix] = r * Math.sin(phi) * Math.cos(theta);
          posArray[iy] = r * Math.sin(phi) * Math.sin(theta);
          posArray[iz] = r * Math.cos(phi);
          data.radius = r;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.05}
        color="#00ffff"
        transparent
        opacity={0.9}
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
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <fog attach="fog" args={["#000510", 5, 25]} />
      <Stars radius={80} depth={100} count={5000} factor={3} saturation={0.2} fade speed={0.5} />
      <Particles />
      <GlowSphere hovered={hovered} />
      <AISphere onHover={setHovered} />
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