import { useState, useEffect } from "react";
import { FormResponse, FormData, FormErrors, User, FormSection as FormSectionType } from "../types";
import { getForm } from "../services/api";
import FormSection from "./FormSection";
import { validateSection, isSectionValid } from "../utils/validation";

interface DynamicFormProps {
  user: User;
  onLogout: () => void;
}

const DynamicForm = ({ user, onLogout }: DynamicFormProps) => {
  const [formResponse, setFormResponse] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getForm(user.rollNumber);
        
        if (response) {
          setFormResponse(response);
        } else {
          setError("Failed to fetch form data. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while fetching the form.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [user.rollNumber]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));

    // Clear error for the field when it changes
    if (errors[fieldId]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNextSection = () => {
    if (!formResponse) return;
    
    const currentSection = formResponse.form.sections[currentSectionIndex];
    const sectionErrors = validateSection(currentSection, formData);
    
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      return;
    }

    // Clear errors and move to next section
    setErrors({});
    setCurrentSectionIndex((prev) => prev + 1);
  };

  const handlePrevSection = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    if (!formResponse) return;
    
    const currentSection = formResponse.form.sections[currentSectionIndex];
    const sectionErrors = validateSection(currentSection, formData);
    
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      return;
    }

    // If all validations pass, console log the form data
    console.log("Form submitted with data:", formData);
    
    // Show success message
    alert("Form submitted successfully!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          onClick={onLogout}
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (!formResponse) {
    return (
      <div className="text-center">
        <p className="text-gray-700">No form data available.</p>
        <button 
          className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={onLogout}
        >
          Back to Login
        </button>
      </div>
    );
  }

  const { form } = formResponse;
  const currentSection = form.sections[currentSectionIndex];

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{form.formTitle}</h1>
          <p className="text-sm text-gray-500">Version: {form.version}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          <p className="text-xs text-gray-500">Roll: {user.rollNumber}</p>
          <button
            onClick={onLogout}
            className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
          >
            Logout
          </button>
        </div>
      </div>

      <FormSection
        section={currentSection}
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
        currentSection={currentSectionIndex + 1}
        totalSections={form.sections.length}
        onNext={handleNextSection}
        onPrev={handlePrevSection}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DynamicForm;