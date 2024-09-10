const express = require("express");
const jwt = require("jsonwebtoken");
const regd_users = express.Router();
let BOOKS = require("./booksdb.js");

let users = [
  {
    uname: "abood-hass",
    passw: "aboodhass123",
  },
];
const secretKey = "TUlTNU1ESUlTNEFNRFY3QTQxV0Y=";

const isValid = (username) => {
  if (username) {
    return jwt.verify(username, secretKey);
  }
  return false;
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => (user.uname == username) & (user.passw == password)
  );

  return user ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { uname, passw } = req.body.data;

  const userAuth = authenticatedUser(uname, passw);

  if (userAuth) {
    const token = jwt.sign({ uname: uname }, secretKey, {
      expiresIn: "1h",
    });
    return res.json({ message: "Valid login", token: token });
  }

  return res.status(404).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { rate, comment } = req.body.data;
  const uname = jwt.decode(req.get("token", { complete: true })).uname;
  const isbn = req.params["isbn"];

  const review = { comment, rate };

  const book = Object.entries(BOOKS).find((book) => book[1].isbn == isbn);

  const bookID = Number.parseInt(book["0"]);
  const bookData = book["1"];
  const bookReviews = bookData.reviews;

  BOOKS = {
    ...BOOKS,
    [bookID]: { ...bookData, reviews: { ...bookReviews, [uname]: review } },
  };

  return res.status(300).json({
    message: "Yet to be implemented",
    data: { BOOKS },
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const uname = jwt.decode(req.get("token", { complete: true })).uname;
  const isbn = req.params["isbn"];

  const book = Object.entries(BOOKS).find((book) => book[1].isbn == isbn);

  const bookID = Number.parseInt(book["0"]);
  const bookData = book["1"];
  const bookReviews = bookData.reviews;

  console.log(bookReviews)

  delete bookReviews[uname];

  BOOKS = {
    ...BOOKS,
    [bookID]: { ...bookData, reviews: bookReviews },
  };

  return res.status(300).json({
    message: "Yet to be implemented",
    data: { BOOKS },
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
