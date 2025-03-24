
import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { toast } from "sonner";

// Connection URL
const uri = "mongodb://ernestodota2011:01a6ca8ce2223fe4b16c373ddd234172@5.189.151.27:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db | null = null;

/**
 * Connect to MongoDB and return the database instance
 * @returns Promise<Db>
 */
export async function connectToMongoDB(): Promise<Db> {
  try {
    // If we already have a connection, return it
    if (db) return db;
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get a reference to the database
    db = client.db("servicewatch");
    
    console.log("Connected to MongoDB successfully");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    toast.error("Failed to connect to the database");
    throw error;
  }
}

/**
 * Close the MongoDB connection
 */
export async function closeMongoDB() {
  try {
    if (client) {
      await client.close();
      db = null;
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

// Handle connection errors
process.on('SIGINT', async () => {
  await closeMongoDB();
  process.exit(0);
});

