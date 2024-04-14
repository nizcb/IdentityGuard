module.exports = function toLowerCase(req, res, next) {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase();
  }
  next();
};
