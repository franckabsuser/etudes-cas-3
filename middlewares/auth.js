const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  try {
    // Récupération du token depuis les en-têtes
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      console.log("Aucun token fourni");
      throw "No token provided";
    }

    // Extraire le token si 'Bearer' est présent
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    // Vérification du token et extraction des données
    const decoded = jwt.verify(tokenWithoutBearer, config.secretJwtToken);

    // Stocker les informations de l'utilisateur dans req.user
    req.user = {
      id: decoded.userId,
      ...decoded
    };
        //console.log(req.user = {
     // role: user.role,
   // });

    next();
  } catch (message) {
    console.log("Erreur dans le middleware d'authentification:", message);
    next(new UnauthorizedError(message));
  }
};
