import { test, expect } from '@playwright/test';

test.describe('JSON Schema Validation', () => {


  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // Adjust to your app's URL
  });


  test('Rejects non-object root', async ({ page }) => {
    const invalidSchemas = [
      '[]',
      '"string"',
      'null',
      '123'
    ];

    for (const invalidSchema of invalidSchemas) {
      // Find the Monaco editor
      const editor = await page.locator('.monaco-editor textarea');
      await editor.fill(invalidSchema);

      // Check for error message
      const errorMessage = await page.locator('div[class*="bg-red-100"]');
      expect(await errorMessage.count()).toBe(1);

      // Verify no form is generated
      const form = await page.locator('form');
      expect(await form.count()).toBe(0);
    }
  });

  test('Validates required top-level properties', async ({ page }) => {
    const invalidSchemas = [
      // Missing formTitle
      JSON.stringify({
        "formDescription": "Test Description",
        "fields": []
      }),
      // Invalid formTitle type
      JSON.stringify({
        "formTitle": 123,
        "formDescription": "Test Description",
        "fields": []
      }),
      // Missing formDescription
      JSON.stringify({
        "formTitle": "Test Form",
        "fields": []
      }),
      // Invalid formDescription type
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": 123,
        "fields": []
      }),
      // Invalid fields type
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": "not an array"
      })
    ];

    for (const invalidSchema of invalidSchemas) {
      // Find the Monaco editor
      const editor = await page.locator('.monaco-editor textarea');
      await editor.fill(invalidSchema);

      // Check for error message
      const errorMessage = await page.locator('div[class*="bg-red-100"]');
      expect(await errorMessage.count()).toBe(1);

      // Verify no form is generated
      const form = await page.locator('form');
      expect(await form.count()).toBe(0);
    }
  });

  test('Validates individual field properties', async ({ page }) => {
    const invalidFieldSchemas = [
      // Missing field id
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "type": "text", 
          "label": "Name" 
        }]
      }),
      // Invalid field id type
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": 123, 
          "type": "text", 
          "label": "Name" 
        }]
      }),
      // Missing field type
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "name", 
          "label": "Name" 
        }]
      }),
      // Invalid field type
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "name", 
          "type": 123, 
          "label": "Name" 
        }]
      }),
      // Missing field label
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "name", 
          "type": "text"
        }]
      }),
      // Invalid field label
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "name", 
          "type": "text", 
          "label": 123 
        }]
      }),
      // Missing options for select
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "company", 
          "type": "select", 
          "label": "Company" 
        }]
      }),
      // Empty options for radio
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "industry", 
          "type": "radio", 
          "label": "Industry",
          "options": [] 
        }]
      })
    ];

    for (const invalidSchema of invalidFieldSchemas) {
      // Find the Monaco editor
      const editor = await page.locator('.monaco-editor textarea');
      await editor.fill(invalidSchema);

      // Check for error message
      const errorMessage = await page.locator('div[class*="bg-red-100"]');
      expect(await errorMessage.count()).toBe(1);

      // Verify no form is generated
      const form = await page.locator('form');
      expect(await form.count()).toBe(0);
    }
  });

  test('Validates email field validation', async ({ page }) => {
    const invalidEmailSchemas = [
      // Missing pattern
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "email", 
          "type": "email", 
          "label": "Email",
          "validation": {} 
        }]
      }),
      // Invalid pattern type
      JSON.stringify({
        "formTitle": "Test Form",
        "formDescription": "Test Description",
        "fields": [{ 
          "id": "email", 
          "type": "email", 
          "label": "Email",
          "validation": { 
            "pattern": 123 
          } 
        }]
      })
    ];

    for (const invalidSchema of invalidEmailSchemas) {
      // Find the Monaco editor
      const editor = await page.locator('.monaco-editor textarea');
      await editor.fill(invalidSchema);

      // Check for error message
      const errorMessage = await page.locator('div[class*="bg-red-100"]');
      expect(await errorMessage.count()).toBe(1);

      // Verify no form is generated
      const form = await page.locator('form');
      expect(await form.count()).toBe(0);
    }
  });

  test('Handles JSON parsing errors', async ({ page }) => {
    const invalidJSONs = [
      '{ invalid json }',
      '{',
      '"unclosed string',
      '{"extra": "comma",}'
    ];

    for (const invalidJSON of invalidJSONs) {
      // Find the Monaco editor
      const editor = await page.locator('.monaco-editor textarea');
      await editor.fill(invalidJSON);

      // Check for error message
      const errorMessage = await page.locator('div[class*="bg-red-100"]');
      expect(await errorMessage.count()).toBe(1);

      // Verify no form is generated
      const form = await page.locator('form');
      expect(await form.count()).toBe(0);
    }
  });
});