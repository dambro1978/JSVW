  // Use default values if inputs are empty
   // Use default values if inputs are empty
  const gradientThreshold = parseFloat(thresholdInput) || 500; // Default to 500 if input is invalid
  const gaussSize = parseInt(gaussSizeInput, 10) || 5; // Default to 5 if input is invalid

async function bindJ(data, Type, url, contentType, dataType) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: data,
         contentType: contentType,
         dataType: dataType,
         success: function (response) {
             const structJson = JSON.stringify(response);
             storeCapsule = JSON.parse(structJson);
         },
         failure: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }

 async function bindJ3(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: data,
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (response) {

             const structJson = JSON.stringify(response);
             storeCapsule = JSON.parse(structJson);
         },
         failure: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response.responseText;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindS(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: data,
         contentType: "charset=utf-8",
         dataType: "string",
             success: function (response) {
             storeCapsule = response;
         },
         failure: function (response) {
             storeCapsule = response; return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response; return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindX(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         dataType: "xml",
	data: data,
         contentType: "charset=utf-8",
         success: function (response) {
             const structXML = response.toXMLString();
             const parser = new DOMParser();
             storeCapsule = parser.parseFromString(structXML, "application/xml");
         },
         failure: function (response) {
             storeCapsule = response;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindH(data, Type, url) {
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
	data: data,
         dataType: 'html',
         contentType: "charset=utf-8",
         success: function (response) {
             storeCapsule = response;
         },
         failure: function (response) {
             storeCapsule = response;
             return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response;
             return storeCapsule;
         }

     });

     return storeCapsule;
 }
 async function bindB(data, Type, url) {
     datab=textToBinary(data);
     let storeCapsule;
     await $.ajax({
         type: Type,
         url: url,
         data: datab,
         contentType: "charset=utf-8",
         dataType: "string",
             success: function (response) {
	     storeCapsuleB = response;
	     storeCapsule = binaryToText(storeCapsuleB);
         },
         failure: function (response) {
             storeCapsule = response; return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response; return storeCapsule;
         }

     });

     return storeCapsule;
 }


function binaryToText(str) {
  let output = [];
  str.split(" ").forEach((element) => {
   if (element!=""){
    output.push(String.fromCharCode(parseInt(element, 2)));
	}
  });
  return output.join("");
}


function textToBinary(str) {
  let output = "";
  str.split("").forEach((element) => {
    let char = element.charCodeAt(0).toString(2);
	
    output += ("00000000" + char).slice(-8).concat(" ");
  });
  return output;
}

async function bindS(data, url) {
     let storeCapsule;
     await $.ajax({
         type: 'POST',
         url: url,
         data: data,
         contentType: "charset=utf-8",
         dataType: "string",
             success: function (response) {
             storeCapsule = response;
         },
         failure: function (response) {
             storeCapsule = response; return storeCapsule;
         },
         error: function (response) {
             storeCapsule = response; return storeCapsule;
         }

     });

     return storeCapsule;
 }
        function createGaussianKernel(size = 5, sigma = 1.0) {
            const kernel = [];
            const center = Math.floor(size / 2);
            const twoSigmaSquared = 2 * sigma * sigma;
            const sigmaRoot = Math.sqrt(2 * Math.PI * sigma * sigma);

            for (let y = 0; y < size; y++) {
                kernel[y] = [];
                for (let x = 0; x < size; x++) {
                    const dx = x - center;
                    const dy = y - center;
                    const value = Math.exp(-(dx * dx + dy * dy) / twoSigmaSquared) / sigmaRoot;
                    kernel[y][x] = value;
                }
            }
            return kernel;
        }

        function applyGaussianBlur(imageData, width, height, size = 5, sigma = 1.0) {
            const halfSize = Math.floor(size / 2);
            const output = new Uint8ClampedArray(width * height * 4);
            const kernel = createGaussianKernel(size, sigma);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;
                    for (let ky = -halfSize; ky <= halfSize; ky++) {
                        for (let kx = -halfSize; kx <= halfSize; kx++) {
                            const ix = Math.min(width - 1, Math.max(0, x + kx));
                            const iy = Math.min(height - 1, Math.max(0, y + ky));
                            const kernelValue = kernel[ky + halfSize][kx + halfSize];
                            const index = (iy * width + ix) * 4;
                            r += imageData[index] * kernelValue;
                            g += imageData[index + 1] * kernelValue;
                            b += imageData[index + 2] * kernelValue;
                        }
                    }
                    const outputIndex = (y * width + x) * 4;
                    output[outputIndex] = r;
                    output[outputIndex + 1] = g;
                    output[outputIndex + 2] = b;
                    output[outputIndex + 3] = 255;
                }
            }
            return new ImageData(output, width, height);
        }

        function calculateGradientValue(imageData, x, y, width) {
            const gx = (
                -imageData[(y - 1) * width * 4 + (x - 1) * 4] +
                imageData[(y - 1) * width * 4 + (x + 1) * 4] +
                -2 * imageData[y * width * 4 + (x - 1) * 4] +
                2 * imageData[y * width * 4 + (x + 1) * 4] +
                -imageData[(y + 1) * width * 4 + (x - 1) * 4] +
                imageData[(y + 1) * width * 4 + (x + 1) * 4]
            );

            const gy = (
                -imageData[(y - 1) * width * 4 + (x - 1) * 4] +
                -2 * imageData[(y - 1) * width * 4 + x * 4] +
                -imageData[(y - 1) * width * 4 + (x + 1) * 4] +
                imageData[(y + 1) * width * 4 + (x - 1) * 4] +
                2 * imageData[(y + 1) * width * 4 + x * 4] +
                imageData[(y + 1) * width * 4 + (x + 1) * 4]
            );

            const gradientMagnitude = Math.sqrt(gx * gx + gy * gy);

            return gradientMagnitude;
        }

        function calculateDiagonalProductForPoint(imageData, x, y, width, gaussSize, sigma) {
            const halfSize = Math.floor(gaussSize / 2);
            const kernel = createGaussianKernel(gaussSize, sigma);
            let product = 1;

            for (let ky = -halfSize; ky <= halfSize; ky++) {
                for (let kx = -halfSize; kx <= halfSize; kx++) {
                    const ix = Math.min(width - 1, Math.max(0, x + kx));
                    const iy = Math.min(width - 1, Math.max(0, y + ky));
                    const kernelValue = kernel[ky + halfSize][kx + halfSize];
                    if (kx === ky) {
                        product *= kernelValue;
                    }
                }
            }

            return product;
        }

        function detectKeypoints(image, gradientThreshold = 500, gaussSize = 5) {
            const sigma = 1.0;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const blurredImageData = applyGaussianBlur(imageData.data, canvas.width, canvas.height, gaussSize, sigma);
            return detectKeypointsFromImageData(blurredImageData.data, canvas.width, canvas.height, gradientThreshold, gaussSize);
        }

        function detectKeypointsFromImageData(imageData, width, height, gradientThreshold, gaussSize) {
            const keypoints = [];
            const halfSize = Math.floor(gaussSize / 2);

            for (let y = halfSize; y < height - halfSize; y++) {
                for (let x = halfSize; x < width - halfSize; x++) {
                    const gradientMagnitude = calculateGradientValue(imageData, x, y, width);

                    if (gradientMagnitude > gradientThreshold) {
                        const diagonalProduct = calculateDiagonalProductForPoint(imageData, x, y, width, gaussSize, 1.0);
                        keypoints.push({
                            x,
                            y,
                            diagonalProduct,
                            gradientMagnitude
                        });
                    }
                }
            }
            return keypoints;
        }

        function drawImageWithKeypoints(image, keypoints) {
            const originalCanvas = document.getElementById('originalCanvas');
            const keypointsCanvas = document.getElementById('keypointsCanvas');
            const originalCtx = originalCanvas.getContext('2d');
            const keypointsCtx = keypointsCanvas.getContext('2d');

            originalCanvas.width = image.width;
            originalCanvas.height = image.height;
            keypointsCanvas.width = image.width;
            keypointsCanvas.height = image.height;

            originalCtx.drawImage(image, 0, 0);

            keypointsCtx.drawImage(image, 0, 0);
            keypointsCtx.globalCompositeOperation = 'source-over';
            keypointsCtx.strokeStyle = 'red';
            keypointsCtx.lineWidth = 2;

            keypoints.forEach(point => {
                keypointsCtx.beginPath();
                keypointsCtx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                keypointsCtx.stroke();
            });
        }
		






	//Created by Giuseppe D'Ambrosio
