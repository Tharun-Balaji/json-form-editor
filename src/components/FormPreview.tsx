import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema } from '../types/JSONSchema';
import { 
  TextInput, 
  SelectInput, 
  RadioInput, 
  TextareaInput 
} from './FormComponents';
import { Copy, Check, Download, X } from 'lucide-react';

interface FormPreviewProps {
  schema: FormSchema | null;
  onSubmit?: (data: any) => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema, onSubmit: customOnSubmit }) => {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm();
  const [copied, setCopied] = useState(false);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const defaultOnSubmit = (data: any) => {
    console.log("Form Data: ", data);
    setSubmissionData(data);
  };

  const handleFormSubmit = (data: any) => {
    if (customOnSubmit) {
      customOnSubmit(data);
    }
    defaultOnSubmit(data);
  };

  const handleCopyFormData = () => {
    if (!submissionData) return;
    
    navigator.clipboard.writeText(JSON.stringify(submissionData, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy form data:', err);
      });
  };

  const handleDownloadFormData = () => {
    if (!submissionData) return;
    
    const blob = new Blob([JSON.stringify(submissionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema?.formTitle?.replace(/\s+/g, '_') || 'form_submission'}_${new Date().toISOString().replace(/:/g, '-')}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    setDownloadClicked(true);
    setTimeout(() => setDownloadClicked(false), 2000);
  };

  const closeModal = () => {
    setSubmissionData(null);
  };

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
    <>
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{schema.formTitle}</h2>
        <p className="text-gray-600 mb-4">{schema.formDescription}</p>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {schema.fields.map(renderField)}
          
          <div className="flex space-x-2 mt-4">
            <button 
              type="submit" 
              className="flex-grow bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
          </form>
          
      </div>

      {submissionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-4 text-green-600">Submission Successful!</h2>
            <p className="mb-4 text-gray-700">Your form has been submitted. Would you like to:</p>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleCopyFormData}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                <span className="ml-2">Copy Data</span>
              </button>
              
              <button 
                onClick={handleDownloadFormData}
                className="flex-1 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 flex items-center justify-center"
              >
                {downloadClicked ? <Check size={20} /> : <Download size={20} />}
                <span className="ml-2">Download</span>
              </button>
            </div>
            
            <details className="mt-4 border-t pt-2">
              <summary className="cursor-pointer text-gray-600">View Submission Data</summary>
              <pre className="bg-gray-100 p-2 rounded mt-2 max-h-40 overflow-auto text-sm">
                {JSON.stringify(submissionData, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </>
  );
};

export default FormPreview;