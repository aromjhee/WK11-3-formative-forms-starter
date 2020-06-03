const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;
const csrfProtection = csrf({ cookie: true });

app.set("view engine", "pug");
app.use(cookieParser());

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render("index", { title: "Formative Forms", users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render("create", { 
    title: "Create a user", csrfToken: req.csrfToken()
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
