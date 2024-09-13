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
    return res
      .status(200)
      .json({ message: "Customer Succesfully register, Now you can login" });
  }

  return res.status(204).json({ message: "Already exsist" });
});

// Get the book list available in the shop
public_users.get("/", async function (_, res) {
  try {
    return await res
      .status(200)
      .json({ message: "All the stored Books", books: BOOKS });
  } catch (_) {
    return await res.status(400).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  const bookPromise = Promise.resolve(() => BOOKS[isbn]);

  bookPromise
    .then((book) => {
      if (book) return res.status(200).json({ ...book });
      else return res.status(404).json({ message: "book not found" });
    })
    .catch((_) => {
      return res.status(404).json({ message: "book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const books = booksAry.filter((book) => book.author == author);

  if (books)
    return res.status(300).json({
      message: `Book with author (${author}) found`,
      "books by the aurthor": books,
    });

  return res
    .status(404)
    .json({ message: `No book with author (${author}) found` });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  const book = booksAry.find((book) => book.title == title);

  if (book)
    return res.status(300).json({
      message: `Book with title (${title}) found`,
      "books with this title": book,
    });

  return res
    .status(404)
    .json({ message: `No book with title (${title}) found` });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  const book = BOOKS[isbn];

  if (book) {
    return res.status(300).json({ ...book.reviews });
  }

  return res.status(404).json({ message: `No book with isbn (${isbn}) found` });
});

module.exports.general = public_users;
