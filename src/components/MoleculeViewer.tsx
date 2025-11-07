import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AtomProps {
  position: [number, number, number];
  color: string;
  size?: number;
}

function Atom({ position, color, size = 0.3 }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </Sphere>
  );
}

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
}

function Bond({ start, end }: BondProps) {
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const length = direction.length();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, length, 8]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

interface MoleculeProps {
  moleculeName?: string;
}

function Methane() {
  // Methane (CH4) structure - carbon at center, 4 hydrogens around it
  const carbonPos: [number, number, number] = [0, 0, 0];
  const hydrogenPositions: [number, number, number][] = [
    [0.8, 0.8, 0.8],
    [-0.8, -0.8, 0.8],
    [0.8, -0.8, -0.8],
    [-0.8, 0.8, -0.8],
  ];

  return (
    <>
      {/* Carbon atom */}
      <Atom position={carbonPos} color="#1e293b" size={0.4} />
      
      {/* Hydrogen atoms */}
      {hydrogenPositions.map((pos, i) => (
        <Atom key={i} position={pos} color="#3b82f6" size={0.25} />
      ))}
      
      {/* Bonds */}
      {hydrogenPositions.map((pos, i) => (
        <Bond key={i} start={carbonPos} end={pos} />
      ))}
    </>
  );
}

export function MoleculeViewer({ moleculeName = "methane" }: MoleculeProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden metallic-surface">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-muted-foreground">Loading 3D viewer...</div>
        </div>
      }>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <color attach="background" args={["#f1f5f9"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={0.5} color="#60a5fa" />
          
          <Methane />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
