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

export const useMoleculeStore = create<MoleculeStore>((set, get) => {
  const initialMolecule = new MoleculeGraph();
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

      if (multiSelect) {
        const newSelected = new Set(state.selectedAtoms);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        set({ selectedAtoms: newSelected });
      } else {
        set({ selectedAtoms: new Set([id]) });
      }

      // Auto-create bond if two atoms selected
      if (state.selectedAtoms.size === 2 && !multiSelect) {
        const atoms = Array.from(state.selectedAtoms);
        state.addBond(atoms[0], atoms[1]);
        set({ selectedAtoms: new Set() });
      }
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

