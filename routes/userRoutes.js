const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const jwtAuth = require("../middleware/jwtAuth");
const githubOauthLogin = require("../middleware/githubOauthLogin");
const githubAccessToken = require("../middleware/githubAccessToken");
const googleOauthLogin = require("../middleware/googleOauthLogin");
const googleAccessToken = require("../middleware/googleAccessToken");

//? request for github oauth login from client
router.get("/oauth/githubLogin", githubOauthLogin); // (for postman)
// router.get("/oauth/githubLogin", userController.githubOauthLogin); // (for react client)
//? request from client for access-token
router.get(
  "/oauth/githubRedirect",
  githubAccessToken,
  userController.OauthGithubRedirect
);
//? direct request with acces-token from postman
router.post(
  "/oauth/githubRedirect",
  githubAccessToken,
  userController.OauthGithubRedirect
);

//? request for google oauth login from client
router.get("/oauth/googleLogin", googleOauthLogin);
//? request from client for access-token
router.get(
  "/oauth/googleRedirect",
  googleAccessToken,
  userController.OauthGoogleRedirect
);
//? direct request with acces-token from postman
router.post(
  "/oauth/googleRedirect",
  googleAccessToken,
  userController.OauthGoogleRedirect
);

router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.post("/token", userController.generateAccessToken);
router.post("/logout", jwtAuth, userController.userLogout);
router.get("/getProfile", jwtAuth, userController.getProfile);
router.patch("/updateProfile", jwtAuth, userController.updateProfile);
router.delete("/deleteAccount", jwtAuth, userController.deleteAccount);

router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/passwordResetConfirm", userController.passwordResetConfirm);

module.exports = router;
