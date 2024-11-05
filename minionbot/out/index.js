const fs = require("node:fs");
const jackal_nodejs_1 = require("@jackallabs/jackal.nodejs");
const undici_1 = require("undici");
const path = require('path');
const fetch = require('node-fetch'); 
const { promisify } = require('util');
const { pipeline } = require('stream');
const { execSync } = require('child_process');

(0, undici_1.setGlobalDispatcher)(new undici_1.Agent({
    connect: {
      timeout: 120000,
      lookup: (hostname, options, callback) => {
        require('dns').lookup(hostname, { family: 4, ...options }, callback);
      }
    }
  }));
require('dotenv').config();
// const mnemonic = process.env.MNEMONIC;
const fileName = process.env.FILE;
const sampleDir = process.env.SOURCE;
const signerChain = 'jackal-1';
const jklmn = {
    signerChain,
    queryAddr: 'https://grpc.jackalprotocol1.com',
    txAddr: 'https://rpc.jackalprotocol1.com'
};
async function run() {
    const fileName = "fillform.spec.ts";
    return new Promise((resolve, reject) => {
        fs.readFile(`./tests/${fileName}`, async (err, data) => {
            if (err) {
                console.error('Error reading test file:', err);
                reject(err);
                return;
            }
            
            try {
                console.log('Running Playwright test...');
                execSync(`npx playwright test ${fileName}`, { 
                    stdio: 'inherit',
                    cwd: process.cwd() // Ensure we're in the right directory
                });
                console.log('Playwright test completed');
                resolve();
            } catch (error) {
                console.error('Error running Playwright test:', error);
                reject(error);
            }
        });
    });
}
async function tryDownload() {
    const m = await jackal_nodejs_1.MnemonicWallet.create(mnemonic);
    const w = await jackal_nodejs_1.WalletHandler.trackWallet(jklmn, m);
    const fileIo = await w.makeFileIoHandler('1.0.9');
    
    const downloadDetails = {
        rawPath: 's/Home/example.spec.ts', // manual complete file path OR pathOfFirstChild
        owner: w.getJackalAddress(), // JKL address of file owner
        isFolder: false
      }

      
      const dl = await fileIo.downloadFile({
        rawPath: `s/Home/${fileName}`,
        owner: w.getJackalAddress()
    }, {
        track: 0
    });
      //const fileHanlder = await fileIo.downloadFile(downloadDetails, { track: 0 })
    
      fs.writeFileSync(`./tests/${fileName}`, new Uint8Array(await dl.receiveBacon().arrayBuffer()), {});
     
}

  (async function () {
  
  
    try {
        await tryDownload()
            .then(() => {
            console.log('tryDownload() Done');
        });
    }
    catch (error) {
      console.log(error);
      console.log("Attempting fallback download...");

        const fileUrl = 'https://app.minionprotocol.com/fillform.spec.ts';
        const dir = './tests/';
        const streamPipeline = promisify(pipeline);

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${fileUrl}: ${response.statusText}`);
            }

            const fileName = path.basename(fileUrl);
            const dest = fs.createWriteStream(path.join(dir, fileName));

            await streamPipeline(response.body, dest);

            console.log('File downloaded successfully.');
        } catch (fallbackError) {
            console.error('Error in fallback download method:', fallbackError);
        }
    }
    
    try {
        console.log('Starting Playwright test execution...');
        await run();
        console.log('All operations completed successfully');
    } catch (error) {
        console.error('Failed to run tests:', error);
        process.exit(1);
    }
    process.exit(0);
})();