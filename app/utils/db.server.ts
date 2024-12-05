import { MongoClient } from 'mongodb';

let db: MongoClient;

declare global {
  var __db: MongoClient | undefined;
}

async function connect() {
  console.log("Attempting to connect to MongoDB...");
  
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    throw new Error('MONGODB_URI is required');
  }

  try {
    if (process.env.NODE_ENV === 'production') {
      console.log("Connecting in production mode...");
      db = await MongoClient.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 60000,
        connectTimeoutMS: 30000,
      });
      console.log("Successfully connected to MongoDB in production");
      return db;
    }

    if (!global.__db) {
      console.log("Creating new development connection...");
      global.__db = await MongoClient.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 60000,
        connectTimeoutMS: 30000,
      });
      console.log("Successfully connected to MongoDB in development");
    } else {
      console.log("Using existing development connection");
    }
    db = global.__db;
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export { connect };

export async function getDb() {
  try {
    if (!db) {
      console.log("No existing connection, connecting to MongoDB...");
      await connect();
    }
    
    // Test the connection
    await db.db().command({ ping: 1 });
    console.log("MongoDB connection is valid");
    
    return db;
  } catch (error) {
    console.error("Error getting MongoDB connection:", error);
    // Try to reconnect
    console.log("Attempting to reconnect...");
    await connect();
    return db;
  }
}

export async function closeDb() {
  try {
    if (db) {
      console.log("Closing MongoDB connection...");
      await db.close();
      db = undefined as any;
      console.log("MongoDB connection closed successfully");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
}

// Ensure connection is closed when the process exits
process.on('beforeExit', async () => {
  await closeDb();
});
