import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../context/userContext";
import jsQR from "jsqr";
import axios from "axios";
import io from "socket.io-client";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, loading } = useContext(UserContext);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const [scannedQrCode, setScannedQrCode] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showAgeProofOptions, setShowAgeProofOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const videoRef = useRef(null);

  if (loading) return <h1>Loading...</h1>;
  if (!user) return <div>Please log in.</div>;

  const handleProofOfAge = () => {
    setShowAgeProofOptions(true);
  };

  const handleSaveIdentifier = async () => {
    if (socket && identifier) {
      try {
        const response = await axios.get(`/verifiers/${identifier}`);
        const exists = response.data.exists;
        if (exists) {
          const data = {
            identifier: identifier,
            email: user.email,
          };
          socket.emit("message", data);
          console.log("envoyé");
          setErrorMessage("Données envoyées");
          setScannedQrCode("");
        } else {
          setErrorMessage("Identifiant incorrect, veuillez recommencer");
        }
      } catch (error) {
        console.error("Erreur lors de la requête Axios :", error);
      }
    } else if (!identifier) {
      console.log("pas d'identifiant");
    }
  };

  useEffect(() => {
    if (scannedQrCode && method === "camera") {
      setIdentifier(scannedQrCode);
    }
  }, [scannedQrCode, method]);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_API_URL + import.meta.env.VITE_SOCKET_PORT
    );
    setSocket(newSocket);

    newSocket.on("error_message", (message) => {
      setErrorMessage(message);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isCameraAvailable && method === "camera" && !isCameraBlocked) {
      const videoElement = videoRef.current;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      videoElement.addEventListener("play", () => {
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.setAttribute("willReadFrequently", "false");
        const scanFrame = () => {
          context.drawImage(videoElement, 0, 0, width, height);
          const imageData = context.getImageData(0, 0, width, height);
          decodeQRCode(imageData, width, height);
          requestAnimationFrame(scanFrame);
        };
        scanFrame();
      });

      function decodeQRCode(imageData, width, height) {
        const code = jsQR(imageData.data, width, height);
        if (code) {
          console.log("QR Code détecté :", code.data);
          setScannedQrCode(code.data);
        }
      }

      // Contraintes pour accéder à la caméra arrière
      const constraints = {
        video: {
          facingMode: "environment" // Utilise la caméra arrière
        }
      };

      navigator.mediaDevices
        .getUserMedia(constraints) // Utilise les contraintes
        .then(function (stream) {
          videoElement.srcObject = stream;
        })
        .catch(function (error) {
          console.error("Erreur lors de l'accès à la caméra :", error);
          setIsCameraAvailable(false);
          setIsCameraBlocked(true);
        });
    }
  }, [isCameraAvailable, method, isCameraBlocked]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Message facultatif, certains navigateurs le montrent
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopVideoCapture();
    };
  }, []);

  function stopVideoCapture() {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      videoElement.srcObject = null;
    }
  }

  if (!user) {
    return (
      <div className="alert alert-danger justify-content-center" role="alert">
        You must be logged in to view this page.
      </div>
    );
  }

  return (

    <div className="container">
      <h1>Welcome to your dashboard, {user && user.name}</h1>
      {!showAgeProofOptions && (
        <button onClick={handleProofOfAge}>Prouver mon âge</button>
      )}
      {showAgeProofOptions && (
        <>
          <div className="button-group">
            <button
              onClick={() => {
                setMethod("camera");
                setIsCameraAvailable(true);
                setScannedQrCode("");
              }}
            >
              Scanner le QR code
            </button>
            <button
              onClick={() => {
                setMethod("input");
              }}
            >
              Entrer le QR code
            </button>
          </div>
          <div id="message" className="error-message">
            <p>{errorMessage}</p>
          </div>
        </>
      )}
      {method === "input" && (
        <div className="input-container">
          <div className="input-group">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Entrer l'identifiant"
              className="identifier-input"
            />
            {identifier && method === "input" && (
              <button onClick={handleSaveIdentifier} className="send-button">
                Envoyer
              </button>
            )}
          </div>
        </div>
      )}
      {method === "camera" && scannedQrCode && (
        <button onClick={handleSaveIdentifier} className="send-button">
          Envoyer
        </button>
      )}
      {!isCameraAvailable && method === "camera" && (
        <p className="error-message">
          Veuillez autoriser l'accès à la caméra ou choisir une autre méthode.
        </p>
      )}
      {isCameraAvailable && method === "camera" && (
        <div className="camera-container">
          <video ref={videoRef} autoPlay></video>
        </div>
      )}
      {method === "camera" && scannedQrCode && (
        <p> QR Code scanné : {scannedQrCode}</p>
      )}
    </div>
  );
}
