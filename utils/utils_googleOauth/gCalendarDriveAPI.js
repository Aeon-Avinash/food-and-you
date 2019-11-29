const { google } = require("googleapis");

module.exports = async (req, res, next) => {
  try {
    if (!req.googleOAuthClient) {
      console.log("Not authorized to access Calendar or Drive API!`");
      return next();
    }
    const auth = req.googleOAuthClient;
    const calendar = google.calendar({ version: "v3", auth });

    const drive = google.drive({ version: "v3", auth });

    req.gCalendar = calendar;
    req.gDrive = drive;
    next();
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};
