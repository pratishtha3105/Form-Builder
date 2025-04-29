import { FormSection as FormSectionType, FormField as FormFieldType, FormData, FormErrors } from "../types";
import FormField from "./FormField";
import { validateField } from "../utils/validation";

interface FormSectionProps {
  section: FormSectionType;
  formData: FormData;
  onChange: (fieldId: string, value: any) => void;
  errors: FormErrors;
  currentSection: number;
  totalSections: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const FormSection = ({
  section,
  formData,
  onChange,
  errors,
  currentSection,
  totalSections,
  onNext,
  onPrev,
  onSubmit,
}: FormSectionProps) => {
  const { sectionId, title, description, fields } = section;
  const isFirstSection = sectionId === 1;
  const isLastSection = sectionId === totalSections;

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange(fieldId, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500">
            Section {sectionId} of {totalSections}
          </span>
        </div>
        
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentSection / totalSections) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={formData[field.fieldId]}
            onChange={handleFieldChange}
            error={errors[field.fieldId]}
          />
        ))}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstSection}
          className={`px-4 py-2 rounded-md ${
            isFirstSection
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          Previous
        </button>

        {isLastSection ? (
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormSection;