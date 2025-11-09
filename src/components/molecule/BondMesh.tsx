import { useMemo } from "react";
import * as THREE from "three";
import { Bond, Atom } from "@/engine/types";

interface BondMeshProps {
  bond: Bond;
  atom1: Atom;
  atom2: Atom;
  selected?: boolean;
}

export function BondMesh({ bond, atom1, atom2, selected = false }: BondMeshProps) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...atom1.position);
    const end = new THREE.Vector3(...atom2.position);
    const direction = new THREE.Vector3().subVectors(end, start);
    const bondLength = direction.length();
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return {
      position: [midpoint.x, midpoint.y, midpoint.z] as [number, number, number],
      quaternion: quat,
      length: bondLength,
    };
  }, [atom1.position, atom2.position]);

  // Bond thickness based on order
  const radius = bond.order === 3 ? 0.08 : bond.order === 2 ? 0.06 : 0.05;
  const color = selected ? "#FFD700" : "#94a3b8";

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={selected ? color : "#000000"}
        emissiveIntensity={selected ? 0.2 : 0}
      />
    </mesh>
  );
}

