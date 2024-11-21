import { validateJSONSchema } from '../src/utils/validateJSON';

describe('JSON Validation', () => {
  test('valid JSON schema', () => {
    const validJson = JSON.stringify({
      formTitle: "Test Form",
      formDescription: "A test form description.",
      fields: [
        { id: "name", type: "text", label: "Name", required: true },
        { id: "email", type: "email", label: "Email", required: true }
      ]
    });

    const result = validateJSONSchema(validJson);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('invalid JSON schema', () => {
    const invalidJson = JSON.stringify({
      formTitle: "Test Form"
      // Missing required fields
    });

    const result = validateJSONSchema(invalidJson);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Missing or invalid 'formDescription'");
  });
});