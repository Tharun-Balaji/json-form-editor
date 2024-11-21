import { test, expect } from '@playwright/test';

test.describe('Dynamic Form Generation', () => {
  const createTestSchema = (fields: any[] = []) => JSON.stringify({
    "formTitle": "Test Form",
    "formDescription": "Form Generation Test",
    "fields": fields
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // Adjust to your app's URL
  });

  test('Generates basic text input', async ({ page }) => {
    const schema = createTestSchema([
      {
        "id": "name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your name"
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Verify text input generation
    const inputLabel = await page.locator('label:has-text("Full Name")');
    expect(await inputLabel.isVisible()).toBeTruthy();

    const input = await page.locator('input[placeholder="Enter your name"]');
    expect(await input.isVisible()).toBeTruthy();
    expect(await input.getAttribute('type')).toBe('text');
  });

  test('Generates email input with validation', async ({ page }) => {
    const schema = createTestSchema([
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "you@example.com",
        "validation": {
          "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          "message": "Please enter a valid email"
        }
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Verify email input generation
    const inputLabel = await page.locator('label:has-text("Email Address")');
    expect(await inputLabel.isVisible()).toBeTruthy();

    const input = await page.locator('input[placeholder="you@example.com"]');
    expect(await input.isVisible()).toBeTruthy();
    expect(await input.getAttribute('type')).toBe('email');

    // Test email validation
    const submitButton = await page.locator('button[type="submit"]');
    
    // Test invalid email
    await input.fill('invalid-email');
    await submitButton.click();

    const errorMessage = await page.locator('text=Please enter a valid email');
    expect(await errorMessage.isVisible()).toBeTruthy();

    // Test valid email
    await input.fill('test@example.com');
    await submitButton.click();

    expect(await errorMessage.count()).toBe(0);
  });

  test('Generates select input', async ({ page }) => {
    const schema = createTestSchema([
      {
        "id": "companySize",
        "type": "select",
        "label": "Company Size",
        "required": true,
        "options": [
          { "value": "1-10", "label": "1-10 employees" },
          { "value": "11-50", "label": "11-50 employees" }
        ]
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Verify select input generation
    const inputLabel = await page.locator('label:has-text("Company Size")');
    expect(await inputLabel.isVisible()).toBeTruthy();

    const select = await page.locator('select');
    expect(await select.isVisible()).toBeTruthy();

    // Check options
    const options = await select.locator('option');
    expect(await options.count()).toBe(3); // Including default "Select" option

    // Verify option values
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('1-10 employees');
    expect(optionTexts).toContain('11-50 employees');
  });

  test('Generates radio input', async ({ page }) => {
    const schema = createTestSchema([
      {
        "id": "industry",
        "type": "radio",
        "label": "Industry",
        "required": true,
        "options": [
          { "value": "tech", "label": "Technology" },
          { "value": "finance", "label": "Finance" }
        ]
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Verify radio input generation
    const inputLabel = await page.locator('label:has-text("Industry")');
    expect(await inputLabel.isVisible()).toBeTruthy();

    // Check radio buttons
    const radioButtons = await page.locator('input[type="radio"]');
    expect(await radioButtons.count()).toBe(2);

    // Verify radio button labels
    const radioLabels = await page.locator('label:has(input[type="radio"])').allTextContents();
    expect(radioLabels).toContain('Technology');
    expect(radioLabels).toContain('Finance');
  });

  test('Generates textarea input', async ({ page }) => {
    const schema = createTestSchema([
      {
        "id": "comments",
        "type": "textarea",
        "label": "Additional Comments",
        "required": false,
        "placeholder": "Enter your comments"
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Verify textarea generation
    const inputLabel = await page.locator('label:has-text("Additional Comments")');
    expect(await inputLabel.isVisible()).toBeTruthy();

    const textarea = await page.locator('textarea[placeholder="Enter your comments"]');
    expect(await textarea.isVisible()).toBeTruthy();
  });

  test('Generates multiple input types', async ({ page }) => {
    const schema = createTestSchema([
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
        "required": true
      },
      {
        "id": "companySize",
        "type": "select",
        "label": "Company Size",
        "required": true,
        "options": [
          { "value": "1-10", "label": "1-10 employees" }
        ]
      },
      {
        "id": "industry",
        "type": "radio",
        "label": "Industry",
        "required": true,
        "options": [
          { "value": "tech", "label": "Technology" }
        ]
      },
      {
        "id": "comments",
        "type": "textarea",
        "label": "Additional Comments",
        "required": false
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Verify form title and description
    const formTitle = await page.locator('h2').textContent();
    const formDescription = await page.locator('p').textContent();
    
    expect(formTitle).toBe('Test Form');
    expect(formDescription).toBe('Form Generation Test');

    // Check input types
    const textInput = await page.locator('input[type="text"]');
    const emailInput = await page.locator('input[type="email"]');
    const selectInput = await page.locator('select');
    const radioInputs = await page.locator('input[type="radio"]');
    const textareaInput = await page.locator('textarea');

    expect(await textInput.count()).toBe(1);
    expect(await emailInput.count()).toBe(1);
    expect(await selectInput.count()).toBe(1);
    expect(await radioInputs.count()).toBe(1);
    expect(await textareaInput.count()).toBe(1);
  });

  test('Handles required field validation', async ({ page }) => {
    const schema = createTestSchema([
      {
        "id": "name",
        "type": "text",
        "label": "Full Name",
        "required": true
      }
    ]);

    // Input schema into Monaco editor
    const editor = await page.locator('.monaco-editor textarea');
    await editor.fill(schema);

    // Try to submit form without filling required field
    const submitButton = await page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for error message
    const errorMessage = await page.locator('text=Full Name is required');
    expect(await errorMessage.isVisible()).toBeTruthy();

    // Fill the required field
    const input = await page.locator('input[type="text"]');
    await input.fill('John Doe');
    await submitButton.click();

    // Verify error message is gone
    expect(await errorMessage.count()).toBe(0);
  });
});