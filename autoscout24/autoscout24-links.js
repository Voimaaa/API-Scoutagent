import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function createLinkList() {
  const browser = await chromium.launch({ 
    headless: true,
    slowMo: 500 
  });
  
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 }
  });

  try {
    let brand = "audi";
    let model = "a4";
    let regfrom = "2013";
    let priceto = "14000";

    let configuredUrl = "https://www.autoscout24.at/lst/" + brand + "/" + model + "?atype=C&cy=A&damaged_listing=exclude&desc=1&fregfrom=" + regfrom + "&powertype=kw&priceto=" + priceto + "&search_id=26701r3yox5&sort=age&source=homepage_search-mask&ustate=N%2CU";

    await page.goto(configuredUrl, { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(3000);

    const carLinks = await page.locator('a[class*="DeclutteredListItem_overlay_anchor"]').all();
    
    console.log(`📋 ${carLinks.length} Links gefunden - speichere in autoscout-links.txt...`);

    const urls = [];
    for (let i = 0; i < Math.min(10, carLinks.length); i++) {
      const href = await carLinks[i].getAttribute('href');
      if (href) {
        urls.push(href);
      }
    }

    let storage_id = localStorage.getItem("storage_id");
    const filename = '../../' + storage_id + '/autoscout24-link-list.txt';
    const content = urls.join('\n');
    
    await fs.writeFile(filename, content);
    console.log(`✅ ${filename} gespeichert (${urls.length} Links)`);


  } catch (error) {
    console.log('❌ Fehler:', error.message);
  } finally {
    await browser.close();
  }
};
