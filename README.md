# Dynamic JSON Form Generator

## Overview

A dynamic form creation tool that allows users to generate forms based on JSON schemas using React, React Hook Form, Monaco Editor, and Tailwind CSS.

## Features

- JSON-driven dynamic form generation
- JSON schema validation
- Custom form field types (text, email, textarea, select, radio)
- Client-side form validation
- Copy form data to clipboard
- Download form submissions as JSON
- Responsive design with Tailwind CSS

## Technologies Used

- React
- TypeScript
- React Hook Form
- @monaco-editor/react
- Tailwind CSS
- Jest (Testing)
- Playwright (E2E Testing)

## JSON Schema Types

The project defines flexible form field types in `types/JSONSchema.ts`:

```typescript
export interface FormFieldBase {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export interface SelectField extends FormFieldBase {
  type: 'select';
  options: Array<{value: string, label: string}>;
}

export interface RadioField extends FormFieldBase {
  type: 'radio';
  options: Array<{value: string, label: string}>;
}

export interface TextField extends FormFieldBase {
  type: 'text' | 'email' | 'textarea';
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export type FormField = SelectField | RadioField | TextField;

export interface FormSchema {
  formTitle: string;
  formDescription: string;
  fields: FormField[];
}
```

## JSON Schema Validation

The `validateJSONSchema` function ensures JSON inputs meet specific requirements:

- Validates top-level form properties
- Checks field types and required attributes
- Validates select and radio field options
- Supports custom validation for email fields

```typescript
const validateJSONSchema = (json: string) => {
  try {
    const data = JSON.parse(json);

    // Check for required top-level properties
    if (typeof data !== "object" || data === null) {
      return { isValid: false, error: "Root element must be an object", data: null };
    }

    if (!data.formTitle || typeof data.formTitle !== "string") {
      return { isValid: false, error: "Missing or invalid 'formTitle'", data: null };
    }

    if (!data.formDescription || typeof data.formDescription !== "string") {
      return { isValid: false, error: "Missing or invalid 'formDescription'", data: null };
    }

    if (!Array.isArray(data.fields)) {
      return { isValid: false, error: "'fields' must be an array", data: null };
    }

    // Validate each field
    for (const field of data.fields) {
      // Check required field properties
      if (!field.id || typeof field.id !== "string") {
        return { isValid: false, error: "Each field must have a valid 'id'", data: null };
      }

      if (!field.type || typeof field.type !== "string") {
        return { isValid: false, error: `Field '${field.id}' must have a valid 'type'`, data: null };
      }

      if (!field.label || typeof field.label !== "string") {
        return { isValid: false, error: `Field '${field.id}' must have a valid 'label'`, data: null };
      }

      // Validate options for select and radio types
      if ((field.type === "select" || field.type === "radio") && 
          (!Array.isArray(field.options) || field.options.length === 0)) {
        return { 
          isValid: false, 
          error: `Field '${field.id}' of type '${field.type}' must have non-empty 'options' array`, 
          data: null 
        };
      }

      // Optional validation for specific fields
      if (field.validation && field.type === "email") {
        if (!field.validation.pattern || typeof field.validation.pattern !== "string") {
          return { 
            isValid: false, 
            error: `Field '${field.id}' must have a valid validation pattern`, 
            data: null 
          };
        }
      }
    }

    // If everything is valid
    return { isValid: true, error: null, data };
  } catch (err) {
    return { isValid: false, error: "Invalid JSON format", data: null };
  }
};
```

## Custom Hooks

### useCopyData

Handles copying form submission data to clipboard:
- Validates input data
- Supports error handling
- Temporary "copied" state feedback

