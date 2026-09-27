import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const reports=[];
try{
  for(const category of ['anime','gaming','movies','tv','kpop','comics','manga']){
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    await page.goto(`http://127.0.0.1:4173/#/world/${category}`);
    await page.locator('.content-card').first().waitFor();
    for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=600){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(90)}
    await page.waitForTimeout(1800);
    const report=await page.locator('.content-card').evaluateAll(cards=>cards.map(card=>({title:card.querySelector('h3')?.textContent,image:card.querySelector('.card-art img')?.src||null,loaded:!!card.querySelector('.card-art img')?.naturalWidth})).filter(x=>!x.image||!x.loaded));
    reports.push({category,total:await page.locator('.content-card').count(),failed:report});
    await page.close();
  }
}finally{await browser.close()}
for(const row of reports)console.log(JSON.stringify(row));
if(reports.some(r=>r.failed.length))process.exitCode=1;
