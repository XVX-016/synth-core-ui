import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MoleculeViewer } from "@/components/MoleculeViewer";
import { Atom, Link2, Eraser, Undo, Redo, Download, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

const atomTypes = [
  { name: "Carbon", symbol: "C", color: "#1e293b" },
  { name: "Hydrogen", symbol: "H", color: "#3b82f6" },
  { name: "Oxygen", symbol: "O", color: "#ef4444" },
  { name: "Nitrogen", symbol: "N", color: "#8b5cf6" },
];

export default function MoleculeLab() {
  const [selectedAtom, setSelectedAtom] = useState("C");
  const [bondStrength, setBondStrength] = useState([1]);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const handleGenerate = () => {
    toast.success("Molecule generated successfully!", {
      description: "Your structure has been optimized and saved.",
    });
  };

  const handleSave = () => {
    toast.success("Molecule saved to library");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 pb-20 md:pb-8">
      {/* Main Viewer */}
      <div className="space-y-4">
        {/* Toolbar */}
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-2">
                {atomTypes.map((atom) => (
                  <Button
                    key={atom.symbol}
                    variant={selectedAtom === atom.symbol ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedAtom(atom.symbol)}
                    className="gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: atom.color }}
                    />
                    {atom.symbol}
                  </Button>
                ))}
              </div>

              <div className="h-6 w-px bg-border mx-2" />

              <Button variant="ghost" size="sm">
                <Link2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Eraser className="w-4 h-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-2" />

              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>

              <div className="ml-auto flex gap-2">
                <Button variant="lab" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Viewer */}
        <div className="h-[600px]">
          <MoleculeViewer />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="glow" size="lg" className="flex-1 gap-2" onClick={handleGenerate}>
            <Sparkles className="w-5 h-5" />
            Generate Variation
          </Button>
          <Button variant="secondary" size="lg" className="flex-1">
            Optimize Structure
          </Button>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="space-y-4">
        {/* Molecule Info */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Molecule Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Formula</div>
              <div className="text-lg font-mono font-semibold">CH₄</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Molecular Weight</div>
              <div className="text-lg font-semibold">16.04 g/mol</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Atoms</div>
              <div className="text-lg font-semibold">5</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Bonds</div>
              <div className="text-lg font-semibold">4</div>
            </div>
          </CardContent>
        </Card>

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
