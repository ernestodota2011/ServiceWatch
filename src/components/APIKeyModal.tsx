
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { APIKey } from "@/types";
import { useApiKeyStore } from "@/lib/apiKeyStore";
import { formatDistanceToNow } from "date-fns";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface APIKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function APIKeyModal({ open, onOpenChange }: APIKeyModalProps) {
  const { apiKeys, addApiKey, deleteApiKey } = useApiKeyStore();
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    const key = addApiKey(newKeyName);
    setNewKey(key);
    setNewKeyName("");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleDeleteKey = (id: string) => {
    deleteApiKey(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass sm:max-w-[600px] animate-fade-in animate-slide-up">
        <DialogHeader>
          <DialogTitle>API Keys</DialogTitle>
          <DialogDescription>
            Manage your API keys for accessing the ServiceWatch API.
          </DialogDescription>
        </DialogHeader>

        {newKey && (
          <div className="bg-primary/10 border border-primary/20 rounded-md p-4 animate-fade-in mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Your new API key</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopyKey(newKey)}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="font-mono text-xs bg-background/50 p-2 rounded overflow-x-auto">
                {newKey}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure to copy your API key now. You won't be able to see it again!
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setNewKey(null)}
            >
              Done
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="newKeyName">Create a new API key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="newKeyName"
                placeholder="Key name (e.g., Production, Development)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCreateKey}>Generate</Button>
            </div>
          </div>

          {apiKeys.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Your API keys</h3>
                <div className="rounded-md border border-border">
                  <div className="divide-y divide-border">
                    {apiKeys.map((apiKey: APIKey) => (
                      <div
                        key={apiKey.id}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{apiKey.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Created {formatDistanceToNow(new Date(apiKey.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDeleteKey(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
