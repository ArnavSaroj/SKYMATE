//scraping air india through api has failed so we will try to do scraping through html first
//scraping with html has also failed need to look into headless browsers i guess
import axios from "axios";
import puppeteer from 'puppeteer'

export async function scrapeIndigo() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.goindigo.in/', { waitUntil: 'networkidle2' });

  await page.setViewport({ width: 1200, height: 800 });

  // Click "From" field
  await page.waitForSelector('input[placeholder="From"]');
  await page.click('input[placeholder="From"]');

  // Type city
  await page.type('input[placeholder="From"]', 'Mumbai', { delay: 100 });

  console.log("typed Mumbai");

  // Select suggestion
  await page.waitForSelector('.airport-city');
  await page.click('.airport-city');

  console.log("selected suggestion");
}

scrapeIndigo();









