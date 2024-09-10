const express = require("express");
let BOOKS = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

let booksAry = Object.values(BOOKS) || [];

public_users.post("/register", (req, res) => {
  const { data } = req.body;

  const { uname, passw } = data;

  const user = users.find((u) => u.uname == uname && u.passw == passw);

  if (!user) {
    users.push({ uname, passw });
    return res.status(200).json({ message: "Welcome abord" });
  }

  return res.status(204).json({ message: "Already exsist" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (booksAry.length == 0)
    return res.status(404).json({ message: "No Books are Stored" });

  return res
    .status(300)
    .json({ message: "All the stored Books", data: { books: BOOKS } });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  const book = booksAry.find((book) => book.isbn == isbn);

  if (book)
    return res
      .status(300)
      .json({ message: `Book with isbn (${isbn}) found`, data: book });

  return res.status(404).json({ message: `No book with isbn (${isbn}) found` });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const books = booksAry.filter((book) => book.author == author);

  if (books)
    return res
      .status(300)
      .json({ message: `Book with author (${author}) found`, data: books });

  return res
    .status(404)
    .json({ message: `No book with author (${author}) found` });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  const book = booksAry.find((book) => book.title == title);

  if (book)
    return res
      .status(300)
      .json({ message: `Book with title (${title}) found`, data: book });

  return res
    .status(404)
    .json({ message: `No book with title (${title}) found` });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  const book = booksAry.find((book) => book.isbn == isbn);

  if (book) {
    if (Object.keys(book.reviews).length > 0) {
      return res.status(300).json({
        message: `Book with isbn (${isbn}) found`,
        data: { bookReviews: book.reviews },
      });
    } else {
      return res.status(300).json({
        message: `No review for this book with isbn (${isbn}) found`,
      });
    }
  }

  return res.status(404).json({ message: `No book with isbn (${isbn}) found` });
});

module.exports.general = public_users;
