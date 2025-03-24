
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ServiceCard } from "@/components/ServiceCard";
import { AddServiceModal } from "@/components/AddServiceModal";
import { SearchFilters } from "@/components/SearchFilters";
import { useServiceStore } from "@/lib/serviceStore";
import { Service, ServiceStatus } from "@/types";

const Index = () => {
  const { services, loadServices, checkAllServicesStatus, isLoading, error } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus[]>(["online", "offline", "error"]);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
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
  
  // Filter services based on search query and status filter
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
      || service.description.toLowerCase().includes(searchQuery.toLowerCase())
      || service.mainUrl.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.includes(service.status);
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <>
      <Header onAddService={handleAddService} />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
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
        ) : filteredServices.length === 0 ? (
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
