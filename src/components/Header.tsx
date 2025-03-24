
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Plus, Settings, RefreshCw } from "lucide-react";
import { useServiceStore } from "@/lib/serviceStore";
import { SettingsModal } from "./SettingsModal";

interface HeaderProps {
  onAddService: () => void;
}

export function Header({ onAddService }: HeaderProps) {
  const { checkAllServicesStatus } = useServiceStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await checkAllServicesStatus();
    setIsRefreshing(false);
  };
  
  return (
    <>
      <header className="sticky top-0 z-30 glass-card shadow-sm backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-xl">ServiceWatch</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh All</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onAddService}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Service</span>
            </Button>
            
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
