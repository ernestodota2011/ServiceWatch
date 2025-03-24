
import { create } from "zustand";
import { Service, ServiceStatus, ServiceCategory } from "@/types";
import { toast } from "sonner";
import { connectToMongoDB } from "./mongodb";

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  loadServices: () => Promise<void>;
  addService: (service: Omit<Service, "id" | "status" | "lastChecked" | "isFavorite" | "statusHistory">) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  checkServiceStatus: (id: string) => Promise<void>;
  checkAllServicesStatus: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "WOOFED CRM",
    description: "Customer Relationship Management System",
    status: "online",
    mainUrl: "https://woofedcrm.aetherlogik.com",
    category: "frontend",
    isFavorite: true,
    lastChecked: new Date(),
  },
  {
    id: "2",
    name: "BOLT",
    description: "Fast and reliable web performance tool",
    status: "online",
    mainUrl: "https://bolt.aetherlogik.com",
    category: "monitoring",
    lastChecked: new Date(),
  },
  {
    id: "3",
    name: "YOURLS",
    description: "URL shortener service",
    status: "online",
    mainUrl: "https://yourls.aetherlogik.com/admin",
    category: "frontend",
    lastChecked: new Date(),
  },
  {
    id: "4",
    name: "DOCUSEAL",
    description: "Document signing platform",
    status: "online",
    mainUrl: "https://docuseal.aetherlogik.com",
    category: "frontend",
    isFavorite: true,
    lastChecked: new Date(),
  },
  {
    id: "5",
    name: "CAL.COM",
    description: "Scheduling and calendar management",
    status: "online",
    mainUrl: "https://cal.aetherlogik.com",
    category: "frontend",
    lastChecked: new Date(),
  },
  {
    id: "6",
    name: "EVOLUTION API",
    description: "API management platform",
    status: "online",
    mainUrl: "https://evoapi.aetherlogik.com/manager",
    apiUrl: "https://evoapi.aetherlogik.com",
    category: "api",
    lastChecked: new Date(),
  },
  {
    id: "7",
    name: "BOTPRESS",
    description: "Conversational AI platform",
    status: "online",
    mainUrl: "https://botpress.aetherlogik.com",
    category: "frontend",
    lastChecked: new Date(),
  },
  {
    id: "8",
    name: "DIFY AI",
    description: "AI development platform",
    status: "online",
    mainUrl: "https://dify.aetherlogik.com",
    category: "frontend",
    lastChecked: new Date(),
  },
  {
    id: "9",
    name: "FLOWISE",
    description: "Workflow automation tool",
    status: "online",
    mainUrl: "https://flowise.aetherlogik.com",
    category: "backend",
    lastChecked: new Date(),
  },
  {
    id: "10",
    name: "TYPEBOT",
    description: "Chatbot builder platform",
    status: "online",
    mainUrl: "https://builder.aetherlogik.com",
    category: "frontend",
    lastChecked: new Date(),
  },
  {
    id: "11",
    name: "CHATWOOT",
    description: "Customer engagement platform",
    status: "online",
    mainUrl: "https://chatwoot.aetherlogik.com",
    category: "frontend",
    lastChecked: new Date(),
  },
  {
    id: "12",
    name: "NOCODB",
    description: "No-code database platform",
    status: "online",
    mainUrl: "https://nocodb.aetherlogik.com",
    category: "database",
    lastChecked: new Date(),
  },
  {
    id: "13",
    name: "MINIO",
    description: "Object storage service",
    status: "online",
    mainUrl: "https://miniofront.aetherlogik.com",
    apiUrl: "https://minioback.aetherlogik.com",
    category: "infrastructure",
    lastChecked: new Date(),
  },
  {
    id: "14",
    name: "RABBITMQ",
    description: "Message broker service",
    status: "online",
    mainUrl: "https://rabbitmq.aetherlogik.com",
    category: "infrastructure",
    lastChecked: new Date(),
  },
  {
    id: "15",
    name: "QDRANT",
    description: "Vector database for similarity search",
    status: "online",
    mainUrl: "http://qdrant.aetherlogik.com:6333/dashboard",
    category: "database",
    lastChecked: new Date(),
  },
  {
    id: "16",
    name: "GRAFANA",
    description: "Analytics and monitoring platform",
    status: "online",
    mainUrl: "https://grafana.aetherlogik.com",
    category: "monitoring",
    isFavorite: true,
    lastChecked: new Date(),
  },
  {
    id: "17",
    name: "N8N",
    description: "Workflow automation platform",
    status: "online",
    mainUrl: "https://n8n.aetherlogik.com",
    webhookUrl: "https://webhook.aetherlogik.com",
    category: "backend",
    lastChecked: new Date(),
  },
  {
    id: "18",
    name: "PORTAINER",
    description: "Container management platform",
    status: "online",
    mainUrl: "https://portainer.aetherlogik.com",
    category: "infrastructure",
    lastChecked: new Date(),
  },
];

