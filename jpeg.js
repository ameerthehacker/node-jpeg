function rgb2yiq(rgb) {
  yiq = [0, 0, 0]
  yiq[0] = (0.299 * rgb[0]) + (0.587 * rgb[1]) + (0.144 * rgb[2]);
  yiq[1] = (0.596 * rgb[0]) + (-0.275 * rgb[1]) + (-0.321 * rgb[2]);
  yiq[2] = (0.212 * rgb[0]) + (-0.523 * rgb[1]) + (0.311 * rgb[2]);
  return yiq;
}
function getRgbBlocks(pixels) {
  let rgbBlocks = [];
  for(let i = 0; i < pixels.length;) {
    let rgb = [ pixels[i], pixels[i + 1], pixels[ i + 2 ] ];
    rgbBlocks.push(rgb);
    i = i + 4;
  }
  return rgbBlocks;
}

function prepareBlocks(pixels, width, height) {
  // Get the rgb blocks
  rgbBlocks = getRgbBlocks(pixels);
  // Convert rgbBlocks to yiqBlocks
  let yiqBlocks = [];
  for(let i = 0; i < rgbBlocks.length; i++) {
    yiqBlock = rgb2yiq(rgbBlocks[i]);
    yiqBlocks.push(yiqBlock);
  }
  // Seperate the pixles into 8 * 8 blocks
  let noBlocks = yiqBlocks.length / (height * 8);
  let macroBlocks = [];
  for(let i = 0; i < noBlocks; i++) {
    blockIndex = i * 8;
    let macroBlock = [];
    for(let row = blockIndex; row < blockIndex + 8; row++) {
      let macroBlockRow = [];
      for(let col = blockIndex; col < blockIndex + 8; col++) {
        macroBlockRow.push(yiqBlocks[ row * width + col  ]);
      }
      macroBlock.push(macroBlockRow);
    }
    macroBlocks.push(macroBlock);
  }
  return macroBlocks;
}
function DCT(macroBlocks) {
  // Iterate through each macro block
  for(let i = 0; i < macroBlocks.length; i++){
    for(let j = 0; j < 8; j++) {
      for(let k = 0; k < 8; k++) {
        // Iterate through each color code
        for(let l = 0; i < 3; i++) {
          let a = macroBlocks[i][j][k][l];
          macroBlocks[i][j][k][l] = a * Math.cos((2 * Math.PI * (2 * j + 1)) / 16) * Math.cos((2 * Math.PI * (2 * k + 1)) / 16);
        }
      }
    }
  }
  return macroBlocks;
}
function compress(pixels, height, width) {
  // Prepare the macroblocks
  let macroBlocks = prepareBlocks(pixels, height, width);
  // Perform DCT on the macroblocks
  macroBlocks = DCT(macroBlocks);
  return macroBlocks;
}

module.exports = compress;
