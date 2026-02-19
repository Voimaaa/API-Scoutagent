import { chromium } from 'playwright';
import * as fs from 'fs/promises';

async function isLinkAlreadySent(link, sentFile) {
  try {
    const content = await fs.readFile(sentFile, 'utf8');
    const sentLinks = content.split('\n').map(l => l.trim()).filter(Boolean);
    return sentLinks.includes(link);
  } catch {
    return false;
  }
}

export async function sendMessages() {
  var storage_id = localStorage.getItem("storage_id");
  const linksPath = '../../' + storage_id + '/autoscout24-link-list.txt';
  const sentPath = '../../' + storage_id + '/messages-sent.txt';
  
  const content = await fs.readFile(linksPath, 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  
  console.log(`📋 ${lines.length} Links gefunden`);

  for (let index = 0; index < lines.length; index++) {
    const url = lines[index];
    
    if (await isLinkAlreadySent(url, sentPath)) {
      console.log(`⏭️ Skip ${index + 1}/${lines.length}: ${url}`);
      continue;
    }
    
    console.log(`📧 Neu ${index + 1}/${lines.length}: ${url}`);
    
    let browser = null;
    let page = null;
    
    try {
      browser = await chromium.launch({ headless: true });
      page = await browser.newPage();
      
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      
      // 🎯 Cookie-Button "Alle akzeptieren" (7s Timeout)
      const acceptButton = page.getByRole('button', { name: 'Alle akzeptieren' });
      try {
        await acceptButton.click({ timeout: 7000 });
        console.log('✅ Cookie-Banner geklickt');
        await page.waitForTimeout(500);
      } catch (error) {
        if (error.name === 'TimeoutError') {
          console.log('⏭️ Kein Cookie-Banner – überspringen');
        } else {
          throw error;
        }
      }
      
      // Rest deines Codes
      await page.getByText("E-Mail senden").click();
      await page.waitForTimeout(1000);
      
      await page.getByLabel("Deine Nachricht").fill("Hallo, ist das Fahrzeug noch verfügbar?");
      
      const overlay = page.getByTestId('overlay');
      await overlay.waitFor({ state: 'visible', timeout: 5000 });
      
      const contentDiv = overlay.locator('.content');
      await contentDiv.waitFor({ state: 'visible', timeout: 3000 });
      
      await contentDiv.evaluate(el => el.scrollTop += 4000);
      await page.waitForTimeout(800);
      
      await page.getByLabel("Dein Name").fill("Felix");
      await page.waitForTimeout(400);
      await page.getByLabel("Deine E-Mail").fill("felix.vogi1980@gmail.com");
      
      await page.waitForTimeout(1200);
      await page.click('#sendEmailButton');
      
      await fs.appendFile(sentPath, url + '\n', 'utf8');
      console.log(`✅ GESENDET: ${url}`);
      
      // ✅ expect() ohne Import - direkt mit page.waitForSelector()
      try {
        await page.waitForSelector('text="Deine Anfrage ist verschickt"', { 
          timeout: 5000 
        });
        console.log('📄 Bestätigung gesehen');
      } catch {
        console.log('⚠️ Keine Bestätigung, aber Link gespeichert');
      }
      
    } catch (error) {
      console.error(`❌ FEHLER ${index + 1}:`, error.message);
    } finally {
      try {
        if (page && !page.isClosed()) await page.close();
      } catch (e) {
        console.log('⚠️ Page close ignoriert');
      }
      
      try {
        if (browser && !browser.isClosed()) await browser.close();
      } catch (e) {
        console.log('⚠️ Browser close ignoriert');
      }
      
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log('🎉 Alle Links abgearbeitet!');
}
