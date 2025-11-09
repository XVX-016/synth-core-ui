import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MoleculeViewer } from "@/components/MoleculeViewer";
import { Atom, Link2, Eraser, Undo, Redo, Download, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useMoleculeStore } from "@/store/moleculeStore";
import { Element } from "@/engine/types";
import { ELEMENT_COLORS } from "@/engine/types";

const atomTypes: { name: string; symbol: Element; color: string }[] = [
  { name: "Carbon", symbol: "C", color: ELEMENT_COLORS.C },
  { name: "Hydrogen", symbol: "H", color: ELEMENT_COLORS.H },
  { name: "Oxygen", symbol: "O", color: ELEMENT_COLORS.O },
  { name: "Nitrogen", symbol: "N", color: ELEMENT_COLORS.N },
];

export default function MoleculeLab() {
  const [selectedAtomType, setSelectedAtomType] = useState<Element>("C");
  const [bondStrength, setBondStrength] = useState([1]);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const molecule = useMoleculeStore((state) => state.molecule);
  const addAtom = useMoleculeStore((state) => state.addAtom);
  const removeAtom = useMoleculeStore((state) => state.removeAtom);
  const optimize = useMoleculeStore((state) => state.optimize);
  const undo = useMoleculeStore((state) => state.undo);
  const redo = useMoleculeStore((state) => state.redo);
  const canUndo = useMoleculeStore((state) => state.undoStack.canUndo());
  const canRedo = useMoleculeStore((state) => state.undoStack.canRedo());
  const selectedAtoms = useMoleculeStore((state) => state.selectedAtoms);

  const handleAddAtom = () => {
    addAtom(selectedAtomType);
    toast.success(`${selectedAtomType} atom added`);
  };

  const handleRemoveSelected = () => {
    if (selectedAtoms.size > 0) {
      selectedAtoms.forEach((id) => removeAtom(id));
      toast.success("Atom(s) removed");
    }
  };

  const handleGenerate = () => {
    optimize();
    toast.success("Molecule optimized successfully!", {
      description: "Your structure has been optimized.",
    });
  };

  const handleSave = () => {
    toast.success("Molecule saved to library");
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const formula = molecule.getFormula();
  const molecularWeight = molecule.getMolecularWeight().toFixed(2);
  const atomCount = molecule.atoms.size;
  const bondCount = molecule.bonds.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid lg:grid-cols-[1fr_320px] gap-6 pb-20 md:pb-8"
    >
      {/* Main Viewer */}
      <div className="space-y-4">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-panel">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-2">
                  {atomTypes.map((atom) => (
                    <motion.div
                      key={atom.symbol}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={selectedAtomType === atom.symbol ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedAtomType(atom.symbol)}
                        className="gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: atom.color }}
                        />
                        {atom.symbol}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="h-6 w-px bg-border mx-2" />

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" onClick={handleAddAtom}>
                    <Atom className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" onClick={handleRemoveSelected}>
                    <Eraser className="w-4 h-4" />
                  </Button>
                </motion.div>

                <div className="h-6 w-px bg-border mx-2" />

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    disabled={!canRedo}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </motion.div>

                <div className="ml-auto flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="lab" size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="h-[600px]"
        >
          <MoleculeViewer molecule={molecule} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button variant="glow" size="lg" className="w-full gap-2" onClick={handleGenerate}>
              <Sparkles className="w-5 h-5" />
              Optimize Structure
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Sidebar Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Molecule Info */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Molecule Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Formula</div>
                <div className="text-lg font-mono font-semibold">{formula || "—"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Molecular Weight</div>
                <div className="text-lg font-semibold">{molecularWeight} g/mol</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Atoms</div>
                <div className="text-lg font-semibold">{atomCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Bonds</div>
                <div className="text-lg font-semibold">{bondCount}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bond Controls */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Bond Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Bond Strength</Label>
              <Slider
                value={bondStrength}
                onValueChange={setBondStrength}
                max={3}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Single</span>
                <span>Double</span>
                <span>Triple</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-optimize">Auto-optimize</Label>
              <Switch
                id="auto-optimize"
                checked={autoOptimize}
                onCheckedChange={setAutoOptimize}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="glass-panel border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-smooth cursor-pointer">
                Add functional group at C2
              </div>
              <div className="p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-smooth cursor-pointer">
                Replace H with OH
              </div>
              <div className="p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-smooth cursor-pointer">
                Form cyclic structure
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
