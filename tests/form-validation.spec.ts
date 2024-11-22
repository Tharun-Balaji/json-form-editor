import { test, expect } from "@playwright/test";

test.describe("Comprehensive JSON Schema Validation", () => {
  // Setup test page with the JSON Editor component
  test.beforeEach(async ({ page }) => {
    await page.goto("https://animated-licorice-6f6e13.netlify.app/");
  });

  // Root Level Validation Tests
  test("should reject non-object root", async ({ page }) => {
    // Test array root

    const editor = await page.locator(".monaco-editor textarea");
    await editor.focus(); // Focus on the textarea
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    await editor.clear();
    await page.waitForTimeout(100);

    await editor.fill(JSON.stringify([]));
    let errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Root element must be an object/);

    // Test null root
    await editor.focus(); // Focus on the textarea
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    await editor.clear();
    await page.waitForTimeout(100);
    await editor.fill(JSON.stringify(null));
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Root element must be an object/);

    // Test primitive root
    await editor.focus(); // Focus on the textarea
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    await editor.clear();
    await page.waitForTimeout(100);
    await editor.fill(JSON.stringify("string"));
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Root element must be an object/);
  });

  // Form Title Validation
  test("should reject missing or invalid formTitle", async ({ page }) => {
    // Missing formTitle
    let invalidSchema = JSON.stringify({
      formDescription: "Test Description",
      fields: [],
    });
    
    const editor = await page.locator(".monaco-editor textarea");
    await editor.focus(); // Focus on the textarea
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    await editor.clear();
    await page.waitForTimeout(100);
    await editor.fill(invalidSchema);
    let errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Missing or invalid 'formTitle'/);

    // Non-string formTitle
    invalidSchema = JSON.stringify({
      formTitle: 123,
      formDescription: "Test Description",
      fields: [],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Missing or invalid 'formTitle'/);
  });

  // Form Description Validation
  test("should reject missing or invalid formDescription", async ({ page }) => {
    // Missing formDescription
    let invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      fields: [],
    });

     const editor = await page.locator(".monaco-editor textarea");

     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    let errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Missing or invalid 'formDescription'/
    );

    // Non-string formDescription
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: 123,
      fields: [],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Missing or invalid 'formDescription'/
    );
  });

  // Fields Array Validation
  test("should reject non-array fields", async ({ page }) => {
    // Fields as object
    let invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: {},
    });

     const editor = await page.locator(".monaco-editor textarea");
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    let errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/'fields' must be an array/);

    // Fields as null
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: null,
    });
    await editor.focus(); // Focus on the textarea
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    await editor.clear();
    await page.waitForTimeout(100);
    await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/'fields' must be an array/);
  });

  // Individual Field Validation
  test("should reject fields with invalid properties", async ({ page }) => {
    // Missing id
    let invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ type: "text", label: "Test Label" }],
    });

     const editor = await page.locator(".monaco-editor textarea");
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    let errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Each field must have a valid 'id'/);

    // Invalid id type
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: 123, type: "text", label: "Test Label" }],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(/Each field must have a valid 'id'/);

    // Missing type
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: "field1", label: "Test Label" }],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'field1' must have a valid 'type'/
    );

    // Invalid type
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: "field1", type: 123, label: "Test Label" }],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'field1' must have a valid 'type'/
    );

    // Missing label
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: "field1", type: "text" }],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'field1' must have a valid 'label'/
    );

    // Invalid label type
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: "field1", type: "text", label: 123 }],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'field1' must have a valid 'label'/
    );
  });

  // Select and Radio Field Options Validation
  test("should reject select and radio fields without options", async ({
    page,
  }) => {
    // Select field without options
    let invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: "select1", type: "select", label: "Select Label" }],
    });

     const editor = await page.locator(".monaco-editor textarea");
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    let errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'select1' of type 'select' must have non-empty 'options' array/
    );

    // Radio field without options
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [{ id: "radio1", type: "radio", label: "Radio Label" }],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'radio1' of type 'radio' must have non-empty 'options' array/
    );

    // Empty options array
    invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [
        {
          id: "select1",
          type: "select",
          label: "Select Label",
          options: [],
        },
      ],
    });
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'select1' of type 'select' must have non-empty 'options' array/
    );
  });

  // Email Field Validation Pattern
  test("should reject email fields with invalid validation", async ({
    page,
  }) => {
    // Email field without validation pattern
    const invalidSchema = JSON.stringify({
      formTitle: "Test Title",
      formDescription: "Test Description",
      fields: [
        {
          id: "email1",
          type: "email",
          label: "Email Label",
          validation: {},
        },
      ],
    });

     const editor = await page.locator(".monaco-editor textarea");
     await editor.focus(); // Focus on the textarea
     await page.keyboard.press("End");
     await page.waitForTimeout(100);
     await editor.clear();
     await page.waitForTimeout(100);
     await editor.fill(invalidSchema);
    const errorMessage = page.locator("#error-message");
    await expect(errorMessage).toHaveText(
      /Field 'email1' must have a valid validation pattern/
    );
  });
});
