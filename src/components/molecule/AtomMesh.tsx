import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Atom, ELEMENT_COLORS, ELEMENT_RADII } from "@/engine/types";

interface AtomMeshProps {
  atom: Atom;
  selected?: boolean;
  hovered?: boolean;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
}

export function AtomMesh({
  atom,
  selected = false,
  hovered = false,
  onClick,
  onPointerOver,
  onPointerOut,
}: AtomMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const radius = ELEMENT_RADII[atom.element];
  const color = ELEMENT_COLORS[atom.element];

  useFrame((state) => {
    if (meshRef.current && hovered) {
      // Subtle pulse animation when hovered
      const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const finalColor = selected ? "#FFD700" : hovered ? "#FFA500" : color;

  return (
    <mesh
      ref={meshRef}
      position={atom.position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={finalColor}
        metalness={0.9}
        roughness={0.3}
        emissive={selected ? finalColor : "#000000"}
        emissiveIntensity={selected ? 0.3 : 0}
      />
    </mesh>
  );
}

