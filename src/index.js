const fs = require('fs');
const https = require('https')
const puppeteer = require('puppeteer-core')
const path = require('path')

const downloadFiles = (url, fileDest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileDest);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close(resolve(true));
        });
      })
      .on('error', (error) => {
        fs.unlink(fileDest);

        reject(error.message);
      });
  });


 function RunNow() {
   (async () => {
     const trims = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
     const browser = await puppeteer.launch({
       headless: false,
       executablePath: trims, 
       args: ['--start-maximized'],
     });

     const page = await browser.newPage();

   
     let num = 0;
     for (let i = 1; i <= 25; i++) {
          if (num < i) {
                num = i;
          }
        await page.setViewport({ width: 800, height: 600 });
        await page.goto(
       `https://goddesskissove.flerogames.com/detail/character.html#${num}`
     );
     const SELECTOR_DEST =
       'body > div > div.pic-chara > picture.pic-default.is-active > img';

     let imageRef = await page.evaluate((qry) => {
       return document.querySelector(qry).getAttribute('src').replace('/', '');
     }, SELECTOR_DEST);
      
     let  url_images =  path.join(__dirname, `/images/myImages-${num}.png`);
      await downloadFiles(imageRef, url_images); 

   
     }
  
    
    

      browser.close();
  })()
}

RunNow();