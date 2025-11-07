import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoleculeViewer } from "@/components/MoleculeViewer";
import { Link } from "react-router-dom";
import { Sparkles, Library, TrendingUp, Zap, Atom } from "lucide-react";

const quickStats = [
  { label: "Molecules Generated", value: "1,247", icon: Atom, trend: "+12%" },
  { label: "Library Items", value: "342", icon: Library, trend: "+8%" },
  { label: "Success Rate", value: "94.2%", icon: TrendingUp, trend: "+2.1%" },
  { label: "Active Projects", value: "18", icon: Zap, trend: "+3" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl p-8 md:p-12 metallic-surface">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm">
              <Sparkles className="w-4 h-4 text-accent animate-glow-pulse" />
              <span className="text-muted-foreground">AI-Powered Molecular Design</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Design the Future of
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Molecular Science
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Generate, analyze, and optimize molecular structures with cutting-edge AI technology. 
              Build better compounds faster than ever before.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/lab">
                <Button variant="glow" size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Molecule
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="lab" size="lg" className="gap-2">
                  <Library className="w-5 h-5" />
                  Explore Library
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
            <MoleculeViewer />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="glass-panel hover:bg-card/80 transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-accent">{stat.trend}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link to="/library">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-panel hover:bg-card/80 transition-smooth cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Compound #{i}234</CardTitle>
                <CardDescription>Modified 2 hours ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg bg-muted/30 flex items-center justify-center mb-4">
                  <Atom className="w-12 h-12 text-primary/50" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                    C₁₂H₂₂O₁₁
                  </div>
                  <div className="px-2 py-1 rounded bg-accent/10 text-accent text-xs font-medium">
                    94% Match
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
