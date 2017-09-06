# วิธีใส่ Puppeteer เข้าไปใน Jest เพื่อทำ UI Testing ในโหมด headless browser อย่างง่าย…

วันก่อน ผมได้ลองเล่น Puppeteer และทำ Web Bot ดู ผมทำให้มัน Login > Logout และ กรอกฟอร์ม บันทึกข้อมูล 
แต่มันดูขาดอะไรอยู่ จุดเด่นของ Puppeteer ก็คือการทำ Chrome headless Browser และถ้าเปิดโหมด headless แลัวรัน test 
มันก็จะ ….. เงียบกริบ …. ไม่เกิดอะไรเลย มันยังขาด Monitor หรือ Report มันทำอะไรไปแล้วบ้าง 
มาถึงตรงผมว่า Jest ช่วยได้มาลองกันเลย

## Setup:
สร้างโฟลเดอร์ สำหรับ งานนี้กันก่อน
```sh
$ mkdir puppeteer-jest && cd puppeteer-jest

# init ส่ะ
$ yarn init

# ติดตั้ง jest กับ puppeteer
$ yarn add --dev jest puppeteer
```
จากนั้น { “test” : “jest” } ลงใน package.json ตามนี้
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## Coding:
สิ่งที่ผมอยากได้ก็คือ ผมไม่ต้องเขียน Code เปิด/ปิด Browser ทุกๆครั้งใน Test Case ผมได้ลองอยู่หลายวิธี แม้กะทั้ง
```js
const puppeteer = require('puppeteer');

const Chrome = async ({ STEP }) => {
   const browser = await puppeteer.launch({ headless: false });    
   const page = await browser.newPage(); 
   
   await STEP(browser, page); 
   
   browser.close();
}

test('Title == Google', async () => {
  await Chrome({
    STEP: async (browser, page)=>{
      page.goto("https://google.com");
      const title = await page.title();
      expect(title).toBe("Google"); 
    }
  });
}, 1000*30)
```

ผมสร้าง Function ที่รับ Function เข้ามาทำงานในตัวมันเอง คือมันก็ดูดี ใช้ได้อยู่ แต่ผมกลับรู้ไม่พอใจ เพราะ Code มันดูสับซ่อนเกินได้ไป 
ผมหาอีกวิธีนึง แล้วผมก็เจออะไรดีๆ ใน Jest คือ Setup and Teardown เป็นเหมือน life cycle สำหรับ Test case

```js
const puppeteer = require('puppeteer');

const _30s = 1000 * 30;
const _1m = 1000 * 60;
const _5m = _1m * 5;

describe('Open Url: Google, Github.', () => {
  var browser, page;

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false });
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
    ผลที่
    const title = await page.title();
    expect(title).toBe("The world's leading software development platform · GitHub");
  }, _30s);
}, _5m)
```
สิ่งที่ได้ผลการทำงานจะไม่แตกต่างจาก Sol. A แต่ใน Test case ผมเขียนแค่ 3 บรรทัด 
beforeEach() ทำงานทุกครั้งก่อนที่ test() ทำงาน และ afterEach() จะทำงานที่ครั้งที่ test() สิ้นสุด
จากนั้นรัน
```sh
$ yarn test
```
