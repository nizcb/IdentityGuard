const proofData = require("../ZKP/zokrates_proof_20240325170717/proof.json");

const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

const contractProofAge = require("./build/contracts/ProofContract.json");
const contractVerifier = require("./build/contracts/Verifier.json");

const web3 = new Web3(process.env.WEB3_PROVIDER);

async function main() {
  const contract = new web3.eth.Contract(contractProofAge.abi);

  const accounts = await web3.eth.getAccounts();
  const accountNumber = accounts[0];

  const deployedContract = await contract
    .deploy({
      data: contractProofAge.bytecode,
      arguments: [
        proofData.proof.a,
        proofData.proof.b,
        proofData.proof.c,
        proofData.inputs,
      ],
    })
    .send({
      from: accountNumber,
      gas: "4700000",
    });

  console.log(deployedContract.options.address);

  const newProof = await deployedContract.methods.getProof().call();

  const newInputs = await deployedContract.methods.getInputs().call();

  console.log(newProof);
  console.log(newInputs == 1);

  const contractVerif = new web3.eth.Contract(contractVerifier.abi);

  const proofStruct = {
    a: newProof.a,
    b: newProof.b,
    c: newProof.c,
  };

  const ContractVerif = await contractVerif
    .deploy({
      data: contractVerifier.bytecode,
    })
    .send({
      from: accountNumber,
      gas: "4700000",
    });

  const verif = await ContractVerif.methods
    .verifyTx(proofStruct, newInputs)
    .call();

  console.log(verif);
}

main();
