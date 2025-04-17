import { chromium, Browser, Page } from 'playwright';

export const bypassNgrok = async (ngrokUrl: string): Promise<any> => {
  try {
    // Launch the browser using Playwright
    const browser: Browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      ignoreHTTPSErrors: true, // Ignore SSL errors, common with ngrok
    });

    const page: Page = await context.newPage();

    // Navigate to the ngrok URL
    await page.goto(ngrokUrl);
    await page.waitForTimeout(5000); // Allow some time for the page to load

    // If the warning page is present, interact with it to bypass
    const bypassButton = await page.$('button'); // Find the button (or change this selector based on the button type)
    if (bypassButton) {
      await bypassButton.click(); // Click to proceed past the warning
      await page.waitForTimeout(2000); // Wait for the page to load after bypass
    }

    // After bypass, send a fetch request to the API
    const response = await page.evaluate(async () => {
      const res = await fetch('http://aa3a-2a02-4780-12-c985-00-1.ngrok-free.app/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      });

      return await res.json(); // Assuming the API returns JSON
    });

    // Close the browser
    await browser.close();

    // Return the API response
    return response;
  } catch (error) {
    console.error('Error during ngrok bypass:', error);
    throw new Error('Failed to bypass ngrok warning and make API call');
  }
};
