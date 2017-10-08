const getPixels = require('get-pixels');
const savePixels = require('save-pixels');
const fs = require('fs');
const jpeg = require('./jpeg');

getPixels('./images/lena.png', 'image/png', (err, pixels) => {
    console.log(jpeg(pixels.data));
});
