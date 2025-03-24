
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Service, ServiceStatus } from "@/types";
import { toast } from "sonner";

interface ServiceState {
  services: Service[];
  addService: (service: Omit<Service, "id" | "status" | "lastChecked">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  checkServiceStatus: (id: string) => Promise<void>;
  checkAllServicesStatus: () => Promise<void>;
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "WOOFED CRM",
    description: "Customer Relationship Management System",
    status: "online",
    mainUrl: "https://woofedcrm.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "2",
    name: "BOLT",
    description: "Fast and reliable web performance tool",
    status: "online",
    mainUrl: "https://bolt.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "3",
    name: "YOURLS",
    description: "URL shortener service",
    status: "online",
    mainUrl: "https://yourls.aetherlogik.com/admin",
    lastChecked: new Date(),
  },
  {
    id: "4",
    name: "DOCUSEAL",
    description: "Document signing platform",
    status: "online",
    mainUrl: "https://docuseal.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "5",
    name: "CAL.COM",
    description: "Scheduling and calendar management",
    status: "online",
    mainUrl: "https://cal.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "6",
    name: "EVOLUTION API",
    description: "API management platform",
    status: "online",
    mainUrl: "https://evoapi.aetherlogik.com/manager",
    apiUrl: "https://evoapi.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "7",
    name: "BOTPRESS",
    description: "Conversational AI platform",
    status: "online",
    mainUrl: "https://botpress.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "8",
    name: "DIFY AI",
    description: "AI development platform",
    status: "online",
    mainUrl: "https://dify.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "9",
    name: "FLOWISE",
    description: "Workflow automation tool",
    status: "online",
    mainUrl: "https://flowise.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "10",
    name: "TYPEBOT",
    description: "Chatbot builder platform",
    status: "online",
    mainUrl: "https://builder.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "11",
    name: "CHATWOOT",
    description: "Customer engagement platform",
    status: "online",
    mainUrl: "https://chatwoot.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "12",
    name: "NOCODB",
    description: "No-code database platform",
    status: "online",
    mainUrl: "https://nocodb.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "13",
    name: "MINIO",
    description: "Object storage service",
    status: "online",
    mainUrl: "https://miniofront.aetherlogik.com",
    apiUrl: "https://minioback.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "14",
    name: "RABBITMQ",
    description: "Message broker service",
    status: "online",
    mainUrl: "https://rabbitmq.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "15",
    name: "QDRANT",
    description: "Vector database for similarity search",
    status: "online",
    mainUrl: "http://qdrant.aetherlogik.com:6333/dashboard",
    lastChecked: new Date(),
  },
  {
    id: "16",
    name: "GRAFANA",
    description: "Analytics and monitoring platform",
    status: "online",
    mainUrl: "https://grafana.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "17",
    name: "N8N",
    description: "Workflow automation platform",
    status: "online",
    mainUrl: "https://n8n.aetherlogik.com",
    webhookUrl: "https://webhook.aetherlogik.com",
    lastChecked: new Date(),
  },
  {
    id: "18",
    name: "PORTAINER",
    description: "Container management platform",
    status: "online",
    mainUrl: "https://portainer.aetherlogik.com",
    lastChecked: new Date(),
  },
];

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulates a fetch to check service status
const checkStatus = async (url: string): Promise<ServiceStatus> => {
  // In a real application, this would make an actual HTTP request
  // For demo purposes, we're simulating with random statuses
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
    }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
  });
};

export const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      services: initialServices,
      
      addService: (service) => {
        const newService: Service = {
          ...service,
          id: generateId(),
          status: "online", // Default status for new services
          lastChecked: new Date(),
        };
        
        set((state) => ({
          services: [...state.services, newService],
        }));
        
        toast.success(`${service.name} added successfully`);
      },
      
      updateService: (id, updatedService) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id ? { ...service, ...updatedService } : service
          ),
        }));
        
        toast.success("Service updated successfully");
      },
      
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
        }));
        
        toast.success("Service deleted successfully");
      },
      
      checkServiceStatus: async (id) => {
        const service = get().services.find((s) => s.id === id);
        if (!service) return;
        
        try {
          const status = await checkStatus(service.mainUrl);
          set((state) => ({
            services: state.services.map((s) =>
              s.id === id
                ? { ...s, status, lastChecked: new Date() }
                : s
            ),
          }));
        } catch (error) {
          set((state) => ({
            services: state.services.map((s) =>
              s.id === id
                ? { ...s, status: "error", lastChecked: new Date() }
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
            return {
              ...service,
              status,
              lastChecked: new Date(),
            };
          } catch (error) {
            return {
              ...service,
              status: "error",
              lastChecked: new Date(),
            };
          }
        });
        
        const updatedServices = await Promise.all(checkPromises);
        set({ services: updatedServices });
        
        toast.success("All services checked");
      },
    }),
    {
      name: "service-store",
    }
  )
);
