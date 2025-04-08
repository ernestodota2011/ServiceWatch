import mongoose from 'mongoose';

export interface IService {
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  url: string;
  lastChecked?: Date;
  responseTime?: number;
  uptime: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new mongoose.Schema<IService>({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  url: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastChecked: { 
    type: Date 
  },
  responseTime: { 
    type: Number 
  },
  uptime: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true,
  collection: 'services'
});

const Service = mongoose.model<IService>('Service', ServiceSchema);

export default Service;