```typescript
export const useCopyData = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copyData = useCallback((data: any) => {
    // Reset previous errors
    setCopyError(null);

    // Validate input
    if (!data) {
      setCopyError("No data to copy");
      return;
    }

    // Ensure navigator.clipboard exists
    if (!navigator.clipboard) {
      setCopyError("Clipboard API not supported");
      console.error("Clipboard API is not available");
      return;
    }

    // Safely stringify data
    let stringData: string;
    try {
      stringData = JSON.stringify(data, null, 2);
    } catch (stringifyError) {
      setCopyError("Failed to stringify data");
      console.error("Stringify error:", stringifyError);
      return;
    }

    // Attempt to copy
    navigator.clipboard.writeText(stringData)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        const timeoutId = setTimeout(() => {
          setCopied(false);
          clearTimeout(timeoutId);
        }, 2000);
      })
      .catch((err) => {
        setCopyError("Failed to copy to clipboard");
        console.error('Clipboard copy error:', err);
      });
  }, []);

  return { 
    copyData, 
    copied, 
    copyError 
  };
};
```

### useDownloadData

Facilitates downloading form data as JSON:
- Generates unique filename
- Creates downloadable JSON blob
- Provides download status and error handling

```typescript
export const useDownloadData = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadData = useCallback((data: any, fileName?: string) => {
    // Reset previous errors
    setDownloadError(null);

    // Validate input
    if (!data) {
      setDownloadError("No data to download");
      return;
    }

    // Validate file name
    const safeFileName = fileName || 
      `form_submission_${new Date().toISOString().replace(/:/g, '-')}.json`;

    try {
      // Safely stringify data
      const jsonData = JSON.stringify(data, null, 2);
      
      // Create blob
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = safeFileName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Set downloaded state
      setDownloaded(true);
      
      // Reset downloaded state after 2 seconds
      const timeoutId = setTimeout(() => {
        setDownloaded(false);
        clearTimeout(timeoutId);
      }, 2000);

    } catch (error) {
      setDownloadError("Failed to download data");
      console.error('Download error:', error);
    }
  }, []);

  return { 
    downloadData, 
    downloaded, 
    downloadError 
  };
};

```

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Tharun-Balaji/json-form-editor.git
   cd json-form-editor
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm start
   ```

## Usage

1. Use the Monaco Editor to input a JSON schema
2. Validate the schema
3. Generate a dynamic form
4. Fill out and submit the form
5. Copy or download form submission data

### JSON Schema Example

```json
{
  "formTitle": "Project Requirements Survey",
  "formDescription": "Please fill out this survey about your project needs",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "validation": {
        "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      }
    }
  ]
}
```

## Testing

- Run unit tests: `npm test`
- Run E2E tests: `npx playwright test`

## Project Structure

```
json-form-editor/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── FormComponents.tsx
│   │   ├── DynamicFormGenerator.tsx
│   │   └── JSONEditor.tsx
│   │
│   ├── hooks/
│   │   ├── useCopyData.ts
│   │   └── useDownloadData.ts
│   │
│   ├── types/
│   │   └── JSONSchema.ts
│   │
│   ├── utils/
│   │   └── validateJSONSchema.ts
│   │
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
│
├── tests/
│   	├── form-generation.spec.ts
│  		├──form-validation.spec.ts
│ 
│ 
├── __tests__/
│   	├── jsonValidation.test.ts
│   	├──\hook.test.ts
│ 
│
├── config/
│   ├── jest.config.js
│	├── playwright.config.js
│   └── tailwind.config.js
│
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

### Directory Breakdown

- **`public/`**: Static assets and HTML template
- **`src/components/`**: Reusable React components
  - `FormComponents.tsx`: Inputs like text, select, radio
  - `DynamicFormGenerator.tsx`: Main form generation logic
  - `JSONEditor.tsx`: Monaco-based JSON editor
- **`src/hooks/`**: Custom React hooks
  - `useCopyData.ts`: Clipboard copy functionality
  - `useDownloadData.ts`: JSON file download
- **`src/types/`**: TypeScript type definitions
- **`src/utils/`**: Utility functions like JSON validation
- **`tests/`**:  Playwright end-to-end tests
- **`__tests__/`**: Component and function tests
- **`config/`**: Configuration files for tools


## Deployment

Deployed on Netlify: https://animated-licorice-6f6e13.netlify.app/

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




## Contact

Tharun Balaji - [tharunbalaji110@gmail.com]

Project Link: [https://github.com/Tharun-Balaji/json-form-editor](https://github.com/Tharun-Balaji/json-form-editor)