const fs = require('fs');
const https = require('https')
const puppeteer = require('puppeteer-core')
const path = require('path')

const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close(resolve(true));
        });
      })
      .on('error', (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });


 function RunNow() {
   (async () => {
     const trims = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
     const browser = await puppeteer.launch({
       headless: false,
       executablePath: trims.trim(), 
       args: ['--start-maximized'],
     });

     const page = await browser.newPage();

     let arrayList = []
     let num = 0;
     for (let i = 0; i < 25; i++) {
          if (num < i) {
                num = i;
          }
    
        await page.goto(
          `https://goddesskissove.flerogames.com/detail/character.html#${num}`
        );
        const SELECTOR_DEST =
          'body > div > div.pic-chara > picture.pic-default.is-active > img';

        let imageRef = await page.evaluate((qry) => {
          return document
            .querySelector(qry)
            .getAttribute('src')
            .replace('/', '');
        }, SELECTOR_DEST);

        let url_images = path.join(__dirname, `/images/myImages-${num}.png`);
        await download(imageRef, url_images); 

   
     }
  
    
    

      browser.close();
  })()
}

RunNow();