
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APIKey, APIKeyDocument } from "@/types";
import { toast } from "sonner";
import { connectToMongoDB } from "./mongodb";
import { ObjectId } from "mongodb";

interface ApiKeyState {
  apiKeys: APIKey[];
  isLoading: boolean;
  error: string | null;
  loadApiKeys: () => Promise<void>;
  addApiKey: (name: string) => Promise<string>;
  deleteApiKey: (id: string) => Promise<void>;
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

// Helper function to convert MongoDB document to APIKey type
const documentToApiKey = (doc: APIKeyDocument): APIKey => ({
  id: doc._id,
  name: doc.name,
  key: doc.key,
  createdAt: doc.createdAt,
});

export const useApiKeyStore = create<ApiKeyState>()((set, get) => ({
  apiKeys: [],
  isLoading: false,
  error: null,
  
  loadApiKeys: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('apikeys');
      
      // Fetch existing API keys
      const apiKeys = await collection.find({}).toArray();
      set({ 
        apiKeys: apiKeys.map(documentToApiKey),
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to load API keys:", error);
      set({ 
        error: "Failed to load API keys from database",
        apiKeys: [],
        isLoading: false 
      });
      toast.error("Failed to load API keys from database");
    }
  },
  
  addApiKey: async (name) => {
    try {
      const key = generateApiKey();
      
      const db = await connectToMongoDB();
      const collection = db.collection('apikeys');
      
      const newApiKey: Omit<APIKeyDocument, '_id'> = {
        name,
        key,
        createdAt: new Date(),
      };
      
      const result = await collection.insertOne(newApiKey as any);
      
      if (result.acknowledged) {
        const insertedApiKey: APIKey = {
          id: result.insertedId.toString(),
          ...newApiKey,
        };
        
        set((state) => ({
          apiKeys: [...state.apiKeys, insertedApiKey],
        }));
        
        toast.success(`API key "${name}" created successfully`);
        return key;
      }
      
      throw new Error("Failed to add API key");
    } catch (error) {
      console.error("Failed to add API key:", error);
      toast.error("Failed to add API key to database");
      return "";
    }
  },
  
  deleteApiKey: async (id) => {
    try {
      const db = await connectToMongoDB();
      const collection = db.collection('apikeys');
      
      const result = await collection.deleteOne({ _id: id });
      
      if (result.deletedCount > 0) {
        set((state) => ({
          apiKeys: state.apiKeys.filter((apiKey) => apiKey.id !== id),
        }));
        
        toast.success("API key deleted successfully");
      } else {
        toast.error("API key not found");
      }
    } catch (error) {
      console.error("Failed to delete API key:", error);
      toast.error("Failed to delete API key from database");
    }
  },
}));
