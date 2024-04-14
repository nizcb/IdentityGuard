// verify_proof.js
require("dotenv").config();
const { Web3 } = require("web3");

const contractVerifier = require("./build/contracts/VerifierAge.json");
const contractProofAge = require("./build/contracts/ProofContract.json");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/41236084bd704280905e270666af92ff`
  )
);

async function verify_proof(address) {
  const contract = new web3.eth.Contract(contractProofAge.abi, address);

  // Contract address
  const contractAddress = "0x6de7DC9785753F7aCCf8c3f00424f81A1ab43377";

  const addressVerif = "0x1d50c589c9B16a8459fA3BCf278428991C8E7fDb";

  const proof = await contract.methods.getProof().call();

  const inputs = await contract.methods.getInputs().call();

  const contractVerif = new web3.eth.Contract(
    contractVerifier.abi,
    addressVerif
  );

  const verif = await contractVerif.methods
    .verifyProof(proof.a, proof.b, proof.c, inputs)
    .call();
  return verif;
}

module.exports = verify_proof;
