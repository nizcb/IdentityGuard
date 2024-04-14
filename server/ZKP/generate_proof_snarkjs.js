// generate_proof_snarkjs.js

const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const vKey = require("../ZKP/snarkjs_age/verification_key.json")



function calculateAge(dob) {
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function ZKP(dob) {
  const age = calculateAge(dob);

  try{
    const circuitWasmPath = path.resolve(__dirname, "./snarkjs_age/circuit_js/circuit.wasm");
    const circuitProofKeyPath = path.resolve(__dirname, "./snarkjs_age/circuit_final.zkey");
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({age : age+1, rand : 1}, circuitWasmPath, circuitProofKeyPath);

    return { proof, publicSignals };
  } catch (err){
    console.log(err);
  }
}

module.exports = ZKP;