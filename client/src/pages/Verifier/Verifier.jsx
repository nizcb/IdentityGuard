import React, { useState, useEffect } from "react";
import QRious from "qrious";
import axios from "axios";
import io from "socket.io-client";
import "./style.css";
import {Web3} from "web3";


const contractProofABI = [
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_a",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[][]",
        "name": "_b",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[]",
        "name": "_c",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_inputs",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getInputs",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProof",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256[]",
            "name": "a",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[][]",
            "name": "b",
            "type": "uint256[][]"
          },
          {
            "internalType": "uint256[]",
            "name": "c",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ProofContract.Proof",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "inputs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_inputs",
        "type": "uint256[]"
      }
    ],
    "name": "setInputs",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_a",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[][]",
        "name": "_b",
        "type": "uint256[][]"
      },
      {
        "internalType": "uint256[]",
        "name": "_c",
        "type": "uint256[]"
      }
    ],
    "name": "setProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractVerifABI = [
  {
    "inputs": [
      {
        "internalType": "uint256[2]",
        "name": "_pA",
        "type": "uint256[2]"
      },
      {
        "internalType": "uint256[2][2]",
        "name": "_pB",
        "type": "uint256[2][2]"
      },
      {
        "internalType": "uint256[2]",
        "name": "_pC",
        "type": "uint256[2]"
      },
      {
        "internalType": "uint256[2]",
        "name": "_pubSignals",
        "type": "uint256[2]"
      }
    ],
    "name": "verifyProof",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/41236084bd704280905e270666af92ff`,
  ),
);


function Proof({ proof, onVerifyAnother }) {
  return (
    <div>
      <h2>Preuve reçue :</h2>
      <p>{proof}</p>
      <button onClick={onVerifyAnother}>Vérifier un autre client</button>
    </div>
  );
}

function VerifierPage() {
  const [verifierId, setVerifierId] = useState("");
  const [proof, setProof] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);

  useEffect(() => {
    const fetchVerifier = async () => {
      const storedVerifierId = localStorage.getItem("verifierId");
      if (storedVerifierId) {
        try {
          const response = await axios.get(`/verifiers/${storedVerifierId}`);
          if (!response.data.exists) {
            setShowGenerateButton(true);
            localStorage.removeItem('verifierId');
          } else {
            setVerifierId(storedVerifierId);
            setShowGenerateButton(false);
          }
        } catch (error) {
          console.error("Erreur lors de la requête Axios :", error);
          // Gérer l'erreur selon vos besoins
        }
      } else {
        setShowGenerateButton(true);
      }
    };
  
    fetchVerifier(); // Appel de la fonction pour récupérer le vérificateur
  }, [verifierId]);
  

  useEffect(() => {
    if (verifierId) {
      const newSocket = io(import.meta.env.VITE_API_URL + import.meta.env.VITE_SOCKET_PORT);
      setSocket(newSocket);
      newSocket.emit("joinVerifier", verifierId);

      newSocket.on("proof", async (proofData) => {
        const contract = new web3.eth.Contract(contractProofABI, proofData);

        const proof = await contract.methods.getProof().call();

        const inputs = await contract.methods.getInputs().call();

        const address_verif = "0x1d50c589c9B16a8459fA3BCf278428991C8E7fDb";
        const contractVerif = new web3.eth.Contract(contractVerifABI, address_verif);


        //const verif = await contractVerif.methods.verifyProof(proofa, proofb, proofc, inputs).call();
        //console.log(verif);
    if(true){
        if(inputs[0] == 1){
            const proofData = "la verification est valide";
            setProof(proofData);
        }else{
            const proofData = "l'age est inferieur à 18 ans";
            setProof(proofData);
        }
    } else {
        console.log("la preuve est incorrecte");
    }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [verifierId]);

  useEffect(() => {
    if (showQR && verifierId) {
      generateQR(verifierId);
    }
  }, [showQR, verifierId]);

  const generateNewVerifier = async () => {
    try {
      const response = await axios.post("/verifiers");
      if (response.status === 201) {
        const verifierData = response.data;
        const newVerifierId = verifierData.verifierId;

        setVerifierId(newVerifierId);
        localStorage.setItem("verifierId", newVerifierId);
        setShowGenerateButton(false);
      } else {
        throw new Error(
          "Erreur lors de la création de l'objet vérificateur: " +
            response.status
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création du vérificateur:", error);
    }
  };

  const generateQR = (verifierId) => {
    try {
      var qrCodeCanvas = document.getElementById("qrcode");
      new QRious({
        element: qrCodeCanvas,
        value: verifierId,
        size: 300,
      });
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
    }
  };

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleHideQR = () => {
    setShowQR(false);
  };

  const handleVerifyAnother = () => {
    setShowQR(false);
    setProof(null);
  };

  const handleGenerateVerifier = () => {
    generateNewVerifier();
    setShowGenerateButton(false); // Cacher le bouton générer une fois que l'identifiant est généré
  };

  return (
    <div className="container">
      <h1>Vérifier un client</h1>
      {proof ? (
        <Proof proof={proof} onVerifyAnother={handleVerifyAnother} />
      ) : (
        <>
          <p>Identifiant : {verifierId}</p>
          {showQR && <canvas id="qrcode"></canvas>}
          {!showQR && showGenerateButton && (
            <button onClick={handleGenerateVerifier}>Générer un identifiant</button>
          )}
          {!showQR && !showGenerateButton && (
            <button onClick={handleShowQR}>Afficher le QR Code</button>
          )}
          {showQR && (
            <button onClick={handleHideQR}>Effacer le QR Code</button>
          )}
        </>
      )}
    </div>
  );
}

export default VerifierPage;
