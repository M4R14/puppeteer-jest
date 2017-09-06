const puppeteer = require('puppeteer');

const _30s = 1000 * 30;
const _1m = 1000 * 60;
const _5m = _1m * 5;

describe('Open Url: Google, Github.', () => {
  var browser, page;

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  }, _30s);

  afterEach(() => {
    browser.close()
  }, _30s);

  test('Title == Google', async () => {
    await page.goto("https://google.com");
    const title = await page.title();
    expect(title).toBe("Google");
  }, _30s);

  test("Title == The world's leading software development platform · GitHub", async () => {
    await page.goto("https://github.com/");
    const title = await page.title();
    expect(title).toBe("The world's leading software development platform · GitHub");
  }, _30s);
}, _5m)