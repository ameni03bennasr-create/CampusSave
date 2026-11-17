const { HttpsError } = require("firebase-functions/v2/https");

// Enveloppe commune : journalise l'erreur et ne laisse sortir que des HttpsError.
function handle(nom, fn) {
  return async (request) => {
    try {
      return await fn(request);
    } catch (err) {
      console.error(`ERREUR ${nom} :`, err);
      if (err instanceof HttpsError) throw err;
      throw new HttpsError("internal", "Erreur interne du serveur.");
    }
  };
}

module.exports = { handle };
