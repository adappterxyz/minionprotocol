
exports.generateTONContracts= async(src) =>{
    // You can get compiler version 
    
const {compileFunc, compilerVersion} = await import('@ton-community/func-js');
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Targets of your project
        targets: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // The rest of the files which are included in main.fc if any
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

   
}

exports.generateContracts = async(templateData)=>{
const { evm } = await import("./templates/evm");
const { solidityCompiler }= await import("./solc/index");
var contracts ={};
var fnBody ='';
const fnlib= JSON.parse(localStorage.codeBlock)
console.log(templateData,JSON.parse(localStorage.codeBlock));
for (const v of templateData.networks) {
    var fnBody = '';
    for (let k2 of templateData.functions) {
        console.log(v, k2);
        if (typeof fnlib[k2] !== 'undefined') {
            console.log(fnlib[k2][v]);
            fnBody += '\n' + fnlib[k2][v];
        }
    }
    console.log(v, fnBody);

    const version = 'soljson-v0.8.20+commit.a1b79de6.js';
    const result = await solidityCompiler({
        version: `https://binaries.soliditylang.org/bin/${version}`,
        contractBody: evm(templateData.templateName, fnBody),
        options: { optimizer: { enabled: true, runs: 1000 } }
    });
    const abi = result.contracts.Compiled_Contracts[templateData.templateName].abi;
    const byteCode = result.contracts.Compiled_Contracts[templateData.templateName].evm.bytecode.object;
    contracts[v] = { abi, byteCode };
}
console.log(contracts);
return contracts;
}

exports.deployContracts=async(contractObj)=>{
    const {  ethers } = await import('ethers');
    const {  infura , zan } = await import('../init/rpc');
     const RPC = Object.assign({}, infura, zan);
     const chainid ='BSC';
     
    const apiUrl = RPC[chainid]['Testnet'];//'https://api.zan.top/node/v1/bsc/testnet/667a3df7293e4879bb69e5e3227409df'; 
    const privateKey = 'd7e3d5d4b546deb646b23975b96fb837514a0bdf96b01def2c7e4fb84a287747';
 
    const provider = new ethers.JsonRpcProvider(apiUrl);

    console.log(0,provider);
    // Create a wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractFactory = new ethers.ContractFactory(contractObj[chainid]['abi'], contractObj[chainid]['byteCode'], wallet);
    try {
        const contract = await contractFactory.deploy();
      //  await contract.deployed();
        console.log("Contract deployed to address:", contract);
        return contract.target;
    } catch (error) {
        console.error("Failed to deploy contract:", error);
    }

 
    }


exports.sendTrx=async(fn,val,address,abi)=>{
        const {  ethers } = await import('ethers');
        const {  infura , zan } = await import('../init/rpc');
        const RPC = Object.assign({}, infura, zan);
    
      // const apiUrl = 'https://polygon-mainnet.infura.io/v3/d8800458785844c7aebc2a970adfd97f'; //polygon
        const apiUrl = 'https://api.zan.top/node/v1/bsc/testnet/667a3df7293e4879bb69e5e3227409df'; //BSC
        var privateKey;
        if(typeof val[0] == 'undefined'){
            
            privateKey = 'd7e3d5d4b546deb646b23975b96fb837514a0bdf96b01def2c7e4fb84a287747';
        }else if(val[0]==11){
             privateKey = '089c05a7288fb1ef8334d122fb879b013e900dd438dc0ebdcb92dfac0b3d2a0e';
             console.log(0);
         }else{
             privateKey = 'd7e3d5d4b546deb646b23975b96fb837514a0bdf96b01def2c7e4fb84a287747';
             console.log(1);
    }
    console.log(val)
     console.log(privateKey);
        const provider = new ethers.JsonRpcProvider(apiUrl);
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log(address, abi, wallet);   
        // Create a contract instance
        const contract = new ethers.Contract(address, abi, wallet);
        const contractfn = contract[fn];
            try {
                const result = await contractfn(...val);
                console.log('Result from ',fn +":", result);
            } catch (error) {
                console.error('Failed to call ',fn +":",  error);
            }

        }    
        