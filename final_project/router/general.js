const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    const get_books = new Promise((resolve, reject) => {
      resolve(books);
    });
    get_books.then((boks) => {
      res.send(JSON.stringify(boks, null, 4));
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  try {
    const get_book = new Promise((resolve, reject) => {
      resolve(books[req.params.isbn]);
    });
    get_book.then((book) => {
      res.send(book);
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const result = [];
      for (let i = 0; i < keys.length; i++) {
        const book = books[keys[i]];
        if (book.author === author) {
          result.push(book);
        }
      }
      resolve(result);
    });
    getBooksByAuthor.then((result) => {
      res.send(JSON.stringify(result, null, 4));
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const result = [];
      for (let i = 0; i < keys.length; i++) {
        const book = books[keys[i]];
        if (book.title === title) {
          result.push(book);
        }
      }
      resolve(result);
    });
    getBooksByTitle.then((result) => {
      res.send(JSON.stringify(result, null, 4));
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
