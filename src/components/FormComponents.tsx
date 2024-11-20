import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FormField } from '../types/JSONSchema';

interface BaseInputProps {
  field: FormField;
  control: Control<any>;
  errors: FieldErrors;
}

// Reusable Error Message Component
const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => (
  error ? <span className="text-red-500 text-sm">{error}</span> : null
);

// Reusable Input Wrapper
const InputWrapper: React.FC<React.PropsWithChildren<{ 
  label: string; 
  error?: string; 
}>> = ({ label, children, error }) => (
  <div className="mb-4">
    <label className="block font-bold mb-1">{label}</label>
    {children}
    <ErrorMessage error={error} />
  </div>
);

// Text Input Component
const TextInput: React.FC<BaseInputProps> = ({ field, control, errors }) => {
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
    <InputWrapper 
      label={field.label} 
      error={errors[field.id]?.message as string}
    >
      <Controller
        name={field.id}
        control={control}
        rules={validationRules}
        render={({ field: inputField }) => (
          <input
            {...inputField}
            type={field.type}
            placeholder={field.placeholder}
            className={`border p-2 w-full ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
          />
        )}
      />
    </InputWrapper>
  );
};

// Select Input Component
const SelectInput: React.FC<BaseInputProps & { options: Array<{value: string, label: string}> }> = ({ 
  field, 
  control, 
  errors, 
  options 
}) => {
  const validationRules: any = field.required 
    ? { required: `${field.label} is required` } 
    : {};

  return (
    <InputWrapper 
      label={field.label} 
      error={errors[field.id]?.message as string}
    >
      <Controller
        name={field.id}
        control={control}
        rules={validationRules}
        render={({ field: inputField }) => (
          <select
            {...inputField}
            className={`border p-2 w-full ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </InputWrapper>
  );
};

// Radio Input Component
const RadioInput: React.FC<BaseInputProps & { options: Array<{value: string, label: string}> }> = ({ 
  field, 
  control, 
  errors, 
  options 
}) => {
  const validationRules: any = field.required 
    ? { required: `${field.label} is required` } 
    : {};

  return (
    <InputWrapper 
      label={field.label} 
      error={errors[field.id]?.message as string}
    >
      <Controller
        name={field.id}
        control={control}
        rules={validationRules}
        render={({ field: inputField }) => (
          <div>
            {options.map((option) => (
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
        )}
      />
    </InputWrapper>
  );
};

// Textarea Component
const TextareaInput: React.FC<BaseInputProps> = ({ field, control, errors }) => {
  const validationRules: any = field.required 
    ? { required: `${field.label} is required` } 
    : {};

  return (
    <InputWrapper 
      label={field.label} 
      error={errors[field.id]?.message as string}
    >
      <Controller
        name={field.id}
        control={control}
        rules={validationRules}
        render={({ field: inputField }) => (
          <textarea
            {...inputField}
            placeholder={field.placeholder}
            className={`border p-2 w-full ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
          />
        )}
      />
    </InputWrapper>
  );
};

export { TextInput, SelectInput, RadioInput, TextareaInput };