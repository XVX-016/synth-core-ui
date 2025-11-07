import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Target, Zap, Clock } from "lucide-react";

const kpis = [
  { label: "Generation Success Rate", value: "94.2%", change: "+2.1%", trend: "up", icon: Target },
  { label: "Avg. Processing Time", value: "1.8s", change: "-0.3s", trend: "up", icon: Clock },
  { label: "Active Experiments", value: "127", change: "+15", trend: "up", icon: Activity },
  { label: "Model Accuracy", value: "96.8%", change: "+1.2%", trend: "up", icon: Zap },
];

const recentActivity = [
  { action: "Generated", molecule: "Compound #A234", time: "2 min ago", status: "success" },
  { action: "Optimized", molecule: "Aspirin Derivative", time: "12 min ago", status: "success" },
  { action: "Analyzed", molecule: "Protein Fragment", time: "28 min ago", status: "success" },
  { action: "Failed", molecule: "Complex #X912", time: "1 hour ago", status: "error" },
  { action: "Generated", molecule: "Novel Compound", time: "2 hours ago", status: "success" },
];

const topMolecules = [
  { name: "Aspirin", uses: 234, efficiency: 96 },
  { name: "Caffeine", uses: 189, efficiency: 94 },
  { name: "Dopamine", uses: 167, efficiency: 98 },
  { name: "Glucose", uses: 145, efficiency: 92 },
  { name: "Ethanol", uses: 123, efficiency: 89 },
];

export default function Analytics() {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track performance and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={kpi.label} className="glass-panel">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-primary" />
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    kpi.trend === "up" ? "text-accent" : "text-destructive"
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    {kpi.change}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest molecular operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.action}</span>
                      <Badge
                        variant={activity.status === "success" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.molecule}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Molecules */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Top Molecules</CardTitle>
            <CardDescription>Most used compounds this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMolecules.map((molecule, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{molecule.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{molecule.uses} uses</span>
                      <span className="text-accent font-medium">{molecule.efficiency}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${molecule.efficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Generation success rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Integration with charting library recommended</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
