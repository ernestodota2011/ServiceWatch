import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://ernestodota2011:01a6ca8ce2223fe4b16c373ddd234172@mongodb:27017/servicewatch?authSource=admin';

class Database {
  private static instance: Database;
  public connection: mongoose.Connection;

  private constructor() {
    mongoose.set('strictQuery', true);
    this.connect();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: 'majority'
      });

      this.connection = mongoose.connection;

      this.connection.on('connected', () => {
        console.log('✅ MongoDB conectado exitosamente');
      });

      this.connection.on('error', (error) => {
        console.error('❌ Error de conexión a MongoDB:', error);
      });

      this.connection.on('disconnected', () => {
        console.warn('⚠️ Conexión a MongoDB desconectada');
      });
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      process.exit(1);
    }
  }

  public async disconnect() {
    await mongoose.disconnect();
  }
}

export default Database.getInstance();