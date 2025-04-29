import { useState } from "react";
import { FormField as FormFieldType } from "../types";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error?: string;
}

const FormField = ({ field, value, onChange, error }: FormFieldProps) => {
  const {
    fieldId,
    type,
    label,
    placeholder,
    required,
    dataTestId,
    options,
  } = field;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === "checkbox" 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    onChange(fieldId, newValue);
  };

  const renderField = () => {
    switch (type) {
      case "text":
      case "tel":
      case "email":
      case "date":
        return (
          <input
            type={type}
            id={fieldId}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            data-testid={dataTestId}
            required={required}
          />
        );
      
      case "textarea":
        return (
          <textarea
            id={fieldId}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            data-testid={dataTestId}
            required={required}
            rows={4}
          />
        );

      case "dropdown":
        return (
          <select
            id={fieldId}
            value={value || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            data-testid={dataTestId}
            required={required}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${fieldId}-${option.value}`}
                  name={fieldId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  data-testid={option.dataTestId}
                  required={required}
                />
                <label 
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={fieldId}
              checked={value || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              data-testid={dataTestId}
              required={required}
            />
            <label 
              htmlFor={fieldId}
              className="ml-2 text-gray-700"
            >
              {label}
            </label>
          </div>
        );
        
      default:
        return <p className="text-red-500">Unsupported field type: {type}</p>;
    }
  };

  return (
    <div className="mb-4">
      {type !== "checkbox" && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;