import { useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { AtomMesh } from "./AtomMesh";
import { BondMesh } from "./BondMesh";
import { MoleculeGraph } from "@/engine/MoleculeGraph";
import { useMoleculeStore } from "@/store/moleculeStore";

interface MoleculeRendererProps {
  molecule?: MoleculeGraph;
}

export function MoleculeRenderer({ molecule: propMolecule }: MoleculeRendererProps) {
  const storeMolecule = useMoleculeStore((state) => state.molecule);
  const selectedAtoms = useMoleculeStore((state) => state.selectedAtoms);
  const hoveredAtom = useMoleculeStore((state) => state.hoveredAtom);
  const selectAtom = useMoleculeStore((state) => state.selectAtom);
  const hoverAtom = useMoleculeStore((state) => state.hoverAtom);

  const molecule = propMolecule || storeMolecule;

  const atoms = useMemo(() => Array.from(molecule.atoms.values()), [molecule]);
  const bonds = useMemo(() => Array.from(molecule.bonds.values()), [molecule]);

  const handleAtomClick = (atomId: string) => (e: any) => {
    e.stopPropagation();
    selectAtom(atomId, e.shiftKey);
  };

  const handleAtomHover = (atomId: string) => (e: any) => {
    e.stopPropagation();
    hoverAtom(atomId);
  };

  const handleAtomOut = () => {
    hoverAtom(null);
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#60a5fa" />

      {/* Render bonds first (so atoms appear on top) */}
      {bonds.map((bond) => {
        const atom1 = molecule.atoms.get(bond.a1);
        const atom2 = molecule.atoms.get(bond.a2);
        if (!atom1 || !atom2) return null;

        return (
          <BondMesh
            key={bond.id}
            bond={bond}
            atom1={atom1}
            atom2={atom2}
            selected={false}
          />
        );
      })}

      {/* Render atoms */}
      {atoms.map((atom) => (
        <AtomMesh
          key={atom.id}
          atom={atom}
          selected={selectedAtoms.has(atom.id)}
          hovered={hoveredAtom === atom.id}
          onClick={handleAtomClick(atom.id)}
          onPointerOver={handleAtomHover(atom.id)}
          onPointerOut={handleAtomOut}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