const checkStatus = async (url: string): Promise<ServiceStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.9) {
        resolve("offline");
      } else if (random > 0.7) {
        resolve("error");
      } else {
        resolve("online");
      }
    }, 500 + Math.random() * 1000);
  });
};

export const useServiceStore = create<ServiceState>()((set, get) => ({
  services: [],
  isLoading: false,
  error: null,
  
  loadServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      const count = await collection.countDocuments();
      
      if (count === 0) {
        const servicesToInsert = initialServices.map(service => ({
          _id: service.id,
          name: service.name,
          description: service.description,
          status: service.status,
          mainUrl: service.mainUrl,
          apiUrl: service.apiUrl,
          webhookUrl: service.webhookUrl,
          category: service.category,
          isFavorite: service.isFavorite || false,
          lastChecked: service.lastChecked,
          statusHistory: service.statusHistory || [],
        }));
        
        await collection.insertMany(servicesToInsert);
        
        const services = await collection.find().toArray();
        set({ 
          services: services.map(doc => ({
            id: doc._id,
            name: doc.name,
            description: doc.description,
            status: doc.status,
            mainUrl: doc.mainUrl,
            apiUrl: doc.apiUrl,
            webhookUrl: doc.webhookUrl,
            category: doc.category,
            isFavorite: doc.isFavorite || false,
            lastChecked: doc.lastChecked,
            statusHistory: doc.statusHistory || [],
          })),
          isLoading: false 
        });
      } else {
        const services = await collection.find().toArray();
        set({ 
          services: services.map(doc => ({
            id: doc._id,
            name: doc.name,
            description: doc.description,
            status: doc.status,
            mainUrl: doc.mainUrl,
            apiUrl: doc.apiUrl,
            webhookUrl: doc.webhookUrl,
            category: doc.category,
            isFavorite: doc.isFavorite || false,
            lastChecked: doc.lastChecked,
            statusHistory: doc.statusHistory || [],
          })),
          isLoading: false 
        });
      }
    } catch (error) {
      console.error("Failed to load services:", error);
      set({ 
        error: "Failed to load services. Using local data instead.",
        services: initialServices,
        isLoading: false 
      });
      toast.error("Failed to load services from database. Using local data.");
    }
  },
  
  addService: async (service) => {
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      const newService = {
        name: service.name,
        description: service.description,
        status: "online" as ServiceStatus,
        mainUrl: service.mainUrl,
        apiUrl: service.apiUrl,
        webhookUrl: service.webhookUrl,
        category: service.category,
        isFavorite: false,
        lastChecked: new Date(),
        statusHistory: [],
      };
      
      const result = await collection.insertOne(newService);
      
      if (result.acknowledged) {
        const insertedService: Service = {
          id: result.insertedId.toString(),
          ...newService,
        };
        
        set((state) => ({
          services: [...state.services, insertedService],
        }));
        
        toast.success(`${service.name} added successfully`);
      }
    } catch (error) {
      console.error("Failed to add service:", error);
      toast.error("Failed to add service to database");
    }
  },
  
  updateService: async (id, updatedService) => {
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      const result = await collection.updateOne(
        { _id: id },
        { $set: updatedService }
      );
      
      if (result.matchedCount > 0) {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id ? { ...service, ...updatedService } : service
          ),
        }));
        
        toast.success("Service updated successfully");
      } else {
        toast.error("Service not found");
      }
    } catch (error) {
      console.error("Failed to update service:", error);
      toast.error("Failed to update service in database");
    }
  },
  
  deleteService: async (id) => {
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      const result = await collection.deleteOne({ _id: id });
      
      if (result.deletedCount > 0) {
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
        }));
        
        toast.success("Service deleted successfully");
      } else {
        toast.error("Service not found");
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to delete service from database");
    }
  },
  
  toggleFavorite: async (id) => {
    const service = get().services.find(s => s.id === id);
    if (!service) return;
    
    const updatedFavorite = !service.isFavorite;
    
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      const result = await collection.updateOne(
        { _id: id },
        { $set: { isFavorite: updatedFavorite } }
      );
      
      if (result.matchedCount > 0) {
        set((state) => ({
          services: state.services.map((s) => 
            s.id === id ? { ...s, isFavorite: updatedFavorite } : s
          ),
        }));
        
        toast.success(`${service.name} ${updatedFavorite ? 'added to' : 'removed from'} favorites`);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      toast.error("Failed to update favorite status");
    }
  },
  
  checkServiceStatus: async (id) => {
    const service = get().services.find((s) => s.id === id);
    if (!service) return;
    
    try {
      const status = await checkStatus(service.mainUrl);
      
      // Create status history entry
      const statusHistoryEntry = {
        status,
        timestamp: new Date()
      };
      
      const statusHistory = [...(service.statusHistory || []), statusHistoryEntry].slice(-10); // Keep last 10 entries
      
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      await collection.updateOne(
        { _id: id },
        { 
          $set: { 
            status: status,
            lastChecked: new Date(),
            statusHistory
          } 
        }
      );
      
      set((state) => ({
        services: state.services.map((s) =>
          s.id === id
            ? { ...s, status, lastChecked: new Date(), statusHistory }
            : s
        ),
      }));
    } catch (error) {
      console.error("Failed to check service status:", error);
      
      const errorStatus: ServiceStatus = "error";
      
      try {
        const db = await connectToMongoDB();
        const collection = db.collection('services');
        
        await collection.updateOne(
          { _id: id },
          { 
            $set: { 
              status: errorStatus,
              lastChecked: new Date() 
            } 
          }
        );
      } catch (dbError) {
        console.error("Failed to update status in database:", dbError);
      }
      
      set((state) => ({
        services: state.services.map((s) =>
          s.id === id
            ? { ...s, status: errorStatus, lastChecked: new Date() }
            : s
        ),
      }));
    }
  },
  
  checkAllServicesStatus: async () => {
    const { services } = get();
    
    const checkPromises = services.map(async (service) => {
      try {
        const status = await checkStatus(service.mainUrl);
        
        // Create status history entry
        const statusHistoryEntry = {
          status,
          timestamp: new Date()
        };
        
        const statusHistory = [...(service.statusHistory || []), statusHistoryEntry].slice(-10);
        
        return {
          ...service,
          status,
          lastChecked: new Date(),
          statusHistory
        };
      } catch (error) {
        return {
          ...service,
          status: "error" as ServiceStatus,
          lastChecked: new Date(),
        };
      }
    });
    
    const updatedServices = await Promise.all(checkPromises);
    
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('services');
      
      const updatePromises = updatedServices.map(service => 
        collection.updateOne(
          { _id: service.id },
          { 
            $set: { 
              status: service.status,
              lastChecked: service.lastChecked,
              statusHistory: service.statusHistory
            } 
          }
        )
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Failed to update services in database:", error);
      toast.error("Failed to update services in database");
    }
    
    set({ services: updatedServices });
    toast.success("All services checked");
  },
}));
