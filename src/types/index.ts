
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
