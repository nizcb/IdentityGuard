// deploy_proof.js
const { Web3 } = require("web3");

const contractProofAge = require("./build/contracts/ProofContract.json");

const contractProofAge = require("./build/contracts/ProofContract.json");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/41236084bd704280905e270666af92ff`
  )
);

async function deploy_proof(proof, inputs) {
  const contract = new web3.eth.Contract(contractProofAge.abi);

  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + "40aa16520f8e31cf6b475924932468c88a08dc736fbc4b788e0ba57bb5c9eed3"
  );
  web3.eth.accounts.wallet.add(signer);

  const proofa = [proof.pi_a[0], proof.pi_a[1]];
  const proofc = [proof.pi_c[0], proof.pi_c[1]];
  const proofb = [
    [proof.pi_b[0][1], proof.pi_b[0][0]],
    [proof.pi_b[1][1], proof.pi_b[1][0]],
  ];

  const deployedContract = await contract
    .deploy({
      data: contractProofAge.bytecode,
      arguments: [proofa, proofb, proofc, inputs],
    })
    .send({
      from: signer.address,
      gas: "4700000",
      gasPrice: 10000000000,
    });

  console.log(deployedContract.options.address);
  return deployedContract.options.address;
}

module.exports = deploy_proof;
