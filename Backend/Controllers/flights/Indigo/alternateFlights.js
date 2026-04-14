import puppeteer from "puppeteer";

export async function scrapeIndigo() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto("https://www.goindigo.in/", { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1800, height: 1000 });

  console.log("Reached till here 1");
  await page.waitForSelector(".value-wrapper", { visible: true });
  await page.click(".value-wrapper");           // opens the FROM popup

  console.log("Reached till here 2");
  await page.waitForSelector('input[placeholder="Search by place/airport"]', {
    visible: true,
  });

  // Don’t click the input again – just type into the focused field
  await page.keyboard.type("Mumbai", { delay: 100 });
console.log("reached till here 2")
  // OR, if you want to be explicit:
  // await page.focus('input[placeholder="Search by place/airport"]');
  // await page.keyboard.type('Mumbai', { delay: 100 });

  await browser.close()
}

scrapeIndigo().catch(console.error);