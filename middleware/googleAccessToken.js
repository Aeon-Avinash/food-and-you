const axios = require("axios");
const { google } = require("googleapis");
const googleOAuthClient = require("../utils/utils_googleOauth/googleOAuthClient");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    let tokens, accessToken;
    // console.log("req.query", req.query);
    if (req.header("Authorization")) {
      accessToken = req.header("Authorization").replace("Bearer ", "");
    } else if (req.params && req.params.access_token) {
      accessToken = req.params.access_token;
      tokens = req.params;
      googleOAuthClient.setCredentials(tokens);
    } else if (req.query && req.query.code) {
      const authorizationCode = req.query.code;
      ({ tokens } = await googleOAuthClient.getToken(authorizationCode));
      googleOAuthClient.setCredentials(tokens);
      req.session["tokens"] = tokens;
      accessToken = tokens.access_token;
      // console.log("tokens", tokens);
    } else {
      const error = new Error("No accessToken or authorizationCode found!");
      error.statusCode = 401;
      throw error;
    }
    // console.log(accessToken);

    const clientResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: `application/json`
        }
      }
    );
    const { name, email } = clientResponse.data;
    console.log({ email, name });
    let user = await User.findOne().or([{ email }, { username: name }]);
    if (!user) {
      user = new User({ authType: "GOOGLE", email, username: name });
    }

    user.tokens = tokens;
    await user.save();

    const calendar = google.calendar({ version: "v3", googleOAuthClient });
    const drive = google.drive({ version: "v3", googleOAuthClient });

    req.token = tokens;
    req.user = user;
    req.gCalendar = calendar;
    req.gDrive = drive;
    next();
  } catch (err) {
    // console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};
