const getPixels = require('get-pixels');
const savePixels = require('save-pixels');
const fs = require('fs');
const jpeg = require('./jpeg');

getPixels('./images/lena.png', 'image/png', (err, pixels) => {
  let width = pixels.shape[0];
  let height = pixels.shape[1];
  console.log("Encoding the jpeg image");
  encodedImage = jpeg.encode(pixels.data, height, width);
  console.log(encodedImage);
  console.log("Decoding the jpeg image");
  decodedImage = jpeg.decode(encodedImage, height, width);
  for(let i = 0, j = 0; i < pixels.data.length; i = i + 3, j++) {
    // Change from Y to R
    pixels.data[i] = 0.2999 * decodedImage[j];
  }
  console.log(decodedImage);  
  // Write to a new image file
  let stream = fs.createWriteStream('./images/lena.jpg');
  savePixels(pixels, 'jpeg').pipe(stream);
});
