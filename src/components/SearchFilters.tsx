
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X, Filter, Star, Tag } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Service, ServiceStatus, ServiceCategory } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ServiceStatus[];
  setStatusFilter: (statuses: ServiceStatus[]) => void;
  categoryFilter?: (ServiceCategory | "uncategorized")[];
  setCategoryFilter?: (categories: (ServiceCategory | "uncategorized")[]) => void;
  favoriteFilter?: boolean | null;
  setFavoriteFilter?: (isFavorite: boolean | null) => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter = ["infrastructure", "api", "frontend", "backend", "database", "monitoring", "other", "uncategorized"],
  setCategoryFilter = () => {},
  favoriteFilter = null,
  setFavoriteFilter = () => {}
}: SearchFiltersProps) {
  const allStatuses: ServiceStatus[] = ["online", "offline", "error"];
  const allCategories: (ServiceCategory | "uncategorized")[] = ["infrastructure", "api", "frontend", "backend", "database", "monitoring", "other", "uncategorized"];
  
  const handleStatusToggle = (status: ServiceStatus) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  const handleCategoryToggle = (category: ServiceCategory | "uncategorized") => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter((c) => c !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
    }
  };
  
  const handleFavoriteToggle = (value: boolean | null) => {
    setFavoriteFilter(value);
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(allStatuses);
    setCategoryFilter(allCategories);
    setFavoriteFilter(null);
  };
  
  const hasActiveFilters = 
    searchQuery !== "" || 
    statusFilter.length !== allStatuses.length || 
    categoryFilter.length !== allCategories.length ||
    favoriteFilter !== null;
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery !== "") count++;
    if (statusFilter.length !== allStatuses.length) count++;
    if (categoryFilter.length !== allCategories.length) count++;
    if (favoriteFilter !== null) count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
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
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
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
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Favorites</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={favoriteFilter === true}
              onCheckedChange={() => handleFavoriteToggle(favoriteFilter === true ? null : true)}
            >
              <Star className="h-4 w-4 mr-2 fill-amber-400 text-amber-400" />
              Favorites only
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            {allCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={categoryFilter.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              >
                <Tag className="h-3.5 w-3.5 mr-2" />
                {category === "uncategorized" 
                  ? "Uncategorized" 
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
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
