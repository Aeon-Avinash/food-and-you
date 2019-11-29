const path = require("path");
const express = require("express");
const bodyParser = require("express");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const socketio = require("socket.io");

const mongooseConnect = require("./db/mongoose");
const edamamRoutes = require("./routes/edamamNutrition");
const spoonRoutes = require("./routes/spoonNutrition");
const userRoutes = require("./routes/userRoutes");
const trackerRoutes = require("./routes/trackerRoutes");

const app = express();
const PORT = 8000 || process.env.PORT;

const server = http.createServer(app);
const io = socketio(server);
io.on("connection", socket => {
  socket.emit("connected with server socket!");
});
app.set("io", io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use("/appFiles", express.static(path.join(__dirname, "appFiles")));

app.use((req, res, next) => {
  const { url, method } = req;
  console.log(`method: ${method}, url: ${url}`);
  if (req.body) {
    console.log(`body: ${Object.keys(req.body)}`);
  }
  if (req.query) {
    console.log(`query: ${Object.keys(req.query)}`);
  }
  if (req.params) {
    console.log(`params: ${Object.keys(req.params)}`);
  }
  if (req.file) {
    console.log(`file: ${Object.keys(req.file.originalName)}`);
  }
  next();
});

app.use("/edamam", edamamRoutes);
app.use("/spoon", spoonRoutes);
app.use("/user", userRoutes);
app.use("/user/tracker", trackerRoutes);

app.use((error, req, res, next) => {
  // console.log({ error });
  const status = error.statusCode || 500;
  const { message } = error;
  console.log({ message });
  return res.status(status).json({ message });
});

mongooseConnect()
  .then(result => {
    server.listen(PORT, () => {
      console.log(`FoodAndYou Server is listening on Port ${PORT}...`);
    });
  })
  .catch(err => console.log(err));
