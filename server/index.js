const https = require("https");
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketManager = require("./sockets/socketManager");
const { verifyRefusedSession } = require("./controllers/refusedController");

const { verifyAdminSession } = require("./controllers/adminController");
const { verifyAcceptedSession } = require("./controllers/verifier.controller");

const app = express(); // Utilisation de la fonction express pour créer l'application

// Middleware pour logger les requêtes reçues
app.use((req, res, next) => {
  console.log(
    `A ${req.method} request received at ${new Date().toISOString()}`
  );
  next();
});

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database not connected ", error));

// middleware
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse email and name to lowercase
app.use(require("./middlewares/toLowerCase"));

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/verifiers", require("./routes/verifier.routes"));
app.use("/admin", verifyAdminSession, require("./routes/adminRoutes"));
app.use("/refused", verifyRefusedSession, require("./routes/refusedRoutes"));

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

const PORT = 443;

// Configuration pour le serveur HTTPS
const httpsOptions = {
  key: fs.readFileSync("server.key"), // Chemin vers la clé privée
  cert: fs.readFileSync("server.cert"), // Chemin vers le certificat
};

// Création du serveur HTTPS
const server = https.createServer(httpsOptions, app);

// Lancement du serveur sur le port spécifié
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: true, // Autoriser les requêtes depuis ce domaine
    methods: ["GET", "POST"], // Méthodes HTTP autorisées
  },
});

// Utiliser le gestionnaire de sockets
socketManager(io);

// Cleanup
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function cleanup() {
  console.log("Cleaning up resources...");

  // Close server
  server.close();

  // Disconnect from database
  mongoose.connection.close();
}
