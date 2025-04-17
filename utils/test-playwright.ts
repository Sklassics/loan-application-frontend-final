    import { chromium } from 'playwright';

    async function testBrowser() {
    const browser = await chromium.launch();  // Launch the Chromium browser
    const page = await browser.newPage();     // Create a new page
    await page.goto('http://aa3a-2a02-4780-12-c985-00-1.ngrok-free.app'); // Navigate to a URL
    console.log(await page.title()); // Log the title of the page
    await browser.close(); // Close the browser
    }

    testBrowser().catch((err) => {
    console.error('Error during Playwright test:', err);
    });
