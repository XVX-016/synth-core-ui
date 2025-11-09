import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MoleculeRenderer } from "./molecule/MoleculeRenderer";
import { MoleculeGraph } from "@/engine/MoleculeGraph";
import { centerMolecule } from "@/engine/LayoutEngine";

interface MoleculeViewerProps {
  molecule?: MoleculeGraph;
  className?: string;
}

// Create default methane molecule
function createMethane(): MoleculeGraph {
  const molecule = new MoleculeGraph();
  
  // Carbon at center
  const carbonId = molecule.addAtom({
    element: "C",
    position: [0, 0, 0],
  });

  // Four hydrogens in tetrahedral arrangement
  const hydrogenPositions: [number, number, number][] = [
    [0.89, 0.89, 0.89],
    [-0.89, -0.89, 0.89],
    [0.89, -0.89, -0.89],
    [-0.89, 0.89, -0.89],
  ];

  hydrogenPositions.forEach((pos) => {
    const hydrogenId = molecule.addAtom({
      element: "H",
      position: pos,
    });
    molecule.addBond(carbonId, hydrogenId, 1);
  });

  centerMolecule(molecule);
  return molecule;
}

export function MoleculeViewer({ molecule, className = "" }: MoleculeViewerProps) {
  const displayMolecule = molecule || createMethane();

  return (
    <div className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden metallic-surface ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-aluminum-light">
            <div className="text-muted-foreground">Loading 3D viewer...</div>
          </div>
        }
      >
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <color attach="background" args={["#F5F5F7"]} />
          <MoleculeRenderer molecule={displayMolecule} />
        </Canvas>
      </Suspense>
    </div>
  );
}
