
export type ServiceStatus = "online" | "offline" | "error";
export type ServiceCategory = "infrastructure" | "api" | "frontend" | "backend" | "database" | "monitoring" | "other";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  mainUrl: string;
  apiUrl?: string;
  webhookUrl?: string;
  lastChecked?: Date;
  category?: ServiceCategory;
  isFavorite?: boolean;
  statusHistory?: Array<{
    status: ServiceStatus;
    timestamp: Date;
  }>;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
}

export interface ThemeConfig {
  theme: "light" | "dark" | "system";
}

