
import { test, expect } from "@playwright/test";

test.describe("Comprehensive Form Submission Scenarios", () => {
  const baseUrl = "https://animated-licorice-6f6e13.netlify.app/";
  const jsonEditorSelector = ".monaco-editor textarea";

  const testScenarios = [
    {
      name: "Job Application Form",
      schema: {
        formTitle: "Job Application",
        formDescription: "Apply for open positions",
        fields: [
          {
            id: "fullName",
            type: "text",
            label: "Full Name",
            required: true,
          },
          {
            id: "email",
            type: "email",
            label: "Email",
            required: true,
            validation: {
              pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            },
          },
          {
            id: "position",
            type: "select",
            label: "Position",
            required: true,
            options: [
              { value: "developer", label: "Software Developer" },
              { value: "designer", label: "UI/UX Designer" },
            ],
          },
        ],
      },
      formData: {
        fullName: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        position: "designer",
      },
    },
    {
      name: "Event Workshop Registration",
      schema: {
        formTitle: "Workshop Registration",
        formDescription: "Register for upcoming tech workshops",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Participant Name",
            required: true,
          },
          {
            id: "workShopTrack",
            type: "radio",
            label: "Workshop Track",
            required: true,
            options: [
              { value: "frontend", label: "Frontend Development" },
              { value: "backend", label: "Backend Development" },
              { value: "fullstack", label: "Full Stack" },
            ],
          },
          {
            id: "experience",
            type: "select",
            label: "Experience Level",
            required: true,
            options: [
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ],
          },
        ],
      },
      formData: {
        name: "Alex Rodriguez",
        workShopTrack: "fullstack",
        experience: "intermediate",
      },
    },
    {
      name: "Customer Feedback Survey",
      schema: {
        formTitle: "Customer Satisfaction Survey",
        formDescription: "Help us improve our services",
        fields: [
          {
            id: "customerName",
            type: "text",
            label: "Customer Name",
            required: true,
          },
          {
            id: "serviceSatisfaction",
            type: "radio",
            label: "Overall Satisfaction",
            required: true,
            options: [
              { value: "verySatisfied", label: "Very Satisfied" },
              { value: "satisfied", label: "Satisfied" },
              { value: "neutral", label: "Neutral" },
            ],
          },
          {
            id: "comments",
            type: "textarea",
            label: "Additional Comments",
            required: false,
          },
        ],
      },
      formData: {
        customerName: "Emily Chen",
        serviceSatisfaction: "satisfied",
        comments: "Great service, could improve response time",
      },
    },
    {
      name: "Training Program Application",
      schema: {
        formTitle: "Professional Training Program",
        formDescription: "Apply for our intensive training program",
        fields: [
          {
            id: "firstName",
            type: "text",
            label: "First Name",
            required: true,
          },
          {
            id: "lastName",
            type: "text",
            label: "Last Name",
            required: true,
          },
          {
            id: "programTrack",
            type: "select",
            label: "Program Track",
            required: true,
            options: [
              { value: "datascience", label: "Data Science" },
              { value: "cybersecurity", label: "Cybersecurity" },
              { value: "cloudcomputing", label: "Cloud Computing" },
            ],
          },
        ],
      },
      formData: {
        firstName: "Michael",
        lastName: "Wong",
        programTrack: "datascience",
      },
    },
    {
      name: "Academic Research Participation",
      schema: {
        formTitle: "Research Study Enrollment",
        formDescription: "Volunteer for academic research",
        fields: [
          {
            id: "participantName",
            type: "text",
            label: "Full Name",
            required: true,
          },
          {
            id: "researchArea",
            type: "radio",
            label: "Research Interest",
            required: true,
            options: [
              { value: "psychology", label: "Psychology" },
              { value: "neuroscience", label: "Neuroscience" },
              { value: "sociology", label: "Sociology" },
            ],
          },
          {
            id: "availability",
            type: "select",
            label: "Time Availability",
            required: true,
            options: [
              { value: "weekdays", label: "Weekdays" },
              { value: "weekends", label: "Weekends" },
            ],
          },
        ],
      },
      formData: {
        participantName: "David Thompson",
        researchArea: "neuroscience",
        availability: "weekends",
      },
    },
    {
      name: "Product Beta Testing",
      schema: {
        formTitle: "Beta Tester Application",
        formDescription: "Join our product testing program",
        fields: [
          {
            id: "testerName",
            type: "text",
            label: "Name",
            required: true,
          },
          {
            id: "deviceType",
            type: "radio",
            label: "Primary Device",
            required: true,
            options: [
              { value: "mobile", label: "Mobile" },
              { value: "desktop", label: "Desktop" },
              { value: "tablet", label: "Tablet" },
            ],
          },
          {
            id: "testFeedback",
            type: "textarea",
            label: "Previous Testing Experience",
            required: false,
          },
        ],
      },
      formData: {
        testerName: "Jessica Lee",
        deviceType: "mobile",
        testFeedback: "Experienced beta tester with multiple platforms",
      },
    },
    {
      name: "Volunteer Registration",
      schema: {
        formTitle: "Community Volunteer Form",
        formDescription: "Sign up to volunteer in community projects",
        fields: [
          {
            id: "volunteerName",
            type: "text",
            label: "Full Name",
            required: true,
          },
          {
            id: "projectInterest",
            type: "select",
            label: "Project Area",
            required: true,
            options: [
              { value: "environment", label: "Environmental" },
              { value: "education", label: "Education" },
              { value: "community", label: "Community Development" },
            ],
          },
          {
            id: "availability",
            type: "radio",
            label: "Weekly Availability",
            required: true,
            options: [
              { value: "weekday", label: "Weekdays" },
              { value: "weekend", label: "Weekends" },
            ],
          },
        ],
      },
      formData: {
        volunteerName: "Maria Rodriguez",
        projectInterest: "education",
        availability: "weekend",
      },
    },
    {
      name: "Fitness Class Registration",
      schema: {
        formTitle: "Fitness Class Signup",
        formDescription: "Register for upcoming fitness classes",
        fields: [
          {
            id: "memberName",
            type: "text",
            label: "Member Name",
            required: true,
          },
          {
            id: "classType",
            type: "select",
            label: "Class Type",
            required: true,
            options: [
              { value: "yoga", label: "Yoga" },
              { value: "pilates", label: "Pilates" },
              { value: "cardio", label: "Cardio" },
            ],
          },
          {
            id: "fitnessLevel",
            type: "radio",
            label: "Fitness Level",
            required: true,
            options: [
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ],
          },
        ],
      },
      formData: {
        memberName: "Ryan Kim",
        classType: "yoga",
        fitnessLevel: "intermediate",
      },
    },
    {
      name: "Startup Pitch Competition",
      schema: {
        formTitle: "Startup Pitch Application",
        formDescription: "Submit your startup for pitch competition",
        fields: [
          {
            id: "founderName",
            type: "text",
            label: "Founder Name",
            required: true,
          },
          {
            id: "industryType",
            type: "select",
            label: "Industry",
            required: true,
            options: [
              { value: "tech", label: "Technology" },
              { value: "healthcare", label: "Healthcare" },
              { value: "fintech", label: "Fintech" },
            ],
          },
          {
            id: "startupDescription",
            type: "textarea",
            label: "Startup Brief Description",
            required: true,
          },
        ],
      },
      formData: {
        founderName: "Emma Watson",
        industryType: "tech",
        startupDescription:
          "AI-powered project management tool for remote teams",
      },
    },
  ];

  for (const scenario of testScenarios) {
    test(`Submit ${scenario.name} form`, async ({ page }) => {
      await page.goto(baseUrl);

      const jsonEditor = await page.locator(jsonEditorSelector);
      const jsonSchema = JSON.stringify(scenario.schema);

      await jsonEditor.focus();
      await page.keyboard.press("End");
      await page.waitForTimeout(100);
      await jsonEditor.clear();
      await page.waitForTimeout(100);
      await jsonEditor.fill(jsonSchema);

      await page.waitForSelector("form");
      await expect(await page.locator("#formTitle").innerText()).toBe(
        scenario.schema.formTitle
      );

      for (const [fieldId, value] of Object.entries(scenario.formData)) {
        const field = await page.locator(`[name="${fieldId}"]`);

        if ((await field.first().getAttribute("type")) === "radio") {
          await page
            .locator(`input[name="${fieldId}"][value="${value}"]`)
            .check();
        } else if (
          await field.evaluate((el) => el.tagName.toLowerCase() === "select")
        ) {
          await field.selectOption(value as string);
        } else {
          await field.fill(value as string);
        }
      }

      await page.getByRole("button", { name: "Submit" }).click();

      const modal = await page.locator(
        "div.bg-white.rounded-lg.p-6.max-w-md.w-full.relative"
      );
      await expect(modal).toBeVisible();

      await page.locator('button:has-text("Preview Data")').click();
      const dataPreview = await modal.locator(
        "div.mt-2 > pre.bg-gray-100.p-2.rounded.max-h-60.overflow-auto.text-sm"
      );
      const previewText = await dataPreview.textContent();
      const submittedData = JSON.parse(previewText || "{}");

      expect(submittedData).toEqual(scenario.formData);

      const downloadButton = await modal.getByRole("button", {
        name: /download/i,
      });
      const downloadPromise = page.waitForEvent("download");
      await downloadButton.click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toMatch(
        new RegExp(
          `${scenario.schema.formTitle.replace(/\s+/g, "_")}_.*\.json$`
        )
      );
    });
  }
});