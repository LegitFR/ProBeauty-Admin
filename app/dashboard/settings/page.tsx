import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure system settings and preferences
          </p>
        </div>
      </div>

      <Card className="p-12">
        <CardContent className="p-0 text-center">
          <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Settings Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Configure system settings and preferences. This section is currently
            under development and will be available in the next update.
          </p>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl">
            Request Early Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
