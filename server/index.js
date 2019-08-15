require("dotenv").config();

const express = require("express");
const session = require("express-session");
const massive = require("massive");
//const bcrypt = require("bcryptjs");

const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());

massive(process.env.CONNECTION_STRING)
  .then(dbinstance => {
    app.set("db", dbinstance);
    console.log("database connected :)");
  })
  .catch(e => console.log(e));

app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2
    }
  })
);

//app.post("/api/register", authCtrl.register);
app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);

app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  treasureCtrl.getAllTreasure
);

app.listen(process.env.SERVER_PORT, () =>
  console.log("Listening on Port " + process.env.SERVER_PORT)
); //runs the server on the given port
