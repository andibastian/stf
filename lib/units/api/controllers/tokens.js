const _ = require("lodash");
const dbapi = require("../../../db/api");

module.exports.getAccessTokens = function (req, res) {
  dbapi
    .loadTokenLists()
    .then((tokens) => res.json(tokens))
    .catch((err) => {
      console.error("❌ Failed to load access tokens:", err);
      res.status(500).json({ error: "Failed to load access tokens" });
    });
};
