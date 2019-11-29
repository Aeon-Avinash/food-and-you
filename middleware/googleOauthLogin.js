const googleOAuthClient = require("../utils/utils_googleOauth/googleOAuthClient");

// redirect_uri=http://localhost:8000/user/oauth/googleRedirect

module.exports = async (req, res, next) => {
  try {
    const { socketId } = req.query;
    console.log({ socketId });
    const scopes = [
      `https://www.googleapis.com/auth/drive.appdata`,
      `https://www.googleapis.com/auth/drive.file`,
      `https://www.googleapis.com/auth/calendar.readonly`,
      `https://www.googleapis.com/auth/calendar.events`,
      `https://www.googleapis.com/auth/userinfo.email`,
      `https://www.googleapis.com/auth/userinfo.profile`,
      `openid`
    ];

    const googleOAuthUrl = googleOAuthClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes
      // prompt: "consent"
    });

    req.session.socketId = socketId;
    res.redirect(googleOAuthUrl);
    // res.send(googleOAuthUrl);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};
