const { google } = require("googleapis");
let googleOAuthClient;

module.exports = (() => {
  if (!googleOAuthClient) {
    googleOAuthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `http://localhost:8000/user/oauth/googleRedirect`
    );
    google.options({ auth: googleOAuthClient });
  }

  return googleOAuthClient;
})();
