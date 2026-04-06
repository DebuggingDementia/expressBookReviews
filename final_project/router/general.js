// Import Express to create routes
const express = require('express');

// Import Axios for making HTTP requests
const axios = require("axios"); 

// Import the books data
let books = require("./booksdb.js");

// Import validation function
let isValid = require("./auth_users.js").isValid;

// Import users array
let users = require("./auth_users.js").users;

// Create router
const public_users = express.Router();


// ROUTE: Register a new user
public_users.post("/register", (req,res) => {
  const {username , password} = req.body;

  // Validate input
  if(!username || !password ){
    return res.status(400).json({message: "username and password required"});
  }

  // Check if user exists
  if(!isValid(username)){
    return res.status(400).json({message : "username already exists"});
  }

  // Add user
  users.push({username, password});

  return res.json({message : "registered successfully"});
});


// ROUTE: Get all books
public_users.get('/', async (req, res) => {
  try {
    // Simulate async behavior
    const data = await Promise.resolve(books);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ROUTE: Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const data = await Promise.resolve(books[isbn]);

    if (!data) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


// ROUTE: Get books by author (case-insensitive + robust)
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.trim().toLowerCase();

  try {
    const data = await Promise.resolve(
      Object.values(books).filter(book =>
        book.author && book.author.toLowerCase().includes(author)
      )
    );

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching author books" });
  }
});


// ROUTE: Get books by title (case-insensitive)
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.trim().toLowerCase();

  try {
    const data = await Promise.resolve(
      Object.values(books).filter(book =>
        book.title && book.title.toLowerCase().includes(title)
      )
    );

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching title books" });
  }
});


// ROUTE: Get reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(books[isbn].reviews);
});


// Export router
module.exports.general = public_users;