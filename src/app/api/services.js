// src/lib/api/services.js
import { useQuery } from "@tanstack/react-query";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
