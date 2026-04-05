const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// REGISTER
public_users.post("/register", (req,res) => {
  const {username , password} = req.body;

  if(!username || !password ){
    return res.status(400).json({message: "username and password required"});
  }

  if(!isValid(username)){
    return res.status(400).json({message : "username already exists"});
  }

  users.push({username, password});

  return res.json({message : "registered successfully"});
});

// Task 10 — Get all books (Promise)
public_users.get('/', (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then(data => res.send(JSON.stringify(data, null, 2)))
    .catch(() => res.status(500).json({ message: "Error" }));
});

// Task 11 — Get by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    resolve(books[isbn]);
  })
    .then(data => res.json(data))
    .catch(() => res.status(500).json({ message: "Error" }));
});

// Task 12 — Get by Author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      book => book.author === author
    );
    resolve(result);
  })
    .then(data => res.json(data))
    .catch(() => res.status(500).json({ message: "Error" }));
});

// Task 13 — Get by Title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      book => book.title === title
    );
    resolve(result);
  })
    .then(data => res.json(data))
    .catch(() => res.status(500).json({ message: "Error" }));
});

// Task 5 — Reviews
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;

