import React from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema } from '../types/JSONSchema';
import { 
  TextInput, 
  SelectInput, 
  RadioInput, 
  TextareaInput 
} from './FormComponents';

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

  const renderField = (field: any) => {
    switch (field.type) {
      case 'select':
        return (
          <SelectInput 
            key={field.id} 
            field={field} 
            control={control} 
            errors={errors}
            options={field.options}
          />
        );
      case 'radio':
        return (
          <RadioInput 
            key={field.id} 
            field={field} 
            control={control} 
            errors={errors}
            options={field.options}
          />
        );
      case 'textarea':
        return (
          <TextareaInput 
            key={field.id} 
            field={field} 
            control={control} 
            errors={errors}
          />
        );
      default:
        return (
          <TextInput 
            key={field.id} 
            field={field} 
            control={control} 
            errors={errors}
          />
        );
    }
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