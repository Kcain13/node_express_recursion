// node script that reads a file line by line
// each line being treated as URL

const fs = require('fs').promises;
const process = require('process');
const axios = require('axios');
const { URL } = require('url');

/** read file at path and print data */

async function cat(path) {
    try {
        const data = await fs.readFile(path, 'utf8');
        return data.split(/\r?\n/).filter(line => line.trim());
    } catch (err) {
        console.error(`Error reading ${path}: ${err}`);
        process.exit(1);
    }
}

async function webCat(url) {
    try {
        const resp = await axios.get(url);
        console.log(resp.data);
    } catch (err) {
        console.error(`Error fetching ${url}: ${err}`);
    }
}

async function processUrlsFromPath(filePath) {
    try {
        const urls = await cat(filePath);
        const downloadPromises = [];

        for (const url of urls) {
            try {
                // Parse the URL to extract the hostname
                const parsedUrl = new URL(url);
                const hostname = parsedUrl.hostname;

                // Create a promise for each URL download
                const downloadPromise = axios.get(url)
                    .then((response) => {
                        const htmlContent = response.data;
                        const outputFilename = `${hostname}.html`;

                        // Write to the output file
                        fs.writeFile(outputFilename, htmlContent)
                            .then(() => console.log(`Gave a ping to ${hostname}`))
                            .catch((writeError) => console.error(`Couldn't download ${url}:`, fetchError.message));
                    })
                    .catch((fetchError) => console.error(`This ${url} is whack:`, fetchError.message));

                downloadPromises.push(downloadPromise)
            } catch (urlParseError) {
                console.error(`Error parsing URL ${url}:`, urlParseError.message);
            }
        }

        // Wait for all download promises to complete
        await Promise.all(downloadPromises);
    } catch (readError) {
        console.error(`Error reading the file ${filePath}:`, readError.message);
        process.exit(1);
    }
}

async function main() {
    const path = process.argv[2];

    if (path && path.slice(0, 4) === 'http') {
        await webCat(path);
    } else {
        await processUrlsFromPath(path);
    }
}

main();