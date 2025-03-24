
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ServiceCard } from "@/components/ServiceCard";
import { AddServiceModal } from "@/components/AddServiceModal";
import { SearchFilters } from "@/components/SearchFilters";
import { Dashboard } from "@/components/Dashboard";
import { useServiceStore } from "@/lib/serviceStore";
import { Service, ServiceStatus, ServiceCategory } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";

const Index = () => {
  const { services, loadServices, checkAllServicesStatus, isLoading, error } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus[]>(["online", "offline", "error"]);
  const [categoryFilter, setCategoryFilter] = useState<(ServiceCategory | "uncategorized")[]>(["infrastructure", "api", "frontend", "backend", "database", "monitoring", "other", "uncategorized"]);
  const [favoriteFilter, setFavoriteFilter] = useState<boolean | null>(null);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "dashboard">("dashboard");
  
  // Load services from MongoDB on initial render
  useEffect(() => {
    loadServices();
  }, [loadServices]);
  
  // Check all services on initial load and set up interval
  useEffect(() => {
    if (services.length > 0) {
      checkAllServicesStatus();
      
      // Set up interval to check services every 5 minutes
      const interval = setInterval(() => {
        checkAllServicesStatus();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [services.length, checkAllServicesStatus]);
  
  const handleAddService = () => {
    setEditingService(null);
    setAddServiceOpen(true);
  };
  
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setAddServiceOpen(true);
  };
  
  // Filter services based on search query, status filter, category filter and favorite filter
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
      || service.description.toLowerCase().includes(searchQuery.toLowerCase())
      || service.mainUrl.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.includes(service.status);
    
    const serviceCategory = service.category || "uncategorized";
    const matchesCategory = categoryFilter.includes(serviceCategory);
    
    const matchesFavorite = favoriteFilter === null || service.isFavorite === favoriteFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesFavorite;
  });
  
  // Get favorite services
  const favoriteServices = filteredServices.filter(service => service.isFavorite);
  
  return (
    <>
      <Header onAddService={handleAddService} />
      
      <main className="flex-1 container py-8">
        <Tabs defaultValue="dashboard" className="w-full mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="dashboard" onClick={() => setViewMode("dashboard")}>Dashboard</TabsTrigger>
              <TabsTrigger value="services" onClick={() => setViewMode("grid")}>Services</TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                Favorites ({favoriteServices.length})
              </TabsTrigger>
            </TabsList>
            
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              favoriteFilter={favoriteFilter}
              setFavoriteFilter={setFavoriteFilter}
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">Loading services...</h2>
              <p className="text-muted-foreground">Please wait while we connect to the database.</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <h2 className="text-xl font-medium mb-2">Error loading services</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <>
              <TabsContent value="dashboard" className="mt-0">
                <Dashboard services={services} />
                
                {filteredServices.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">All Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onEdit={handleEditService}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-medium mb-2">No services found</h2>
                    <p className="text-muted-foreground">
                      {services.length === 0
                        ? "Add your first service to get started."
                        : "Try adjusting your search or filters."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onEdit={handleEditService}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-0">
                {favoriteServices.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-medium mb-2">No favorite services found</h2>
                    <p className="text-muted-foreground">
                      {services.length === 0
                        ? "Add your first service to get started."
                        : "Mark services as favorites to see them here."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onEdit={handleEditService}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
      
      <AddServiceModal
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        editingService={editingService}
      />
    </>
  );
};

export default Index;
