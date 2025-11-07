import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, Award, Settings, Bell } from "lucide-react";
import { toast } from "sonner";

const achievements = [
  { name: "First Generation", description: "Created your first molecule", earned: true },
  { name: "Library Builder", description: "Saved 10+ molecules", earned: true },
  { name: "Optimizer", description: "Optimized 50 structures", earned: true },
  { name: "Master Chemist", description: "Generated 100 molecules", earned: false },
  { name: "Innovator", description: "Created a novel compound", earned: false },
];

export default function Profile() {
  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-6 p-6 rounded-2xl metallic-surface">
        <Avatar className="w-24 h-24 border-4 border-border">
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Dr. Jane Doe</h1>
          <p className="text-muted-foreground mt-1">Research Scientist • BioTech Labs</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="secondary">Pro Member</Badge>
            <Badge variant="outline">127 Molecules</Badge>
          </div>
        </div>
        <Button variant="lab" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardDescription>Total Generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,247</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardDescription>Success Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94.2%</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardDescription>Streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12 days</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="name" defaultValue="Dr. Jane Doe" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="jane.doe@biotech.com" className="pl-9" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="organization" defaultValue="BioTech Laboratories" className="pl-9" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your research interests..."
              defaultValue="Computational chemist specializing in drug discovery and molecular design."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} variant="glow" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <CardTitle>Achievements</CardTitle>
          </div>
          <CardDescription>Your milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-2 transition-smooth ${
                  achievement.earned
                    ? "border-accent/50 bg-accent/5"
                    : "border-border bg-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.earned ? "bg-accent/20" : "bg-muted"
                  }`}>
                    <Award className={`w-5 h-5 ${
                      achievement.earned ? "text-accent" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Generation Complete", "Optimization Results", "Weekly Summary", "Product Updates"].map((pref) => (
            <div key={pref} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium">{pref}</span>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
