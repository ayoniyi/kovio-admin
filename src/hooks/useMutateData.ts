"use client";

import { useMutation } from "@tanstack/react-query";
import { post,  del, put, patch } from "@/utilities/apiclient";
import { useState } from "react";

interface UseMutateProps<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  url: string;
  method: "POST" | "PUT" | "DELETE" | "PATCH";
}

const useMutateData = <T>({
  onSuccess,
  onError,
  url,
  method,
}: UseMutateProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation<T, Error, { [key: string]: any }>({
    mutationFn: async (payload?: { [key: string]: any }) => {
      setIsLoading(true);
      let response;

      switch (method) {
        case "PUT":
          response = await put<T>(url, payload || {});
          break;
        case "DELETE":
          response = await del<T>(url, payload || {});
          break;
        case "POST":
          response = await post<T>(url, payload || {});
          break;
        case "PATCH":
          response = await patch<T>(url, payload || {});
          break;
        default:
          response = await post<T>(url, payload || {});
          break;
      }

      return response;
    },
    onSuccess: (data) => {
      setIsLoading(false);

      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      setIsLoading(false);

      if (onError) {
        onError(error);
      }
    },
  });

  const { mutate } = mutation;

  return {
    mutate,
    isLoading,
  };
};

export default useMutateData;
