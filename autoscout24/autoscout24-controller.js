import { chromium } from 'playwright';

(async () => {
  
  const { createLinkList } = await import('./autoscout24-links.js');
  await createLinkList();

  const { sendMessages } = await import('./autoscout24-message.js');
  await sendMessages(); 
  
  
})();
