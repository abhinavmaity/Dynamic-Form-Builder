import axios from "axios";
import { FormResponse, UserData } from "../types/form";

const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

const headers = {
  "Content-Type": "application/json",
};

export const createUser = async (userData: UserData) => {
  try {
    console.log("Attempting to create user with data:", userData);
    const response = await axios.post(`${API_BASE_URL}/create-user`, userData, {
      headers,
    });
    console.log("Create user response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

export const getForm = async (rollNumber: string) => {
  try {
    console.log("Attempting to fetch form for roll number:", rollNumber);
    const response = await axios.get<FormResponse>(`${API_BASE_URL}/get-form`, {
      params: { rollNumber },
      headers,
    });
    console.log("Get form response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
