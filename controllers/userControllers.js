const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../models/user");
const { google } = require("googleapis");
const getToken = require("../utils/tokenGenerators");

const {
  checkUserConfigFile,
  checkUserCalendarEvents,
  getUserConfigFile,
  getUserCalendarEvents,
  updateUserConfigFile
} = require("../utils/utils_googleOauth/googleServices_utils");

const {
  updateObjProp,
  updateObjAddToArr,
  updateArrInObjAddOrReplaceByAccessor
} = require("../utils/updateObjHelpers");

// ? Google OAuth Login Redirect

exports.OauthGoogleRedirect = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const { token, user, gDrive, gCalendar } = req;
    console.log({ token });

    let gDrive_access, gCalendar_access;

    if (gDrive && gCalendar) {
      gDrive_access = await checkUserConfigFile({ gDrive, user, token });
      gCalendar_access = await checkUserCalendarEvents({
        gCalendar,
        user,
        token
      });
    }

    user.tokens = token;

    await user.save();

    console.log({ sessionSocketId: req.session.socketId });
    io.in(req.session.socketId).emit("google", {
      token: token,
      serviceType: "GOOGLE",
      authType: "google",
      email: user.email,
      gDrive_access,
      gCalendar_access
    });

    res.status(200).json({
      message: "Successful Google Oauth Authentication",
      token: token,
      serviceType: "GOOGLE",
      email: user.email,
      gDrive_access,
      gCalendar_access
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

// ? Github OAuth Login Redirect

exports.OauthGithubRedirect = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const { accessToken } = req;
    console.log({ accessToken });
    const clientResponse = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });
    const { email, name, login } = clientResponse.data;

    console.log({ email, name, login });
    let user = await User.findOne().or([
      { email },
      { username: name || login }
    ]);
    if (!user) {
      user = new User({ authType: "GITHUB", email, username: name });
      await user.save();
    }
    // const token = await user.generateJWToken();
    const token = await getToken.generateJWToken(user);

    console.log({ sessionSocketId: req.session.socketId });
    io.in(req.session.socketId).emit("github", {
      token: token,
      serviceType: "JWT",
      authType: "github"
    });

    res.status(200).json({
      message: "Successful Oauth Authentication",
      token: token,
      serviceType: "JWT",
      authType: "github"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.userSignup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) {
      const error = new Error("Email or Password is not valid!");
      error.statusCode = 422;
      throw error;
    }
    let user = await User.findOne({ email });
    if (user) {
      const error = new Error("User already exists!");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({
      authType: "EMAIL",
      email,
      username,
      password: hashedPassword
    });
    await user.save();
    // const token = await user.generateJWToken();
    const token = await getToken.generateJWToken(user);

    res.status(201).json({
      message: "Successful User Signup",
      token: token, //? returning token only the specific client login instance
      serviceType: "JWT"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne().and([{ email }, { authType: "EMAIL" }]);
    if (!user) {
      const error = new Error("Email or password do not match!");
      error.statusCode = 422;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Email or password do not match!");
      error.statusCode = 422;
      throw error;
    }
    // const token = await user.generateJWToken();
    const token = await getToken.generateJWToken(user);

    res.status(200).json({
      message: "Successful User Login",
      token: token, //? returning token only the specific client login instance
      serviceType: "JWT"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.generateAccessToken = async (req, res, next) => {
  try {
    const { refreshToken, userId, email } = req.body;
    let user, accessToken, accessTokenExpiry, token, tokenObj;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      user = await User.findOne({ _id: decoded.userId });
    }
    if (!user) {
      const error = new Error("Invalid request!");
      error.statusCode = 404;
      throw error;
    }

    // console.log(user.tokens);

    const activeToken = user.tokens.find(
      token => token.refreshToken === refreshToken
    );

    if (activeToken) {
      console.log("valid refresh token of user");
      if (new Date(moment(activeToken.refreshTokenExpiry)) < new Date()) {
        user.tokens = user.tokens.filter(
          token => token.refreshToken !== refreshToken
        );
        await user.save();
        const error = new Error("Session expired. Please login again!");
        error.statusCode = 404;
        throw error;
      }

      // accessToken = await user.generateNewAccessToken();
      token = await getToken.generateNewAccessToken(user, refreshToken);
    } else {
      const error = new Error("Invalid request!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Successful refresh token and Logged in",
      token: token, //? returning updated token only the specific client login instance
      serviceType: "JWT"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const { user, serviceType, gCalendar, gDrive } = req;
    let userCalendarEvents, userConfigFile;
    if (serviceType === "GOOGLE" && gCalendar && gDrive) {
      userConfigFile = await getUserConfigFile(
        {
          gDrive,
          user,
          token: user.tokens
        },
        next
      );
      userCalendarEvents = await getUserCalendarEvents(
        {
          gCalendar,
          user,
          token: user.tokens
        },
        next
      );
    }

    res.status(200).json({
      message: "User Profile",
      user: user,
      userCalendarEvents,
      userConfigFile
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  //? edit preferences or change password/username
  try {
    let { user, serviceType, gCalendar, gDrive } = req;
    const { updateCategory, value, updateKeyPath } = req.body;

    //* add validation for user preferences form data
    //* if the provided diet preference is a valid option from the select list (client-server)
    //* If no validation errors, then update the user

    // console.log({ updateCategory, value, updateKeyPath });

    if (
      updateCategory === "email" ||
      updateCategory === "username" ||
      updateCategory === "lastUsedDefaultTracker"
    )
      user[updateCategory] = value;
    if (
      updateCategory === "trackers" ||
      updateCategory === "nutrition" ||
      updateCategory === "recipes"
    )
      user[updateCategory] = updateObjAddToArr(
        user[updateCategory],
        value,
        ...updateKeyPath
      );
    //* for recent list additions, check if the list length > 100,
    //* to pop and push (as mongoose reverses arr order) or else simply push

    if (updateCategory === "settings")
      user[updateCategory][updateKeyPath] = value;

    await user.save();

    // console.log(user);

    let userConfigFile;
    //* update gDrive config file only for settings update
    if (
      updateCategory === "settings" &&
      serviceType === "GOOGLE" &&
      gCalendar &&
      gDrive
    ) {
      userConfigFile = await updateUserConfigFile({ gDrive, user });
    }

    res.status(200).json({
      message: "User Profile Updated",
      user: req.user,
      userConfigFile
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    //? send password reset email to the provided address alogn with the passwordResetToken
    let user = await User.findOne().and([{ email }, { authType: "EMAIL" }]);
    if (!user) {
      const error = new Error("Email or password do not match!");
      error.statusCode = 422;
      throw error;
    }
    user.passwordResetTokenValidity = moment(new Date())
      .add(60, "minutes")
      .toDate();
    // const passwordResetToken = await user.generateJWToken();
    const token = await getToken.generateJWToken(user);

    await user.save();
    console.log(user);

    res.status(200).json({
      message: "Password reset email successfully sent to the provided address",
      email,
      passwordResetToken: user.token
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.passwordResetConfirm = async (req, res, next) => {
  try {
    const { password, passwordResetToken } = req.body;
    //? add validation for email and check expiry of password-reset-token
    const decoded = jwt.verify(passwordResetToken, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      const error = new Error(
        "Password-reset-token do not match or might have expired! Please try again"
      );
      error.statusCode = 422;
      throw error;
    }
    const tokenValid = moment(user.passwordResetTokenValidity).isSameOrAfter(
      new Date()
    );
    if (!tokenValid) {
      const error = new Error(
        "Password-reset-token do not match or might have expired! Please try again"
      );
      error.statusCode = 422;
      throw error;
    }
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    // const token = await user.generateJWToken();
    const token = await getToken.generateJWToken(user);

    res.status(200).json({
      message: "Successful Password Reset",
      token: token,
      serviceType: "JWT"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.userLogout = async (req, res, next) => {
  try {
    // const { _id } = req.user;
    console.log("logout for requestToken:", req.activeToken.refreshToken);

    req.user.tokens = req.user.tokens.filter(
      token => token.refreshToken !== req.activeToken.refreshToken
    );
    await req.user.save();

    res.status(200).json({
      message: " User Logged out succesfully"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.userLogoutFromAll = async (req, res, next) => {
  try {
    // const { _id } = req.user;
    console.log("logout from all devices");

    req.user.tokens = [];
    await req.user.save();

    res.status(200).json({
      message: " User Logged out succesfully from all devices"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const { _id } = req.user;
};
