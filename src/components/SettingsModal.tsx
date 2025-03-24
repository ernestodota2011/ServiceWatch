
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/themeStore";
import { Moon, Sun, Laptop, Key } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { APIKeyModal } from "./APIKeyModal";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme } = useThemeStore();
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass sm:max-w-[500px] animate-fade-in animate-slide-up">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your experience with ServiceWatch
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="theme">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="theme">Appearance</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme" className="space-y-4 pt-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Theme Preference</h3>
                
                <RadioGroup 
                  value={theme}
                  onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4 pt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">API Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate API keys to access the ServiceWatch API programmatically.
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    onOpenChange(false);
                    setTimeout(() => setApiKeyModalOpen(true), 100);
                  }}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Manage API Keys
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">API Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to use the ServiceWatch API to manage your services programmatically.
                </p>
                
                <div className="mt-2 space-y-2 text-sm">
                  <p className="font-medium">Base URL</p>
                  <code className="px-2 py-1 bg-muted rounded text-xs block">
                    https://api.servicewatch.example/v1
                  </code>
                  
                  <div className="mt-4">
                    <p className="font-medium mb-1">Available Endpoints</p>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>GET /services - List all services</li>
                      <li>GET /services/:id - Get a specific service</li>
                      <li>POST /services - Create a new service</li>
                      <li>PUT /services/:id - Update a service</li>
                      <li>DELETE /services/:id - Delete a service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <APIKeyModal 
        open={apiKeyModalOpen} 
        onOpenChange={setApiKeyModalOpen} 
      />
    </>
  );
}
