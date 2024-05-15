import { test, expect } from '@playwright/test';

test('fill and submit demo request form', async ({ page } , testInfo) => {
    await page.goto('https://forms.fillout.com/t/nfQtmiHDgMus');

    // Fill in the First Name
    await page.locator('input[aria-label="First Name"]').fill('John');

    // Fill in the Last Name
    await page.locator('input[aria-label="Last Name"]').fill('Doe');

    // Fill in the Email
    const emailInput = page.locator('input[type="email"]').nth(0);
    await emailInput.fill('example@example.com');

    // Fill in the Contact Number
    await page.locator('input[aria-label="Contact Number"]').fill('1234567890');

    // Click on a specific role, here I select "Entrepreneur with an established venture"
    await page.locator('div[id="jBaWC2yNCxfYjm13dsez4a"]').click();

    // Submit the form
    await page.locator('button[data-cy="button-component"]').click();

    // Check if a confirmation or next page is loaded, depending on your actual form response
    // await expect(page).toHaveURL(/confirmation/); // Example to check the URL, adjust according to actual behavior
    await page.waitForSelector('text=Thank you for your interest!');

    // Take a screenshot after confirmation message appears
    const screenshotPath = `test-results/${testInfo.title.replace(/\s+/g, '_')}.png`;
    console.log("path",testInfo.title.replace(/\s+/g, '_'));
    await page.screenshot({ path: screenshotPath, fullPage: true });
  
    // Optionally, assert if the confirmation message is present (for testing purposes)
    const confirmationMessage = page.locator('text=Thank you for your interest!');
    await expect(confirmationMessage).toBeVisible();
  
    // Attach the screenshot to the test report
    testInfo.attachments.push({
      name: 'Screenshot',
      path: screenshotPath,
      contentType: 'image/png',
    });
  });

