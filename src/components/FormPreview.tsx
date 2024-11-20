import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormField, FormSchema } from '../types/JSONSchema';

interface FormPreviewProps {
  schema: FormSchema | null;
  onSubmit?: (data: any) => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema, onSubmit: customOnSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const defaultOnSubmit = (data: any) => {
    console.log("Form Data: ", data);
  };

  const handleFormSubmit = customOnSubmit || defaultOnSubmit;

  if (!schema) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Enter a valid JSON schema to generate a form.
      </div>
    );
  }

  const renderField = (field: FormField) => {
    const validationRules: any = {};

    if (field.required) {
      validationRules.required = `${field.label} is required`;
    }

    if ('validation' in field && field.validation?.pattern) {
      validationRules.pattern = {
        value: new RegExp(field.validation.pattern),
        message: field.validation.message || 'Invalid input'
      };
    }

    return (
      <div key={field.id} className="mb-4">
        <label className="block font-bold mb-1">{field.label}</label>

        <Controller
          name={field.id}
          control={control}
          rules={validationRules}
          render={({ field: inputField }) => {
            switch (field.type) {
              case 'select':
                return (
                  <select
                    {...inputField}
                    // placeholder={field.placeholder}
                    className={`border p-2 w-full ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">{field.placeholder || `Select ${field.label}`}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                );

              case 'radio':
                return (
                  <div>
                    {field.options.map((option) => (
                      <label key={option.value} className="inline-flex items-center mr-4">
                        <input
                          type="radio"
                          {...inputField}
                          value={option.value}
                          checked={inputField.value === option.value}
                          onChange={(e) => inputField.onChange(e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                );

              case 'textarea':
                return (
                  <textarea
                    {...inputField}
                    placeholder={field.placeholder}
                    className={`border p-2 w-full ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                );

              default:
                return (
                  <input
                    {...inputField}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`border p-2 w-full ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                );
            }
          }}
        />

        {errors[field.id] && (
          <span className="text-red-500 text-sm">
            {errors[field.id]?.message as string}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{schema.formTitle}</h2>
      <p className="text-gray-600 mb-4">{schema.formDescription}</p>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {schema.fields.map(renderField)}
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 mt-4 w-full rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPreview;