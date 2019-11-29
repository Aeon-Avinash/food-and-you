const fs = require("fs");
const path = require("path");
const stream = require("stream");
const { google } = require("googleapis");
const { resolve } = require("path");

exports.checkUserConfigFile = async ({ gDrive, user, token }) => {
  try {
    const gDriveAppFiles = await gDrive.files.list({
      spaces: "appDataFolder",
      fields: "files(id, name)",
      pageSize: 100
    });
    console.log("gDriveAppFiles", gDriveAppFiles.data);
    if (gDriveAppFiles.data.files.length === 0) {
      const user_data = {
        userId: user._id,
        email: user.email,
        token: token,
        authMode: "GOOGLE",
        gDrive_access: true,
        preferences: user.settings
      };

      const configFileName = `${user.email}_food_and_you_app_config.json`;
      const configFilePath = path.join(
        "appFiles",
        "userConfig",
        configFileName
      );
      const writeStream = fs.createWriteStream(configFilePath);
      writeStream.write(JSON.stringify(user_data));

      const fileMetaData = {
        name: configFileName,
        parents: ["appDataFolder"]
      };
      const media = {
        mimeType: "application/json",
        body: fs.createReadStream(configFilePath)
      };
      gDrive.files.create(
        {
          resource: fileMetaData,
          media: media,
          fields: "id"
        },
        (err, file) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File id:", file.originalName);
          }
        }
      );
      // console.log("configFileWritten", fileWrite);
    } else {
      console.log("gDriveAppFiles-length", gDriveAppFiles.data.files.length);
    }
    return true;
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.checkUserCalendarEvents = async ({ gCalendar, user, token }) => {
  try {
    const filterBy = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
      // q: "meal"
    };
    const gCalendarEvents = await gCalendar.events.list(filterBy);
    console.log("gCalendarEvents ", gCalendarEvents.data);
    return true;
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.getUserConfigFile = async ({ gDrive, user }) => {
  try {
    const gDriveAppFiles = await gDrive.files.list({
      spaces: "appDataFolder",
      fields: "files(id, name)",
      pageSize: 100
    });

    const configFileId = gDriveAppFiles.data.files[0].id;
    const configFileName = gDriveAppFiles.data.files[0].name;
    const configFilePath = path.join("appFiles", "userConfig", configFileName);
    const userConfigFile = fs.createWriteStream(configFilePath);
    // console.log({ gDrive });
    gDrive.files
      .get(
        {
          fileId: configFileId,
          alt: "media"
        },
        { responseType: "stream" }
      )
      .then(res => {
        // console.log(res.data);
        return res.data
          .on("end", () => {
            console.log("User config file downloaded");
          })
          .on("error", err => {
            console.log("Error downloading config file", err);
          })
          .pipe(userConfigFile);
      })
      .catch(err => {
        console.log("config file error", err);
        throw err;
      });

    return userConfigFile;
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.getUserCalendarEvents = async ({ gCalendar, user }) => {
  try {
    const filterBy = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
      // q: "meal"
    };
    const gCalendarEvents = await gCalendar.events.list(filterBy);
    console.log("gCalendarEvents ", gCalendarEvents.data);
    return gCalendarEvents.data;
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.updateUserConfigFile = async ({ gDrive, user }) => {
  try {
    const gDriveAppFiles = await gDrive.files.list({
      spaces: "appDataFolder",
      fields: "files(id, name)",
      pageSize: 100
    });

    const configFileId = gDriveAppFiles.data.files[0].id;
    const configFileName = gDriveAppFiles.data.files[0].name;
    const configFilePath = path.join("appFiles", "userConfig", configFileName);
    const userConfigFile = fs.createWriteStream(configFilePath);
    gDrive.files
      .get(
        {
          fileId: configFileId,
          alt: "media"
        },
        { responseType: "stream" }
      )
      .then(res => {
        // console.log(res.data);
        return res.data
          .on("end", () => {
            console.log("User config file downloaded");
            readUserConfig();
          })
          .on("error", err => {
            console.log("Error downloading config file", err);
          })
          .pipe(userConfigFile);
      })
      .catch(err => {
        console.log("config file error", err);
        throw err;
      });

    const readUserConfig = () => {
      let updatedUserConfig;

      fs.readFile(configFilePath, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          throw err;
        }

        console.log("read json file: ", data);

        updatedUserConfig = JSON.parse(data);

        updatedUserConfig
          ? (updatedUserConfig.preferences = user.settings)
          : null;

        console.log(updatedUserConfig);

        const stringifiedUserConfig = JSON.stringify(updatedUserConfig);
        fs.writeFileSync(configFilePath, stringifiedUserConfig);

        const fileMetaData = {
          name: configFileName,
          parents: ["appDataFolder"]
        };
        const media = {
          mimeType: "application/json",
          body: fs.createReadStream(configFilePath)
        };

        gDrive.files.create(
          {
            resource: fileMetaData,
            media: media,
            fields: "id"
          },
          (err, file) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated File id:", file.id);
            }
          }
        );
      });
    };

    return userConfigFile;
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.addCalendarEvents = async ({ gCalendar, user, token, event }) => {
  try {
    console.log(event.id);
    const newEvent = await gCalendar.events.insert({
      calendarId: "primary",
      auth: token,
      resource: event
    });
    console.log("Event created: %s", newEvent.htmlLink);
    return newEvent;
  } catch (err) {
    console.log("There was an error contacting the Calendar service: " + err);
    const error = new Error(
      "There was an error contacting the Calendar service: " + err
    );
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.editCalendarEvents = async ({
  gCalendar,
  user,
  token,
  eventId,
  event
}) => {
  try {
    const newEvent = await gCalendar.events.update({
      calendarId: "primary",
      eventId,
      auth: token,
      resource: event
    });
    console.log("Event created: %s", newEvent.htmlLink);
    return newEvent;
  } catch (err) {
    console.log("There was an error contacting the Calendar service: " + err);
    const error = new Error(
      "There was an error contacting the Calendar service: " + err
    );
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};

exports.deleteCalendarEvents = async ({ gCalendar, user, token, eventId }) => {
  try {
    await gCalendar.events.delete({
      calendarId: "primary",
      eventId,
      auth: token
    });
    console.log("Event deleted: %s", eventId);
    return;
  } catch (err) {
    console.log("There was an error contacting the Calendar service: " + err);
    const error = new Error(
      "There was an error contacting the Calendar service: " + err
    );
    error.statusCode = err.statusCode || 500;
    // next(error);
  }
};
