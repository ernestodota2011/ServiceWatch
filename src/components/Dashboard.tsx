
import { useState, useEffect } from "react";
import { Service, ServiceStatus, ServiceCategory } from "@/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DashboardProps {
  services: Service[];
}

export function Dashboard({ services }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "categories">("overview");

  // Calculate stats
  const totalServices = services.length;
  const onlineServices = services.filter(s => s.status === "online").length;
  const offlineServices = services.filter(s => s.status === "offline").length;
  const errorServices = services.filter(s => s.status === "error").length;
  
  const onlinePercentage = totalServices > 0 ? (onlineServices / totalServices) * 100 : 0;
  const offlinePercentage = totalServices > 0 ? (offlineServices / totalServices) * 100 : 0;
  const errorPercentage = totalServices > 0 ? (errorServices / totalServices) * 100 : 0;

  // Data for pie chart
  const statusData = [
    { name: "Online", value: onlineServices, color: "hsl(var(--success))" },
    { name: "Offline", value: offlineServices, color: "hsl(var(--destructive))" },
    { name: "Error", value: errorServices, color: "hsl(var(--warning))" },
  ].filter(item => item.value > 0);

  // Group services by category
  const servicesByCategory: Record<ServiceCategory | "uncategorized", Service[]> = {
    infrastructure: [],
    api: [],
    frontend: [],
    backend: [],
    database: [],
    monitoring: [],
    other: [],
    uncategorized: []
  };

  services.forEach(service => {
    const category = service.category || "uncategorized";
    servicesByCategory[category].push(service);
  });

  // Prepare category data for chart
  const categoryData = Object.entries(servicesByCategory)
    .map(([category, services]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: services.length,
      color: getCategoryColor(category as ServiceCategory | "uncategorized")
    }))
    .filter(item => item.value > 0);

  function getCategoryColor(category: ServiceCategory | "uncategorized"): string {
    const colors: Record<ServiceCategory | "uncategorized", string> = {
      infrastructure: "#60a5fa", // blue
      api: "#10b981", // green
      frontend: "#f87171", // red
      backend: "#8b5cf6", // purple
      database: "#f59e0b", // amber
      monitoring: "#ec4899", // pink
      other: "#6b7280", // gray
      uncategorized: "#d1d5db" // light gray
    };
    return colors[category];
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "overview" | "categories")} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-success" />
                <span className="text-xl font-semibold">{onlineServices}</span>
                <span className="text-muted-foreground">Online</span>
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <XCircle className="h-6 w-6 text-destructive" />
                <span className="text-xl font-semibold">{offlineServices}</span>
                <span className="text-muted-foreground">Offline</span>
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span className="text-xl font-semibold">{errorServices}</span>
                <span className="text-muted-foreground">Error</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Online</span>
                <span className="text-sm text-muted-foreground">{onlinePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={onlinePercentage} className="h-2 bg-muted" indicatorColor="bg-success" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Offline</span>
                <span className="text-sm text-muted-foreground">{offlinePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={offlinePercentage} className="h-2 bg-muted" indicatorColor="bg-destructive" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Error</span>
                <span className="text-sm text-muted-foreground">{errorPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={errorPercentage} className="h-2 bg-muted" indicatorColor="bg-warning" />
            </div>
          </div>

          {totalServices > 0 && (
            <div className="mt-6 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={statusData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(servicesByCategory).map(([category, services]) => {
              if (services.length === 0) return null;
              const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
              const onlineCount = services.filter(s => s.status === "online").length;
              const percentage = (onlineCount / services.length) * 100;
              
              return (
                <div key={category} className="bg-card p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">{displayCategory}</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{services.length} services</span>
                    <span>{percentage.toFixed(0)}% online</span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-muted" indicatorColor="bg-success" />
                </div>
              );
            })}
          </div>

          {totalServices > 0 && (
            <div className="mt-6 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
