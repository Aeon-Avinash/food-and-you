const { google } = require("googleapis");
let googleOAuthClient;

module.exports = (() => {
  if (!googleOAuthClient) {
    googleOAuthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.REACT_APP_SPOONACULAR_API_KEY}/user/oauth/googleRedirect`
    );
    google.options({ auth: googleOAuthClient });
  }

  return googleOAuthClient;
})();
