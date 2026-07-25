"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeRequest } from "@/lib/api/auth";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await getMeRequest();
      if (!response.success || !response.user) {
        throw new Error(response.message || "Unauthorized");
      }
      return response.user;
    },
    retry: false,
  });
}
