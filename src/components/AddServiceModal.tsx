
import { useState, useEffect } from "react";
import { Service } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServiceStore } from "@/lib/serviceStore";

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService: Service | null;
}

export function AddServiceModal({ open, onOpenChange, editingService }: AddServiceModalProps) {
  const { addService, updateService } = useServiceStore();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  
  // Reset form when opening or closing modal
  useEffect(() => {
    if (editingService) {
      setName(editingService.name);
      setDescription(editingService.description);
      setMainUrl(editingService.mainUrl);
      setApiUrl(editingService.apiUrl || "");
      setWebhookUrl(editingService.webhookUrl || "");
    } else {
      setName("");
      setDescription("");
      setMainUrl("");
      setApiUrl("");
      setWebhookUrl("");
    }
  }, [open, editingService]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      name,
      description,
      mainUrl,
      ...(apiUrl ? { apiUrl } : {}),
      ...(webhookUrl ? { webhookUrl } : {}),
    };
    
    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService(serviceData);
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass sm:max-w-[500px] animate-fade-in animate-slide-up">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the service details below."
                : "Fill in the details for the new service."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Service Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mainUrl" className="text-right">
                Main URL
              </Label>
              <Input
                id="mainUrl"
                type="url"
                placeholder="https://example.com"
                value={mainUrl}
                onChange={(e) => setMainUrl(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiUrl" className="text-right">
                API URL
              </Label>
              <Input
                id="apiUrl"
                type="url"
                placeholder="https://api.example.com (Optional)"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhookUrl" className="text-right">
                Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://webhook.example.com (Optional)"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? "Update" : "Add"} Service
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
