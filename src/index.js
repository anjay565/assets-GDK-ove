const fs = require('fs');
const https = require('https')
const puppeteer = require('puppeteer-core')
const path = require('path')

const downloadFiles = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('All Done !', () => {
          file.close(resolve(true));
        });
      })
      .on('Something Wrong', (err) => {
        fs.unlink(dest);

        reject(err.message);
      });
  });


 function RunNow() {
   (async () => {
     const trims = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"; //path ur btowser
     const browser = await puppeteer.launch({
       headless: false,
       executablePath: trims, 
       args: ['--start-maximized'],
     });

     const page = await browser.newPage();

  
     let num = 0;
     for (let i = 1; i < 26; i++) { /// u can change the range value of items list
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
        await downloadFiles(imageRef, url_images); 

   
     }
  
    
    

      browser.close();
  })()
}

RunNow();