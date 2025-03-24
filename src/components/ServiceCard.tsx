
import { useState } from "react";
import { Service, ServiceStatus, ServiceCategory } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  ExternalLink, 
  MoreVertical, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Star,
  Tag
} from "lucide-react";
import { useServiceStore } from "@/lib/serviceStore";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
}

export function ServiceCard({ service, onEdit }: ServiceCardProps) {
  const { deleteService, checkServiceStatus, toggleFavorite, updateService } = useServiceStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  
  const { id, name, description, status, mainUrl, apiUrl, webhookUrl, lastChecked, category, isFavorite } = service;
  
  const statusConfig: Record<ServiceStatus, { label: string, icon: React.ReactNode }> = {
    online: { 
      label: "Online", 
      icon: <CheckCircle className="h-3.5 w-3.5 mr-1 text-success" /> 
    },
    offline: { 
      label: "Offline", 
      icon: <XCircle className="h-3.5 w-3.5 mr-1 text-destructive" /> 
    },
    error: { 
      label: "Error", 
      icon: <AlertTriangle className="h-3.5 w-3.5 mr-1 text-warning" /> 
    },
  };

  const categoryColors: Record<ServiceCategory, string> = {
    infrastructure: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    api: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    frontend: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    backend: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    database: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100",
    monitoring: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  };
  
  const handleRefresh = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsRefreshing(true);
    await checkServiceStatus(id);
    setIsRefreshing(false);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteService(id);
  };
  
  const handleCopyUrl = (url: string, type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast.success(`${type} URL copied to clipboard`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleChangeCategory = (newCategory: ServiceCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    updateService(id, { category: newCategory });
    toast.success(`${name} moved to ${newCategory} category`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(service);
  };
  
  const handleCardClick = () => {
    if (mainUrl) {
      window.open(mainUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const cardClasses = `glass-card animate-fade-in overflow-hidden group transition-all duration-300 hover:shadow-lg ${isFavorite ? 'border-amber-400 dark:border-amber-500' : ''} cursor-pointer active:scale-95`;
  
  return (
    <Card className={cardClasses} onClick={handleCardClick}>
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`status-indicator status-indicator-${status}`} />
            <CardTitle className="text-lg font-medium hover:text-primary">{name}</CardTitle>
            {isFavorite && (
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            )}
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
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Category</span>
                </DropdownMenuItem>
                
                {(['infrastructure', 'api', 'frontend', 'backend', 'database', 'monitoring', 'other'] as ServiceCategory[]).map(cat => (
                  <DropdownMenuItem 
                    key={cat} 
                    onClick={(e) => handleChangeCategory(cat, e)}
                    className="ml-4"
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${categoryColors[cat].split(' ')[0]}`}></span>
                    <span className={category === cat ? 'font-semibold' : ''}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <div className={`status-badge status-badge-${status}`}>
            {statusConfig[status].icon}
            {statusConfig[status].label}
          </div>
          
          {category && (
            <Badge variant="outline" className={categoryColors[category]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          )}
          
          {lastChecked && (
            <span className="text-xs text-muted-foreground">
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
                onClick={(e) => handleCopyUrl(mainUrl, "Main", e)}
              >
                Copy
              </Button>
              <a
                href={mainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => handleCopyUrl(apiUrl, "API", e)}
                >
                  Copy
                </Button>
                <a
                  href={apiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => handleCopyUrl(webhookUrl, "Webhook", e)}
                >
                  Copy
                </Button>
                <a
                  href={webhookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
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
