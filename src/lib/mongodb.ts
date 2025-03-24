
import { toast } from "sonner";
import { Service, APIKey } from "@/types";

// Mock database collections
let servicesCollection: any[] = [];
let apiKeysCollection: any[] = [];

// Mock MongoDB database interface
class MockDb {
  collection(name: string) {
    if (name === 'services') {
      return getMockCollection(servicesCollection);
    } else if (name === 'apikeys') {
      return getMockCollection(apiKeysCollection);
    }
    return getMockCollection([]);
  }
}

// Create a mock MongoDB collection with basic methods
function getMockCollection(data: any[]) {
  return {
    find: () => ({
      toArray: async () => data
    }),
    findOne: async (query: any) => {
      const id = query._id;
      return data.find(item => item._id === id);
    },
    insertOne: async (doc: any) => {
      if (!doc._id) {
        doc._id = generateId();
      }
      data.push(doc);
      return {
        acknowledged: true,
        insertedId: doc._id
      };
    },
    insertMany: async (docs: any[]) => {
      docs.forEach(doc => {
        if (!doc._id) {
          doc._id = generateId();
        }
        data.push(doc);
      });
      return {
        acknowledged: true,
        insertedCount: docs.length
      };
    },
    updateOne: async (query: any, update: any) => {
      const id = query._id;
      const index = data.findIndex(item => item._id === id);
      if (index !== -1) {
        // Apply $set update operator
        if (update.$set) {
          data[index] = { ...data[index], ...update.$set };
        }
        return {
          acknowledged: true,
          matchedCount: 1,
          modifiedCount: 1
        };
      }
      return {
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0
      };
    },
    deleteOne: async (query: any) => {
      const id = query._id;
      const initialLength = data.length;
      const filteredData = data.filter(item => item._id !== id);
      data.length = 0;
      data.push(...filteredData);
      return {
        acknowledged: true,
        deletedCount: initialLength - data.length
      };
    },
    countDocuments: async () => data.length
  };
}

// Mock database instance
let mockDb: MockDb | null = null;

// Helper function to generate IDs
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Connect to mock MongoDB and return the database instance
 * @returns Promise<MockDb>
 */
export async function connectToMongoDB(): Promise<MockDb> {
  try {
    // If we already have a connection, return it
    if (mockDb) return mockDb;
    
    // Create a new mock database instance
    mockDb = new MockDb();
    
    console.log("Connected to Mock MongoDB successfully");
    return mockDb;
  } catch (error) {
    console.error("Failed to connect to Mock MongoDB:", error);
    toast.error("Failed to connect to the database");
    throw error;
  }
}

/**
 * Close the MongoDB connection
 */
export async function closeMongoDB() {
  try {
    mockDb = null;
    console.log("Mock MongoDB connection closed");
  } catch (error) {
    console.error("Error closing Mock MongoDB connection:", error);
  }
}

// Handle connection errors
process.on('SIGINT', async () => {
  await closeMongoDB();
  process.exit(0);
});
