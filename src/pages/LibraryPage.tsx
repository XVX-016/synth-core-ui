import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Atom, Star } from "lucide-react";

const molecules = [
  { id: 1, name: "Aspirin", formula: "C₉H₈O₄", weight: "180.16", category: "Pharmaceutical", rating: 4.5 },
  { id: 2, name: "Caffeine", formula: "C₈H₁₀N₄O₂", weight: "194.19", category: "Stimulant", rating: 4.8 },
  { id: 3, name: "Dopamine", formula: "C₈H₁₁NO₂", weight: "153.18", category: "Neurotransmitter", rating: 4.7 },
  { id: 4, name: "Glucose", formula: "C₆H₁₂O₆", weight: "180.16", category: "Sugar", rating: 4.6 },
  { id: 5, name: "Ethanol", formula: "C₂H₆O", weight: "46.07", category: "Alcohol", rating: 4.2 },
  { id: 6, name: "Penicillin", formula: "C₁₆H₁₈N₂O₄S", weight: "334.39", category: "Antibiotic", rating: 4.9 },
  { id: 7, name: "Vitamin C", formula: "C₆H₈O₆", weight: "176.12", category: "Vitamin", rating: 4.8 },
  { id: 8, name: "Morphine", formula: "C₁₇H₁₉NO₃", weight: "285.34", category: "Analgesic", rating: 4.4 },
  { id: 9, name: "Adrenaline", formula: "C₉H₁₃NO₃", weight: "183.20", category: "Hormone", rating: 4.7 },
];

const categories = ["All", "Pharmaceutical", "Stimulant", "Neurotransmitter", "Sugar", "Alcohol", "Antibiotic", "Vitamin", "Analgesic", "Hormone"];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMolecules = molecules.filter((mol) => {
    const matchesSearch = mol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mol.formula.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || mol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Molecule Library</h1>
          <p className="text-muted-foreground mt-1">Browse and explore molecular structures</p>
        </div>
        <Button variant="glow" className="gap-2">
          <Atom className="w-4 h-4" />
          New Molecule
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="glass-panel">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search molecules by name or formula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="lab" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMolecules.length} of {molecules.length} molecules
        </p>
      </div>

      {/* Molecule Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMolecules.map((molecule) => (
          <Card
            key={molecule.id}
            className="glass-panel hover:bg-card/80 transition-smooth cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                    {molecule.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {molecule.category}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium">{molecule.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Placeholder for molecule visualization */}
              <div className="aspect-square rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                <Atom className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-smooth" />
              </div>

              {/* Properties */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formula</span>
                  <span className="font-mono font-semibold">{molecule.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-semibold">{molecule.weight} g/mol</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Clone
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
