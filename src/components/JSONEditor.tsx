import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { validateJSONSchema } from "../utils/validateJSON";

interface JSONEditorProps {
  onChange: (valid: boolean, data: any) => void;
}

const JSONEditor: React.FC<JSONEditorProps> = ({ onChange }) => {
  const [json, setJson] = useState<string>("{}");
  const [error, setError] = useState<string | null>(null);
  

  const handleEditorChange = (value: string | undefined) => {
    const jsonValue = value || "";
    setJson(jsonValue);

    // Validate the JSON schema
    const { isValid, error, data } = validateJSONSchema(jsonValue);
    setError(error);
    onChange(isValid, data);
  };

  return (
    <div className="h-1/2 md:h-full flex flex-col p-4 border-r bg-gray-50">
      <h2 className="text-lg font-bold mb-2 text-gray-800">JSON Schema Editor</h2>
      <div className="flex-grow">
        <Editor
          height="100%"
          className="h-[50vh] md:h-[80vh]"
          language="json"
          theme="vs-dark"
          value={json}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
        
      </div>
       {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default JSONEditor;
