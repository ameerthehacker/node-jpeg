const getPixels = require('get-pixels');
const savePixels = require('save-pixels');
const fs = require('fs');
const jpeg = require('./jpeg');

getPixels('./images/lena.png', 'image/png', (err, pixels) => {
  let width = pixels.shape[0];
  let height = pixels.shape[1];
  console.log(jpeg(pixels.data, width, height));
  // jpeg(pixels.data, width, height);
});
