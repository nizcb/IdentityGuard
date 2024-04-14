const User = require("../models/user");

module.exports = function (io) {
  // Map pour enregistrer l'association entre l'identifiant du vérificateur et l'ID de la socket
  const verifierSocketMap = {};

  io.on("connection", function (socket) {
    console.log("Client Connected");

    // Gestion de la connexion du vérificateur
    socket.on("joinVerifier", function (verifierId) {
      console.log(
        "Le vérificateur avec l'identifiant " +
          verifierId +
          " a rejoint la socket."
      );

      // Associer la socket à l'identifiant du vérificateur
      socket.join(verifierId);

      // Enregistrer l'association entre l'identifiant du vérificateur et l'ID de la socket
      verifierSocketMap[verifierId] = socket.id;
    });

    // Gestion des messages
    socket.on("message", async function (data) {
      console.log(
        "identifiant reçu : " + data.identifier + " de l'@ : " + data.email
      );

      // Vérifier si l'identifiant du vérificateur existe dans verifierSocketMap
      if (verifierSocketMap[data.identifier] && data.email) {
        const user = await User.findOne({ email: data.email });
        // La chambre existe, envoyer data.email au vérificateur
        io.to(verifierSocketMap[data.identifier]).emit("proof", user.address);
      } else {
        // La chambre n'existe pas, informer le prouveur
        console.log(
          "La socket associée à " + data.identifier + " n'existe pas."
        );
        socket.emit(
          "error_message",
          "Connection à " + data.identifier + " impossible, Veuillez réessayer."
        );
      }
    });

    // Gestion des déconnexions
    socket.on("disconnect", function () {
      // Supprimer la socket de verifierSocketMap lorsque le vérificateur se déconnecte
      const disconnectedVerifierId = Object.keys(verifierSocketMap).find(
        (key) => verifierSocketMap[key] === socket.id
      );
      if (disconnectedVerifierId) {
        console.log(
          "Le vérificateur avec l'identifiant " +
            disconnectedVerifierId +
            " s'est déconnecté."
        );
        console.log("socket " + disconnectedVerifierId);
        delete verifierSocketMap[disconnectedVerifierId];
      }

      if (io.engine.clientsCount === 0) {
        // S'il n'y a plus de clients connectés, supprimer la socket
        delete io.sockets.sockets[socket.id];
      }
    });
  });
};
