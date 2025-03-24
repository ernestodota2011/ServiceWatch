
export type ServiceStatus = "online" | "offline" | "error";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  mainUrl: string;
  apiUrl?: string;
  webhookUrl?: string;
  lastChecked?: Date;
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

// These types are no longer needed since we're using a mock implementation
// We're removing them to simplify our code
