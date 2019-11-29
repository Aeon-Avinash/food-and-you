const mongoose = require("mongoose");

const DB_NAME = "food&U_Setup_1";
const DB_CONNECTION_URL = `mongodb+srv://${process.env.ATLAS_MONGODB_USERNAME}:${process.env.ATLAS_MONGODB_PASSWORD}@cluster0-qr0sv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

module.exports = dbConnectCB => {
  return mongoose.connect(DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
};
