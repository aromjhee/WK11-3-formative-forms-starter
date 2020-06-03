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

const validateFields1 = (req, res, next) => {
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

const validateFields2 = (req, res, next) => {
  const messages = [];
  const { age, favoriteBeetle } = req.body;
  const intAge = parseInt(age, 10);

  if (!age) messages.push("age is required")

  if ((typeof (intAge) !== "number") || Number.isNaN(intAge)) messages.push("age must be a valid age");

  if (intAge < 0 || intAge > 120) messages.push("age must be a valid age");

  if (!favoriteBeetle) messages.push("favoriteBeetle is required");
  console.log("favoriteBeetle:", favoriteBeetle);

  if (
    !["John", "Paul", "Ringo", "George"].includes(favoriteBeetle)
    ) messages.push("favoriteBeetle must be a real Beetle member");

  req.messages = messages;
  next();
}

app.post("/create", csrfProtection, validateFields1, (req, res) => {
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

  users.push({ id: users.length + 1, firstName, lastName, email });
  res.redirect("/");
})

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("create-interesting", {
    title: "Creating an interesting user", 
    messages: [],
    csrfToken: req.csrfToken()
  });
});

app.post("/create-interesting", csrfProtection, validateFields1, validateFields2, (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    favoriteBeetle,
    iceCream,
    age
   } = req.body;

  const errors = req.errors.concat(req.messages);

  if (errors.length > 0) {
    res.render("create-interesting", {
      title: "Create an interesting user",
      ...req.body,
      csrfToken: req.csrfToken(),
      messages: errors
    });
    return;
  }
  users.push({
    id: users.length + 1,
    firstName,
    lastName,
    email,
    favoriteBeetle,
    iceCream: iceCream === "on",
    age
  });
  res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
