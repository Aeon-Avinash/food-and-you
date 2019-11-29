const axios = require("axios");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const googleOAuthClient = require("../utils/utils_googleOauth/googleOAuthClient");

module.exports = async (req, res, next) => {
  try {
    if (!req.header || !req.header("Authorization")) {
      const error = new Error("Not Authenticated!");
      error.statusCode = 401;
      throw error;
    }
    const authToken = req.get("Authorization").replace("Bearer ", "");
    let decoded, user, drive, calendar;
    if (!req.header("serviceType") || req.header("serviceType") === "JWT") {
      try {
        console.log(authToken);
        decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log({ decoded });
      } catch (err) {
        if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
          const error = new Error(err);
          error.statusCode = 401;
          throw error;
        }
        const error = new Error(err);
        error.statusCode = 401;
        throw error;
      }

      user = await User.findOne({ _id: decoded.userId });
    } else if (req.header("serviceType") === "GOOGLE") {
      const clientResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: `application/json`
          }
        }
      );
      const { name, email } = clientResponse.data;
      user = await User.findOne().or([{ email }, { username: name }]);

      if (user) {
        //? Setting tokens for the google auth session
        const tokens = user.tokens;
        googleOAuthClient.setCredentials(tokens);
        req.session["tokens"] = tokens;
        calendar = google.calendar({ version: "v3", googleOAuthClient });
        drive = google.drive({ version: "v3", googleOAuthClient });
      }
    }

    if (!user.tokens) {
      const error = new Error("Could not authenticate! Please login again.");
      error.statusCode = 401;
      throw error;
    }
    req.user = user;
    if (req.header("serviceType") && req.header("serviceType") === "GOOGLE") {
      req.serviceType = "GOOGLE";
      req.gCalendar = calendar;
      req.gDrive = drive;
    } else {
      req.serviceType = "JWT";
    }
    //! req.serviceType: GOOGLE/JWT users with or without full google service integration
    next();
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 401;
    next(err);
  }
};
