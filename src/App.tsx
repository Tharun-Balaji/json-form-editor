import React, { useState } from "react";
import JSONEditor from "./components/JSONEditor";
import FormPreview from "./components/FormPreview";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  const [formSchema, setFormSchema] = useState<any>(null);

  const handleJSONChange = (isValid: boolean, data: any) => {
    if (isValid) {
      setFormSchema(data);
    } else {
      setFormSchema(null);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <ErrorBoundary>
        <div className="md:w-1/2 md:max-h-[95vh] h-[10vh]  border-r border-gray-300">
          <JSONEditor onChange={handleJSONChange} />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <div className=" mt-[350px] md:mt-0 md:w-1/2 md:h-full p-4 overflow-auto">
          <FormPreview schema={formSchema} />
        </div>
        </ErrorBoundary>

    </div>
  );
};

export default App;
