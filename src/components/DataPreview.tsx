import { Check, Copy, Download, Eye, X } from "lucide-react";
import { useState } from "react";
import { useCopyData, useDownloadData } from "../hooks/FormSubmission";


interface DataPreviewProps {
  data: any;
  className?: string;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${className}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-500 hover:text-blue-600"
      >
        <Eye size={16} className="mr-2" />
        {isExpanded ? 'Hide' : 'Preview'} Data
      </button>
      
      {isExpanded && (
        <div className="mt-2">
          <pre className="bg-gray-100 p-2 rounded max-h-60 overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Copy Button Component
interface CopyButtonProps {
  data: any;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ data, className }) => {
  const { copyData, copied, copyError } = useCopyData();

  return (
    <>
      <button 
        onClick={() => copyData(data)}
        className={`flex items-center ${className}`}
        disabled={copied}
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
        <span className="ml-2">
          {copied ? 'Copied!' : (copyError || 'Copy Data')}
        </span>
      </button>
      {copyError && (
        <div className="text-red-500 text-sm mt-1">
          {copyError}
        </div>
      )}
    </>
  );
};


// Download Button Component
interface DownloadButtonProps {
  data: any;
  fileName?: string;
  className?: string;
}


export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  data, 
  fileName, 
  className 
}) => {
  const { downloadData, downloaded, downloadError } = useDownloadData();

  return (
    <>
      <button 
        onClick={() => downloadData(data, fileName)}
        className={`flex items-center ${className}`}
        disabled={downloaded}
      >
        {downloaded ? <Check size={20} /> : <Download size={20} />}
        <span className="ml-2">
          {downloaded ? 'Downloaded!' : (downloadError || 'Download Data')}
        </span>
      </button>
      {downloadError && (
        <div className="text-red-500 text-sm mt-1">
          {downloadError}
        </div>
      )}
    </>
  );
};

// Submission Modal Component
interface SubmissionModalProps {
  data: any;
  onClose: () => void;
  formTitle?: string;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ 
  data, 
  onClose, 
  formTitle 
}) => {
  const fileName = formTitle 
    ? `${formTitle.replace(/\s+/g, '_')}_${new Date().toISOString().replace(/:/g, '-')}.json`
    : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-green-600">Submission Successful!</h2>
        <p className="mb-4 text-gray-700">Your form has been submitted. Would you like to:</p>
        
        <div className="flex space-x-2 mb-4">
          <CopyButton 
            data={data} 
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 justify-center" 
          />
          
          <DownloadButton 
            data={data} 
            fileName={fileName}
            className="flex-1 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 justify-center" 
          />
        </div>
        
        <DataPreview 
          data={data} 
          className="border-t pt-2" 
        />
      </div>
    </div>
  );
};