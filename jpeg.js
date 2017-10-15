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
  // Subtract 128 from each of the color channel
  yChannels = [];
  for(let i = 0; i < yiqBlocks.length; i++) {
    // Picking only the Y channel
    let yChannel = yiqBlocks[i][0] - 128;
    yChannels.push(yChannel);
  }
  // Seperate the pixles into 8 * 8 blocks
  let noBlocks = yChannels.length / (height * 8);
  let macroBlocks = [];
  for(let i = 0; i < noBlocks; i++) {
    blockIndex = i * 8;
    let macroBlock = [];
    for(let row = blockIndex; row < blockIndex + 8; row++) {
      let macroBlockRow = [];
      for(let col = blockIndex; col < blockIndex + 8; col++) {
        macroBlockRow.push(yChannels[ row * width + col  ]);
      }
      macroBlock.push(macroBlockRow);
    }
    macroBlocks.push(macroBlock);
  }
  return macroBlocks;
}
function seperateBlocks(macroBlocks, height, width) {
  let array = [];
  for(let i = 0; i < 8; i++) {
    for(j = 0; j < macroBlocks.length; j++) {
      let macroBlockRow = macroBlocks[j].pop();
      for(k = 0; k < 8; k++) {
        array.push(macroBlockRow.pop());
      }
    }
  }
  return array;
}
function DCT(macroBlocks) {
  // Iterate through each macro block
  for(let i = 0; i < macroBlocks.length; i++){
    for(let j = 0; j < 8; j++) {
      for(let k = 0; k < 8; k++) {
        // Iterate through each color channel
        // i => Index of the current macro block being processed
        // j => Index of the current row of the macro block being processed
        // k => Index of the current column of the macro block being processed
        // a => Amplitude of DCT
        let a = macroBlocks[i][j][k];
        macroBlocks[i][j][k] = a * Math.cos((2 * Math.PI * j * (2 * j + 1)) / 16) * Math.cos((2 * k * Math.PI * (2 * k + 1)) / 16);
      }
    }
  }
  return macroBlocks;
}
function inverseDCT(macroBlocks) {
  // Iterate through each macro block
  for(let i = 0; i < macroBlocks.length; i++){
    for(let j = 0; j < 8; j++) {
      for(let k = 0; k < 8; k++) {
        // Iterate through each color channel
        // i => Index of the current macro block being processed
        // j => Index of the current row of the macro block being processed
        // k => Index of the current column of the macro block being processed
        // a => Amplitude of DCT
        let a = macroBlocks[i][j][k];
        macroBlocks[i][j][k] = a * (1.414 / 7) * Math.cos((2 * Math.PI * j * (2 * j + 1)) / 16) * Math.cos((2 * k * Math.PI * (2 * k + 1)) / 16);
      }
    }
  }
  return macroBlocks;
}
function quantize(macroBlocks) {
  //  Create the quantization matrix
  let quantizationMatrix = [
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
  ];
  // Iterate through each macro block
  for(let i = 0; i < macroBlocks.length; i++){
    for(let j = 0; j < 8; j++) {
      for(let k = 0; k < 8; k++) {
        // Iterate through each color code
        // i => Index of the current macro block being processed
        // j => Index of the current row of the macro block being processed
        // k => Index of the current column of the macro block being processed
        let quantizationValue = quantizationMatrix[j][k];
        macroBlocks[i][j][k] = Math.round(macroBlocks[i][j][k] / quantizationValue);
      }
    }
  }
  return macroBlocks;
}
function deQuantize(macroBlocks) {
  //  Create the quantization matrix
  let quantizationMatrix = [
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
  ];
  // Iterate through each macro block
  for(let i = 0; i < macroBlocks.length; i++){
    for(let j = 0; j < 8; j++) {
      for(let k = 0; k < 8; k++) {
        // Iterate through each color code
        // i => Index of the current macro block being processed
        // j => Index of the current row of the macro block being processed
        // k => Index of the current column of the macro block being processed
        let quantizationValue = quantizationMatrix[j][k];
        macroBlocks[i][j][k] = macroBlocks[i][j][k] * quantizationValue;
      }
    }
  }
  return macroBlocks;
}
function zigZagScan(macroBlocks) {
  let array = [];
  for(let i = 0; i < macroBlocks.length; i++) {
    // ZigZag for right column
    for(let j = 0; j < 7; j++) {
      for(let k = 0; k <= j; k++) {
        array.push(macroBlocks[i][j - k][k]);
      }
    }
    // ZigZag for bottom row
    for(let j = 0; j < 8; j++) {
      for(let k = 7, l = 0; k >= j; k--, l++) {
        array.push(macroBlocks[i][k][l + j]);
      }
    }
  }
  return array;
}
function inverseZigZagScan(array) {
  let macroBlocks = [];
  for(let i = 0; i < array.length;) {
    // Allocate a new macro block of size 8 * 8
    let macroBlock = new Array(8);
    for(let l = 0; l < macroBlock.length; l++) {
      macroBlock[l] = new Array(8);
    }
    // ZigZag for right column
    for(let j = 0; j < 7; j++) {
      for(let k = 0; k <= j; k++) {
        macroBlock[j - k][k] = array[i];
        i++;
      }
    }
    // ZigZag for bottom row
    for(let j = 0; j < 8; j++) {
      for(let k = 7, l = 0; k >= j; k--, l++) {
        macroBlock[k][l + j] = array[i];
        i++;
      }
    }
    macroBlocks.push(macroBlock);
  }
  return macroBlocks;
}
function rleEncode(array, threshold) {
  let buffer = "";
  let count = 1;
  for(let i = 0; i < array.length;) {
    if(i + 1 < array.length && array[i] == array[i + 1]) {
      i++;
      count++;
    }
    else {
      if(count > threshold) {
        buffer += array[i] + "$" + count + ":";
      }
      else {
        for(let j = 0; j < count; j++) {
          buffer += array[i] + ":";
        }
      }
      count = 1;
      i++;
    }
  }
  // Remove trailing colon(:)
  buffer = buffer.substr(0, buffer.length - 1);
  return buffer;
}
function rleDecode(str, threshold) {
  let array = str.split(':');
  let decodedArray = [];
  for(let i = 0; i < array.length; i++) {
    let tmp = array[i].split('$');
    if(tmp.length == 2) {
      let element = tmp[0];
      let count = tmp[1];
      for(let j = 0; j < count; j++) {
        decodedArray.push(element);
      }
    }
    else {
      decodedArray.push(array[i]);
    }
  }
  return decodedArray;
}
function encode(pixels, height, width) {
  // Prepare the macroblocks
  let macroBlocks = prepareBlocks(pixels, height, width);
  // Perform DCT on the macroblocks
  macroBlocks = DCT(macroBlocks);
  // Quantize the macroblock using the quantization matrix
  macroBlocks = quantize(macroBlocks);
  // Perform zig zag scan
  array = zigZagScan(macroBlocks);
  // Perform RLE encoding
  array = rleEncode(array, 2);

  return array;
}
function decode(array, height, width) {
  // Expand the array
  array = rleDecode(array);
  // Inverse ZigZag scan
  let macroBlocks = inverseZigZagScan(array);
  // Dequantize the macroblocks
  macroBlocks = deQuantize(macroBlocks);
  // Inverse DCT
  macroBlocks = inverseDCT(macroBlocks);
  // Seperate the blocks into 1D array
  let pixels = seperateBlocks(macroBlocks, height, width);
  return pixels;
}


module.exports = {
  'encode': encode,
  'decode': decode
};
