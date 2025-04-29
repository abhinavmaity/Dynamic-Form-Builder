import React, { useState } from "react";
import { createUser, getForm } from "../services/api";
import { UserData } from "../types/form";

interface LoginProps {
  onLoginSuccess: (formData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [userData, setUserData] = useState<UserData>({
    rollNumber: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    // Roll Number validation
    if (!userData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll Number is required";
    } else if (userData.rollNumber !== "RA2211031010088") {
      newErrors.rollNumber = "Invalid Roll Number";
    }

    // Name validation
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (userData.name.toLowerCase() !== "abhinav maity") {
      newErrors.name = "Invalid Name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(false);
    setApiError("");

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to login...");
      const formData = await getForm(userData.rollNumber);
      console.log("Login successful, form data:", formData);
      onLoginSuccess(formData);
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setApiError("");
    setSuccessMessage("");

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting registration process...");
      // First register the user
      const registrationResponse = await createUser(userData);
      console.log("Registration successful:", registrationResponse);

      // Then fetch their form
      const formData = await getForm(userData.rollNumber);
      console.log("Form fetch successful:", formData);

      // Show success message
      setSuccessMessage("Registration successful! You can now login.");

      // Clear any previous errors
      setErrors({});

      // Pass the form data to the parent component
      onLoginSuccess(formData);
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        "Registration failed. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Student Portal</h2>
      <p
        className="form-section-description"
        style={{ textAlign: "center", marginBottom: "1.5rem" }}
      >
        Please enter your details to login or register
      </p>
      <form>
        <div className="form-group">
          <label htmlFor="rollNumber" className="form-label">
            Roll Number (Use RA2211031010088){" "}
            <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={userData.rollNumber}
            onChange={handleChange}
            className={`form-input ${errors.rollNumber ? "error" : ""}`}
            placeholder="Enter Roll Number"
          />
          {errors.rollNumber && (
            <div className="error-message">{errors.rollNumber}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name (Use Abhinav Maity) <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="Enter Name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        {apiError && (
          <div className="error-message" style={{ marginBottom: "1rem" }}>
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="success-message" style={{ marginBottom: "1rem" }}>
            {successMessage}
          </div>
        )}
        <div
          className="form-actions"
          style={{ justifyContent: "space-between" }}
        >
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="button button-primary"
            style={{ flex: 1, marginRight: "0.5rem" }}
          >
            {isLoading && !isRegistering ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className="button button-secondary"
            style={{ flex: 1, marginLeft: "0.5rem" }}
          >
            {isLoading && isRegistering ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
