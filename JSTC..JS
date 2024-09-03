
                // Parse inputs with default values if empty
                const gradientThreshold = parseFloat(thresholdInput) || 500;
                const gaussSize = parseInt(gaussSizeInput, 10) || 5;

     

        /**
         * Creates a Gaussian kernel for image blurring.
         * @param {number} size - The size of the Gaussian kernel.
         * @param {number} sigma - The standard deviation of the Gaussian distribution.
         * @returns {Array} - The generated Gaussian kernel.
         */
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

        /**
         * Applies Gaussian blur to an image.
         * @param {Uint8ClampedArray} imageData - The image data to be blurred.
         * @param {number} width - The width of the image.
         * @param {number} height - The height of the image.
         * @param {number} size - The size of the Gaussian kernel.
         * @param {number} sigma - The standard deviation of the Gaussian distribution.
         * @returns {ImageData} - The blurred image data.
         */
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

        /**
         * Calculates the gradient magnitude and orientation at a specific pixel.
         * @param {Uint8ClampedArray} imageData - The image data to analyze.
         * @param {number} x - The x-coordinate of the pixel.
         * @param {number} y - The y-coordinate of the pixel.
         * @param {number} width - The width of the image.
         * @returns {Object} - An object containing gradient magnitude and orientation.
         */
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

        /**
         * Calculates the mean value of descriptors around a specific pixel.
         * @param {Uint8ClampedArray} imageData - The image data to analyze.
         * @param {number} x - The x-coordinate of the pixel.
         * @param {number} y - The y-coordinate of the pixel.
         * @param {number} width - The width of the image.
         * @param {number} gaussSize - The size of the Gaussian kernel.
         * @param {number} sigma - The standard deviation of the Gaussian distribution.
         * @returns {number} - The mean value of descriptors.
         */
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

        /**
         * Detects keypoints in an image using Gaussian blur and gradient analysis.
         * @param {Image} image - The image to process.
         * @param {number} gradientThreshold - The threshold for gradient magnitude to detect keypoints.
         * @param {number} gaussSize - The size of the Gaussian kernel.
         * @returns {Array} - An array of detected keypoints.
         */
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

        /**
         * Detects keypoints from image data by analyzing gradients and applying a threshold.
         * @param {Uint8ClampedArray} imageData - The image data to process.
         * @param {number} width - The width of the image.
         * @param {number} height - The height of the image.
         * @param {number} gradientThreshold - The threshold for gradient magnitude to detect keypoints.
         * @param {number} gaussSize - The size of the Gaussian kernel.
         * @returns {Array} - An array of detected keypoints.
         */
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

        /**
         * Filters keypoints to find stable ones by comparing different Gaussian kernel sizes.
         * @param {Image} image - The image to process.
         * @param {number} gradientThreshold - The threshold for gradient magnitude to detect keypoints.
         * @param {Array} gaussSizes - An array of Gaussian kernel sizes to consider.
         * @returns {Array} - An array of stable keypoints.
         */
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

        /**
         * Main function to detect keypoints using Gaussian blur and gradient analysis.
         * @param {Image} image - The image to process.
         * @param {number} gradientThreshold - The threshold for gradient magnitude to detect keypoints.
         * @param {number} gaussSize - The size of the Gaussian kernel.
         * @returns {Array} - An array of detected keypoints.
         */
        function KeypointsDetectionAlgorithm(image, gradientThreshold = 500, gaussSize = 5) {
            const gaussSizes = [gaussSize, gaussSize + 2, gaussSize + 4];
            return filterStableKeypoints(image, gradientThreshold, gaussSizes);
        }

        /**
         * Draws the image and highlights keypoints on a canvas.
         * @param {Image} image - The image to draw.
         * @param {Array} keypoints - The keypoints to highlight on the image.
         */
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

/**
 * Initializes an SQLite database using SQL.js.
 * @returns {Promise} - A promise that resolves to the initialized database object.
 */
async function initializeDatabase() {
    // Load the SQL.js library asynchronously. This library allows us to use SQLite in the browser.
    const SQL = await initSqlJs();
    
    // Create a new SQLite database instance.
    const db = new SQL.Database();
    
    // Create a table named 'keypoints' to store the keypoints data.
    // The table has the following columns:
    // - id: An integer primary key to uniquely identify each keypoint.
    // - gradient_magnitude: A real number representing the magnitude of the gradient at the keypoint.
    // - gradient_orientation: A real number representing the orientation of the gradient at the keypoint.
    // - descriptor_mean: A real number representing the mean value of the descriptor for the keypoint.
    db.run(`
        CREATE TABLE keypoints (
            id INTEGER PRIMARY KEY,
            gradient_magnitude REAL,
            gradient_orientation REAL,
            descriptor_mean REAL
        )
    `);
    
    // Return the database object for further operations.
    return db;
}

/**
 * Inserts an array of keypoints into the database.
 * @param {Object} db - The SQLite database object.
 * @param {Array} keypoints - An array of keypoints to insert.
 */
