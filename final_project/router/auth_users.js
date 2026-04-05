const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return !users.some(user => user.username === username);
};

const authenticatedUser = (username,password)=>{ 
  return users.some(user => 
    user.username === username && user.password === password
  );
};

// LOGIN
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });

  req.session.user = {
    username,
    token
  };

  return res.json({ message: "Login successful", token });
});

// ADD / UPDATE REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.json({ message: "review added!" });
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.json({ message: "Review deleted" });
  }

  return res.status(404).json({ message: "No review found for this user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;