const fs = require("node:fs");
const jackal_nodejs_1 = require("@jackallabs/jackal.nodejs");
const undici_1 = require("undici");
const path = require('path');
const fetch = require('node-fetch'); 
const { promisify } = require('util');
const { pipeline } = require('stream');

(0, undici_1.setGlobalDispatcher)(new undici_1.Agent({
    connect: {
      timeout: 120000,
      lookup: (hostname, options, callback) => {
        require('dns').lookup(hostname, { family: 4, ...options }, callback);
      }
    }
  }));
require('dotenv').config();
const mnemonic = process.env.MNEMONIC;
const fileName = process.env.FILE;
const sampleDir = process.env.SOURCE;
const signerChain = 'jackal-1';
const jklmn = {
    signerChain,
    queryAddr: 'https://grpc.jackalprotocol1.com',
    txAddr: 'https://rpc.jackalprotocol1.com'
};
async function run() {
    const fileName="1.spec.ts";
    const mnemonic = process.env.MNEMONIC; // Replace with your mnemonic phrase
    const m = await jackal_nodejs_1.MnemonicWallet.create(mnemonic);
    const w = await jackal_nodejs_1.WalletHandler.trackWallet(jklmn, m);
  
    const fileIo = await w.makeFileIoHandler("1.1.x");
    if (!fileIo) throw new Error("no FileIo");
  
 
  
    await fileIo.generateInitialDirs(null, ["s/Home"]);
  
    await fileIo.verifyFoldersExist(["s/Home"]);
    const dir = await fileIo.downloadFolder("s/Home");
  
    fs.readFile(`./tests/${fileName}`, async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
  
      const toUpload = new File([data], fileName, { type: "text/plain" });
  
      const handler = await FileUploadHandler.trackFile(toUpload, dir.getMyPath());
  
      const uploadList = {};
      uploadList[fileName] = {
        data: null,
        exists: false,
        handler: handler,
        key: fileName,
        uploadable: await handler.getForUpload(),
      };
  
      let tracker = { timer: 0, complete: 0 };
      const status = await fileIo.staggeredUploadFiles(uploadList, dir, tracker);
  
      console.log("STATUS:",status);
    })
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
      //  await run()
            .then(() => {
            console.log('tryDownload() Done');
        });
    }
    catch (error) {
      console.log(error);
      console.log("Alternatively...");

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

    process.exit(0);
})();