function insertKeypoints(db, keypoints) {
    // Prepare an SQL statement to insert keypoint data into the 'keypoints' table.
    const stmt = db.prepare(`
        INSERT INTO keypoints (gradient_magnitude, gradient_orientation, descriptor_mean)
        VALUES (?, ?, ?)
    `);
    
    // Iterate over each keypoint and execute the prepared statement to insert the keypoint data.
    keypoints.forEach(point => {
        stmt.run([point.gradient_magnitude, point.gradient_orientation, point.descriptor_mean]);
    });
    
    // Free the statement resources after use.
    stmt.free();
}

/**
 * Matches query keypoints against the keypoints stored in the database based on a given tolerance.
 * @param {Object} db - The SQLite database object.
 * @param {Array} queryPoints - An array of keypoints to match against the database.
 * @param {Object} tolerance - The tolerance for matching keypoints, including:
 *   - gradient_magnitude: Maximum allowed difference in gradient magnitude.
 *   - gradient_orientation: Maximum allowed difference in gradient orientation.
 *   - descriptor_mean: Maximum allowed difference in descriptor mean.
 * @returns {Array} - An array of matched keypoints.
 */
function matchTripleKey(db, queryPoints, tolerance) {
    const matches = [];
    
    // Iterate over each query keypoint and check for matches in the database.
    queryPoints.forEach(query => {
        // Execute a SQL query to find keypoints in the database that match the query keypoint within the tolerance.
        const result = db.exec(`
            SELECT * FROM keypoints
            WHERE ABS(gradient_magnitude - ${query.gradient_magnitude}) < ${tolerance.gradient_magnitude}
            AND ABS(gradient_orientation - ${query.gradient_orientation}) < ${tolerance.gradient_orientation}
            AND ABS(descriptor_mean - ${query.descriptor_mean}) < ${tolerance.descriptor_mean}
        `);
        
        // If any keypoints are found that match the query, add the query keypoint to the matches array.
        if (result[0].values.length > 0) {
            matches.push(query);
        }
    });
    
    return matches;
}

/**
 * Sorts an array of keypoints by gradient magnitude, gradient orientation, and descriptor mean.
 * @param {Array} keypoints - The array of keypoints to sort.
 * @returns {Array} - The sorted array of keypoints.
 */
function sortKeypoints(keypoints) {
    return keypoints.sort((a, b) => {
        // Sort first by gradient_magnitude, then by gradient_orientation, and finally by descriptor_mean.
        return a.gradient_magnitude - b.gradient_magnitude ||
               a.gradient_orientation - b.gradient_orientation ||
               a.descriptor_mean - b.descriptor_mean;
    });
}

/**
 * Matches query keypoints against a sorted list of keypoints based on a given tolerance.
 * @param {Array} keypoints - The array of keypoints to match against.
 * @param {Array} queryPoints - The array of keypoints to query.
 * @param {Object} tolerance - The tolerance for matching keypoints, including:
 *   - gradient_magnitude: Maximum allowed difference in gradient magnitude.
 *   - gradient_orientation: Maximum allowed difference in gradient orientation.
 *   - descriptor_mean: Maximum allowed difference in descriptor mean.
 * @returns {Array} - An array of matched keypoints.
 */
function matchTripleKey(keypoints, queryPoints, tolerance) {
    // Sort keypoints for efficient matching.
    const sortedKeypoints = sortKeypoints(keypoints);

    const matches = [];
    
    // Iterate over each query keypoint and find matches in the sorted keypoints list.
    queryPoints.forEach(query => {
        // Find a keypoint in the sorted list that matches the query keypoint within the tolerance.
        const match = sortedKeypoints.find(point => 
            Math.abs(point.gradient_magnitude - query.gradient_magnitude) < tolerance.gradient_magnitude &&
            Math.abs(point.gradient_orientation - query.gradient_orientation) < tolerance.gradient_orientation &&
            Math.abs(point.descriptor_mean - query.descriptor_mean) < tolerance.descriptor_mean
        );
        
        // If a match is found, add the query keypoint to the matches array.
        if (match) {
            matches.push(query);
        }
    });
    
    return matches;
}

/**
 * Connects to a SQLite database file or initializes a new database if the file does not exist.
 * @param {string} dbFilePath - The path to the SQLite database file.
 * @returns {Promise} - A promise that resolves to the database object.
 */
async function connectToDatabase(dbFilePath) {
    // Load the SQL.js library asynchronously.
    const SQL = await initSqlJs();
    
    let db;

    try {
        // Attempt to load the existing SQLite database from the file system (if applicable).
        const response = await fetch(dbFilePath);
        const fileBuffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(fileBuffer));
    } catch (error) {
        // If the database file does not exist, create a new database.
        db = new SQL.Database();
        
        // Create tables and initialize the database schema.
        db.run(`
            CREATE TABLE keypoints (
                id INTEGER PRIMARY KEY,
                gradient_magnitude REAL,
                gradient_orientation REAL,
                descriptor_mean REAL
            )
        `);
    }

    // Return the database object for further operations.
    return db;
}


//Created by Giuseppe D'Ambrosio
