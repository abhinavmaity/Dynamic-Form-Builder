import axios from "axios";
import { FormResponse, UserData } from "../types/form";

// Try different API URLs in case one is down
const API_URLS = [
  "https://dynamic-form-generator-9rl7.onrender.com",
  "http://localhost:3000", // Fallback to local development server
];

const headers = {
  "Content-Type": "application/json",
};

const tryApiRequest = async (url: string, requestFn: () => Promise<any>) => {
  try {
    return await requestFn();
  } catch (error) {
    console.error(`Request failed for ${url}:`, error);
    throw error;
  }
};

export const createUser = async (userData: UserData) => {
  console.log("Starting user registration process...");
  console.log("User data:", userData);

  let lastError = null;

  for (const baseUrl of API_URLS) {
    try {
      console.log(`Attempting to create user at ${baseUrl}/create-user`);
      const response = await tryApiRequest(baseUrl, async () => {
        return await axios.post(`${baseUrl}/create-user`, userData, {
          headers,
        });
      });

      console.log("Create user response:", response.data);
      return response.data;
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error)) {
        console.error("API Error Details:", {
          url: `${baseUrl}/create-user`,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      // Continue to next URL if this one failed
    }
  }

  // If we get here, all URLs failed
  console.error("All API attempts failed:", lastError);
  throw new Error(
    "Failed to create user. Please check your connection and try again."
  );
};

export const getForm = async (rollNumber: string) => {
  console.log("Starting form fetch process...");
  console.log("Roll number:", rollNumber);

  let lastError = null;

  for (const baseUrl of API_URLS) {
    try {
      console.log(`Attempting to fetch form at ${baseUrl}/get-form`);
      const response = await tryApiRequest(baseUrl, async () => {
        return await axios.get<FormResponse>(`${baseUrl}/get-form`, {
          params: { rollNumber },
          headers,
        });
      });

      console.log("Get form response:", response.data);
      return response.data;
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error)) {
        console.error("API Error Details:", {
          url: `${baseUrl}/get-form`,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      // Continue to next URL if this one failed
    }
  }

  // If we get here, all URLs failed
  console.error("All API attempts failed:", lastError);
  throw new Error(
    "Failed to fetch form. Please check your connection and try again."
  );
};
