import React, { useState } from "react";
import { FormResponse, FormSection, FormField, FormData } from "../types/form";

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");

  const validateField = (field: FormField, value: string | string[]) => {
    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return field.validation?.message || `${field.label} is required`;
    }

    if (
      field.minLength &&
      typeof value === "string" &&
      value.length < field.minLength
    ) {
      return `Minimum length should be ${field.minLength}`;
    }

    if (
      field.maxLength &&
      typeof value === "string" &&
      value.length > field.maxLength
    ) {
      return `Maximum length should be ${field.maxLength}`;
    }

    return "";
  };

  const validateSection = (section: FormSection) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const error = validateField(field, formValues[field.fieldId] || "");
      if (error) {
        newErrors[field.fieldId] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const handleNext = () => {
    const currentSectionData = formData.form.sections[currentSection];
    if (validateSection(currentSectionData)) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const currentSectionData = formData.form.sections[currentSection];
    if (validateSection(currentSectionData)) {
      console.log("Form Data:", formValues);
      setSuccess("Form submitted successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.fieldId] || "";
    const error = errors[field.fieldId];

    switch (field.type) {
      case "text":
      case "tel":
      case "email":
      case "date":
        return (
          <div className="form-group">
            <label htmlFor={field.fieldId} className="form-label">
              {field.label}{" "}
              {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <input
              type={field.type}
              id={field.fieldId}
              value={value as string}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder}
              data-testid={field.dataTestId}
              className={`form-input ${error ? "error" : ""}`}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "textarea":
        return (
          <div className="form-group">
            <label htmlFor={field.fieldId} className="form-label">
              {field.label}{" "}
              {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <textarea
              id={field.fieldId}
              value={value as string}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder}
              data-testid={field.dataTestId}
              className={`form-input ${error ? "error" : ""}`}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "dropdown":
        return (
          <div className="form-group">
            <label htmlFor={field.fieldId} className="form-label">
              {field.label}{" "}
              {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <select
              id={field.fieldId}
              value={value as string}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              data-testid={field.dataTestId}
              className={`form-input ${error ? "error" : ""}`}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "radio":
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label}{" "}
              {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <div className="radio-group">
              {field.options?.map((option) => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name={field.fieldId}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) =>
                      handleFieldChange(field.fieldId, e.target.value)
                    }
                    data-testid={option.dataTestId}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "checkbox":
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label}{" "}
              {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <div className="checkbox-group">
              {field.options?.map((option) => (
                <label key={option.value} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={(value as string[]).includes(option.value)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(value as string[]), option.value]
                        : (value as string[]).filter((v) => v !== option.value);
                      handleFieldChange(field.fieldId, newValue);
                    }}
                    data-testid={option.dataTestId}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  const currentSectionData = formData.form.sections[currentSection];
  const isLastSection = currentSection === formData.form.sections.length - 1;

  return (
    <div className="form-container">
      <h1 className="form-title">{formData.form.formTitle}</h1>
      <div className="form-section">
        <h2 className="form-section-title">{currentSectionData.title}</h2>
        <p className="form-section-description">
          {currentSectionData.description}
        </p>

        {currentSectionData.fields.map((field) => (
          <div key={field.fieldId}>{renderField(field)}</div>
        ))}

        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          {currentSection > 0 && (
            <button
              onClick={handlePrevious}
              className="button button-secondary"
            >
              Previous
            </button>
          )}
          {!isLastSection ? (
            <button onClick={handleNext} className="button button-primary">
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="button button-primary"
              style={{ backgroundColor: "#059669" }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
