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
            const gradientOrientation = Math.atan2(gy, gx) * (180 / Math.PI);

            return { gradientMagnitude, gradientOrientation };
        }

        function calculateDescriptorMean(imageData, x, y, width, gaussSize, sigma) {
            const halfSize = Math.floor(gaussSize / 2);
            const kernel = createGaussianKernel(gaussSize, sigma);
            let descriptorSum = 0;
            let count = 0;

            for (let ky = -halfSize; ky <= halfSize; ky++) {
                for (let kx = -halfSize; kx <= halfSize; kx++) {
                    const ix = Math.min(width - 1, Math.max(0, x + kx));
                    const iy = Math.min(width - 1, Math.max(0, y + ky));
                    const index = (iy * width + ix) * 4;
                    descriptorSum += imageData[index] + imageData[index + 1] + imageData[index + 2];
                    count += 3;
                }
            }

            return descriptorSum / count;
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
                    const { gradientMagnitude, gradientOrientation } = calculateGradientValue(imageData, x, y, width);

                    if (gradientMagnitude > gradientThreshold) {
                        const descriptorMean = calculateDescriptorMean(imageData, x, y, width, gaussSize, 1.0);
                        keypoints.push({
                            x,
                            y,
                            descriptorMean,
                            gradientMagnitude,
                            gradientOrientation
                        });
                    }
                }
            }
            return keypoints;
        }

        function filterStableKeypoints(image, gradientThreshold = 500, gaussSizes = [3, 5, 7]) {
            const sigma = 1.0;
            const stableKeypoints = [];

            const keypointsMap = new Map();

            gaussSizes.forEach(gaussSize => {
                const keypoints = detectKeypoints(image, gradientThreshold, gaussSize);

                keypoints.forEach(kp => {
                    const key = `${kp.x}-${kp.y}`;
                    if (!keypointsMap.has(key)) {
                        keypointsMap.set(key, []);
                    }
                    keypointsMap.get(key).push(kp);
                });
            });

            keypointsMap.forEach((kpList, key) => {
                const meanDescriptor = kpList.reduce((sum, kp) => sum + kp.descriptorMean, 0) / kpList.length;
                const meanMagnitude = kpList.reduce((sum, kp) => sum + kp.gradientMagnitude, 0) / kpList.length;
                const meanOrientation = kpList.reduce((sum, kp) => sum + kp.gradientOrientation, 0) / kpList.length;

                const stable = kpList.every(kp =>
                    Math.abs(kp.descriptorMean - meanDescriptor) < 1.0 &&
                    Math.abs(kp.gradientMagnitude - meanMagnitude) < 1.0 &&
                    Math.abs(kp.gradientOrientation - meanOrientation) < 1.0
                );

                if (stable) {
                    stableKeypoints.push({
                        x: kpList[0].x,
                        y: kpList[0].y,
                        descriptorMean: meanDescriptor,
                        gradientMagnitude: meanMagnitude,
                        gradientOrientation: meanOrientation
                    });
                }
            });

            return stableKeypoints;
        }

        function KeypointsDetectionAlgorithm(image, gradientThreshold = 500, gaussSize = 5) {
            const gaussSizes = [gaussSize, gaussSize + 2, gaussSize + 4];
            return filterStableKeypoints(image, gradientThreshold, gaussSizes);
        }

        function drawImageWithKeypoints(image, keypoints) {
            const canvas = document.getElementById('keypointsCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            keypoints.forEach(keypoint => {
                ctx.beginPath();
                ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }





	//Created by Giuseppe D'Ambrosio
