const { SigningCosmosClient } = require("@cosmjs/launchpad");

const mnemonic = "your mnemonic here";
const akashEndpoint = "http://rpc.akash.forbole.com:26657";
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'akash' });
const client = new SigningCosmosClient(akashEndpoint, wallet.address, wallet);

async function deploy() {
  // Load deployment configuration
  const deploymentConfig = fs.readFileSync("deployment.yaml", "utf8");

  // Create and sign a deployment transaction
  const createDeploymentMsg = {
    type: "akash/MsgCreateDeployment",
    value: {
      // Deployment values go here
      id: {
        owner: wallet.address,
        dseq: Date.now(),
      },
      groups: [
        {
          name: "default",
          requirements: {},
          resources: [
            // Resources from your yaml
          ],
        },
      ],
    },
  };

  // Broadcasting the transaction
  const result = await client.signAndBroadcast([createDeploymentMsg], {
    amount: [{ amount: "5000", denom: "uakt" }], // Fee
    gas: "200000", // Gas limit
  });

  console.log(result);
}

deploy().catch(console.error);
