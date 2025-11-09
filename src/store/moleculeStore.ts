import { create } from "zustand";
import { MoleculeGraph } from "@/engine/MoleculeGraph";
import { UndoStack } from "@/engine/UndoStack";
import { Atom, Bond, Element } from "@/engine/types";
import { placeAtomRelative, optimizeGeometry, centerMolecule } from "@/engine/LayoutEngine";

interface MoleculeStore {
  molecule: MoleculeGraph;
  undoStack: UndoStack;
  selectedAtoms: Set<string>;
  selectedBond: string | null;
  hoveredAtom: string | null;

  // Actions
  addAtom: (element: Element, position?: [number, number, number]) => string;
  removeAtom: (id: string) => void;
  addBond: (a1: string, a2: string, order?: number) => void;
  removeBond: (id: string) => void;
  selectAtom: (id: string | null, multiSelect?: boolean) => void;
  selectBond: (id: string | null) => void;
  hoverAtom: (id: string | null) => void;
  updateAtomPosition: (id: string, position: [number, number, number]) => void;
  optimize: () => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  clear: () => void;
  loadMolecule: (molecule: MoleculeGraph) => void;
}

// Create default methane molecule
function createDefaultMolecule(): MoleculeGraph {
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

export const useMoleculeStore = create<MoleculeStore>((set, get) => {
  const initialMolecule = createDefaultMolecule();
  const undoStack = new UndoStack();
  undoStack.push(initialMolecule);

  return {
    molecule: initialMolecule,
    undoStack,
    selectedAtoms: new Set(),
    selectedBond: null,
    hoveredAtom: null,

    addAtom: (element, position) => {
      const state = get();
      const molecule = state.molecule.clone();

      let atomId: string;
      if (position) {
        atomId = molecule.addAtom({ element, position });
      } else {
        // Place relative to last selected atom or at origin
        if (state.selectedAtoms.size > 0) {
          const baseId = Array.from(state.selectedAtoms)[0];
          const baseAtom = molecule.atoms.get(baseId);
          if (baseAtom) {
            const newPos = placeAtomRelative(baseAtom, element);
            atomId = molecule.addAtom({ element, position: newPos });
          } else {
            atomId = molecule.addAtom({ element, position: [0, 0, 0] });
          }
        } else {
          atomId = molecule.addAtom({ element, position: [0, 0, 0] });
        }
      }

      centerMolecule(molecule);
      set({ molecule, selectedAtoms: new Set([atomId]) });
      state.saveState();
      return atomId;
    },

    removeAtom: (id) => {
      const state = get();
      const molecule = state.molecule.clone();
      molecule.removeAtom(id);
      centerMolecule(molecule);

      const newSelected = new Set(state.selectedAtoms);
      newSelected.delete(id);
      set({ molecule, selectedAtoms: newSelected });
      state.saveState();
    },

    addBond: (a1, a2, order = 1) => {
      const state = get();
      const molecule = state.molecule.clone();
      const bondId = molecule.addBond(a1, a2, order);
      if (bondId) {
        optimizeGeometry(molecule, 10);
        centerMolecule(molecule);
        set({ molecule });
        state.saveState();
      }
    },

    removeBond: (id) => {
      const state = get();
      const molecule = state.molecule.clone();
      molecule.removeBond(id);
      optimizeGeometry(molecule, 10);
      centerMolecule(molecule);
      set({ molecule, selectedBond: null });
      state.saveState();
    },

    selectAtom: (id, multiSelect = false) => {
      const state = get();
      if (!id) {
        set({ selectedAtoms: new Set() });
        return;
      }

      let newSelected: Set<string>;
      if (multiSelect) {
        newSelected = new Set(state.selectedAtoms);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
      } else {
        // If clicking on already selected atom with one other selected, create bond
        if (state.selectedAtoms.size === 1 && state.selectedAtoms.has(id)) {
          // Do nothing, already selected
          return;
        }
        if (state.selectedAtoms.size === 1 && !state.selectedAtoms.has(id)) {
          // Create bond between the two atoms
          const otherAtom = Array.from(state.selectedAtoms)[0];
          state.addBond(otherAtom, id);
          set({ selectedAtoms: new Set() });
          return;
        }
        newSelected = new Set([id]);
      }

      set({ selectedAtoms: newSelected });
    },

    selectBond: (id) => {
      set({ selectedBond: id });
    },

    hoverAtom: (id) => {
      set({ hoveredAtom: id });
    },

    updateAtomPosition: (id, position) => {
      const state = get();
      const molecule = state.molecule.clone();
      const atom = molecule.atoms.get(id);
      if (atom) {
        molecule.atoms.set(id, { ...atom, position });
        set({ molecule });
      }
    },

    optimize: () => {
      const state = get();
      const molecule = state.molecule.clone();
      optimizeGeometry(molecule, 30);
      centerMolecule(molecule);
      set({ molecule });
      state.saveState();
    },

    undo: () => {
      const state = get();
      const prevState = state.undoStack.undo();
      if (prevState) {
        set({ molecule: prevState });
      }
    },

    redo: () => {
      const state = get();
      const nextState = state.undoStack.redo();
      if (nextState) {
        set({ molecule: nextState });
      }
    },

    saveState: () => {
      const state = get();
      state.undoStack.push(state.molecule);
    },

    clear: () => {
      const molecule = new MoleculeGraph();
      const undoStack = new UndoStack();
      undoStack.push(molecule);
      set({
        molecule,
        undoStack,
        selectedAtoms: new Set(),
        selectedBond: null,
        hoveredAtom: null,
      });
    },

    loadMolecule: (molecule) => {
      const state = get();
      const cloned = molecule.clone();
      centerMolecule(cloned);
      const undoStack = new UndoStack();
      undoStack.push(cloned);
      set({ molecule: cloned, undoStack });
    },
  };
});

