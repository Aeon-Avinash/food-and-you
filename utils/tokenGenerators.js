const jwt = require("jsonwebtoken");
const moment = require("moment");

exports.generateJWToken = async function(user) {
  try {
    console.log("generating auth tokens!");
    const accessToken = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );
    const refreshToken = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d"
      }
    );

    const tokenObj = {
      accessToken,
      refreshToken,
      refreshTokenExpiry: moment(new Date())
        .add(1, "day")
        .toDate(),
      accessTokenExpiry: moment(new Date())
        .add(1, "hour")
        .toDate(),
      status: "Logged In"
    };

    if (!user.tokens) {
      user.tokens = [];
    }

    user.tokens = user.tokens.concat(tokenObj);
    await user.save();

    // console.log(user.tokens);

    return tokenObj;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.generateNewAccessToken = async function(user, refreshToken) {
  try {
    const accessToken = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    user.tokens = user.tokens.map(token =>
      token.refreshToken === refreshToken
        ? {
            refreshToken,
            refreshTokenExpiry: token.refreshTokenExpiry,
            accessToken,
            accessTokenExpiry: moment(new Date())
              .add(1, "hour")
              .toDate(),
            status: "Logged In"
          }
        : token
    );

    await user.save();

    return user.tokens.find(token => token.refreshToken === refreshToken);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
