const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("connect-flash");
require("dotenv").config({ path: "./.env", override: true });
const app = express();

const conn = require("./db/conn");

const Tought = require("./models/Tought");
const User = require("./models/User");
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

const ToughtsController = require("./controllers/ToughtsController");
const AuthController = require("./controllers/AuthController");
console.log("Conectando com:", {
  dbUser: process.env.DB_USER,
  dbDialect: process.env.DB_DIALECT,
  dbName: process.env.DB_NAME,
  dbPass: process.env.DB_PASS,
  dbHost: process.env.DB_HOST,
});

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "session",
    secret: "meu segredo",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

app.use(flash());

app.use(express.static("public"));

app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughtsController.showToughts);

conn
  // .sync({ force: true }) // Use { force: true } to drop tables and recreate them
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
