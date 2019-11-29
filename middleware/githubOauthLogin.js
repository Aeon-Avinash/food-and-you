const qs = require("qs");

module.exports = async (req, res, next) => {
  try {
    const { socketId } = req.query;
    console.log({ socketId });
    const githubOAuthURL = `https://github.com/login/oauth/authorize?${qs.stringify(
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: "http://localhost:8000/user/oauth/githubRedirect"
      }
    )}`;
    req.session.socketId = socketId;
    res.redirect(githubOAuthURL);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};
