const axios = require("axios");

module.exports = async (req, res, next) => {
  try {
    let accessToken;
    if (req.header("Authorization")) {
      accessToken = req.header("Authorization").replace("Bearer ", "");
    } else {
      const requestToken = req.query.code;

      if (!requestToken && !accessToken) {
        const error = new Error("No accessToken or requestToken found!");
        error.statusCode = 401;
        throw error;
      }

      const serverResponse = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token`,
        // url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${requestToken}`,

        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: requestToken
        },
        headers: {
          accept: "application/json"
        }
      });
      console.log(serverResponse.data);
      accessToken = serverResponse.data.access_token;
    }
    req.accessToken = accessToken;
    next();
  } catch (err) {
    console.log(Object.keys(err));
    console.log(err.response);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};
