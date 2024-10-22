const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authController = require("./controllers/auth.js");
const session = require('express-session');

require('dotenv').config();
dotenv.config();
require("./config/database");

const app = express();

// MIDDLEWARE///////////

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "4000";

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use("/auth", authController);

// ROUTES //////////////

// GET /
app.get("/", (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
  });

/// GET /vip-lounge ///////////////////////////////

app.get("/vip-lounge", async(req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the Jungle ${req.session.user.username}.`);
    } else {
      res.send("Sorry, you are not allowed.");
    }
  });

////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});