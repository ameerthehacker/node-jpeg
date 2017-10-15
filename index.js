const getPixels = require('get-pixels');
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
  console.log(decodedImage);
});
