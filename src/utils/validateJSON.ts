export const validateJSONSchema = (json: string) => {
  try {
    const data = JSON.parse(json);

    // Check for required top-level properties
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return { isValid: false, error: "Root element must be an object", data: null };
    }

    if (!data.formTitle || typeof data.formTitle !== "string") {
      return { isValid: false, error: "Missing or invalid 'formTitle'", data: null };
    }

    if (!data.formDescription || typeof data.formDescription !== "string") {
      return { isValid: false, error: "Missing or invalid 'formDescription'", data: null };
    }

    if (Array.isArray(data.fields) && data.fields.length === 0) { 
      return { isValid: false, error: "Missing or invalid 'fields'", data: null };
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