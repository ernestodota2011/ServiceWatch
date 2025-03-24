
import { useState } from "react";
import { Service, ServiceStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreVertical, Edit, Trash2, RefreshCw } from "lucide-react";
import { useServiceStore } from "@/lib/serviceStore";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
}

export function ServiceCard({ service, onEdit }: ServiceCardProps) {
  const { deleteService, checkServiceStatus } = useServiceStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { id, name, description, status, mainUrl, apiUrl, webhookUrl, lastChecked } = service;
  
  const statusLabel: Record<ServiceStatus, string> = {
    online: "Online",
    offline: "Offline",
    error: "Error",
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkServiceStatus(id);
    setIsRefreshing(false);
  };
  
  const handleDelete = () => {
    deleteService(id);
  };
  
  const handleCopyUrl = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`${type} URL copied to clipboard`);
  };
  
  return (
    <Card className="glass-card animate-fade-in overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`status-indicator status-indicator-${status}`} />
            <CardTitle className="text-lg font-medium">{name}</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(service)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className={`status-badge status-badge-${status} mt-1`}>
          {statusLabel[status]}
          {lastChecked && (
            <span className="text-muted-foreground ml-1">
              • Updated {formatDistanceToNow(new Date(lastChecked), { addSuffix: true })}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Main URL</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleCopyUrl(mainUrl, "Main")}
              >
                Copy
              </Button>
              <a
                href={mainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>
          
          {apiUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API URL</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleCopyUrl(apiUrl, "API")}
                >
                  Copy
                </Button>
                <a
                  href={apiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          )}
          
          {webhookUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Webhook URL</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleCopyUrl(webhookUrl, "Webhook")}
                >
                  Copy
                </Button>
                <a
                  href={webhookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
