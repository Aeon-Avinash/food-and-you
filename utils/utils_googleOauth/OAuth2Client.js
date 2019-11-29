const { OAuth2Client } = require("google-auth-library");

// const keys = require("./food-and-you-app-ce35890b4b5c.json");
const keys = require("./Food And You - App -8bfff71ef3dd.json");

let oAuth2Client;
module.exports = () => {
  oAuth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  return oAuth2Client;
};
