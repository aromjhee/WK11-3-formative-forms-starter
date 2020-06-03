const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;
const csrfProtection = csrf({ cookie: true });

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

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

const validateFields = (req, res, next) => {
  const errors = [];
  const { firstName, lastName, email, password, confirmedPassword } = req.body;

  if (!firstName) errors.push("Please provide a first name.")
  if (!lastName) errors.push("Please provide a last name.")
  if (!email) errors.push("Please provide an email.")
  if (!password) errors.push("Please provide a password.")
  if (password !== confirmedPassword) errors.push("The provided values for the password and password confirmation fields did not match.")

  req.errors = errors;
  next();
}

app.post("/create", csrfProtection, validateFields, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = req.errors;
  
  if (errors.length > 0) {
    res.render("create", {
      title: "Create a user",
      errors,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword
    });
    return;
  }

  res.redirect("/");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
