const dbapi = require("../../../db/api");

module.exports = function (socket, next) {
  const req = socket.request;

  // 1. Try session-based JWT first (for browser UI users)
  const jwt = req.session?.jwt;

  if (jwt && jwt.email) {
    return dbapi
      .loadUser(jwt.email)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          next(new Error("Invalid user"));
        }
      })
      .catch(next);
  }

  // 2. Fallback to access token in socket query
  const token = socket.handshake.query?.token;

  if (token) {
    return dbapi
      .loadAccessToken(token)
      .then((accessToken) => {
        console.log("✅ Token found:", accessToken);

        const email =
          accessToken?.user?.email || // standard format
          accessToken?.email; // fallback for your token

        if (!email) {
          throw new Error("Invalid token structure or missing user");
        }

        return dbapi.loadUser(email);
      })
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          next(new Error("User not found for valid token"));
        }
      })
      .catch(next);
  }
  console.log(`debug : ${socket.handshake}`);
  // 3. If no session or token, reject connection
  return next(new Error(`Missing authorization token`));
};
