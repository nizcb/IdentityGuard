const mongoose = require("mongoose");
const uuid = require("uuid");

const verifierSchema = mongoose.Schema(
  {
    verifierId: {
      type: String,
      unique: true,
    },
  }
);

// Génèrer un identifiant unique
verifierSchema.pre("save", function(next) {
  this.verifierId = uuid.v4().replace(/-/g, "").substr(0, 12);
  next();
});

module.exports = mongoose.model("Verifier", verifierSchema);
