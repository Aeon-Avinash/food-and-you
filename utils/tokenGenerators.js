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

    user.tokens = tokenObj;
    await user.save();

    return user.tokens;
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

    user.tokens = {
      ...user.tokens,
      accessToken,
      accessTokenExpiry: moment(new Date())
        .add(1, "hour")
        .toDate()
    };

    await user.save();

    return user.tokens;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
