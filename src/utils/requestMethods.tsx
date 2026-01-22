
import axios from "axios";
import type { AxiosInstance } from "axios";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL: string | undefined = import.meta.env.VITE_APP_API_BASE_URL;

export const publicRequest: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const useUserRequest = (): AxiosInstance | null => {
  const [authState] = useContext<any>(AuthContext);
  const TOKEN: string | undefined = authState?.user?.token;

  if (TOKEN) {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  } else {
    return null;
  }
};

export const useFileRequest = (): AxiosInstance | null => {
  const [authState] = useContext<any>(AuthContext);
  const TOKEN: string | undefined = authState?.user?.token;

  if (TOKEN) {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return null;
  }
};
