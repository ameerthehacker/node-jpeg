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

function prepareBlocks(pixels) {
  // Get the rgb blocks
  rgbBlocks = getRgbBlocks(pixels);
  // Convert rgbBlocks to yiqBlocks
  yiqBlocks = [];
  for(i = 0;i < rgbBlocks.length; i++) {
    yiqBlock = rgb2yiq(rgbBlocks[i]);
    yiqBlocks.push(yiqBlock);
  }
  return yiqBlocks
}

module.exports = prepareBlocks;
