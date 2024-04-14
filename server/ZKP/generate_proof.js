// generate_proof.js

const util = require("util");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const execPromise = util.promisify(exec);

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function ZKP(dob) {
  const age = calculateAge(dob);
  

  const projectDir = `zokrates_proof`;
  const dockerCommand = `
    docker run -v ${process.cwd()}/${projectDir}:/home/zokrates/code zokrates/zokrates /bin/bash -c "
        cd code
        zokrates compute-witness -a ${age}
        zokrates generate-proof
    "`;


  try {
    // Execute ZoKrates inside Docker using Promises
    const { stdout, stderr } = await execPromise(dockerCommand);
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    // Read proof.json and verifier.sol files
    const proofPath = path.join(projectDir, "proof.json");

    const proofString = fs.readFileSync(proofPath, "utf8");

    const proofData = JSON.parse(proofString);
    const proof = proofData.proof;
    const inputs = proofData.inputs;

    console.log("Proof and Verifier have been generated.");
    return { proof, inputs}; // Return proof and verifier as an object
  } catch (error) {
    console.error(`exec error: ${error}`);
    throw error;
  }
}

module.exports = ZKP;
