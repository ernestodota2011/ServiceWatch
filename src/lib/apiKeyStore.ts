
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APIKey } from "@/types";
import { toast } from "sonner";

interface ApiKeyState {
  apiKeys: APIKey[];
  addApiKey: (name: string) => string;
  deleteApiKey: (id: string) => void;
}

// Helper to generate a random API key
const generateApiKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "sk_";
  let key = prefix;
  
  // Generate a 32 character random string
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return key;
};

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      apiKeys: [],
      
      addApiKey: (name) => {
        const key = generateApiKey();
        const newApiKey: APIKey = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          key,
          createdAt: new Date(),
        };
        
        set((state) => ({
          apiKeys: [...state.apiKeys, newApiKey],
        }));
        
        toast.success(`API key "${name}" created successfully`);
        return key;
      },
      
      deleteApiKey: (id) => {
        set((state) => ({
          apiKeys: state.apiKeys.filter((apiKey) => apiKey.id !== id),
        }));
        
        toast.success("API key deleted successfully");
      },
    }),
    {
      name: "api-key-store",
    }
  )
);
