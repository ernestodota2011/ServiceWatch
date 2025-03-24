
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Service, ServiceStatus } from "@/types";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ServiceStatus[];
  setStatusFilter: (statuses: ServiceStatus[]) => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: SearchFiltersProps) {
  const allStatuses: ServiceStatus[] = ["online", "offline", "error"];
  
  const handleStatusToggle = (status: ServiceStatus) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(allStatuses);
  };
  
  const hasActiveFilters = searchQuery !== "" || statusFilter.length !== allStatuses.length;
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("online")}
              onCheckedChange={() => handleStatusToggle("online")}
            >
              Online
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("offline")}
              onCheckedChange={() => handleStatusToggle("offline")}
            >
              Offline
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("error")}
              onCheckedChange={() => handleStatusToggle("error")}
            >
              Error
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
