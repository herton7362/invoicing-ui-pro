import puppeteer from 'puppeteer';

describe('Homepage', () => {
  it('it should have logo text', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8000');
    await page.waitForSelector('span');
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('Herton');
    await page.close();
    browser.close();
  });
});
