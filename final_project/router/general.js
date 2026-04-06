const express = require('express');
const axios = require("axios"); 
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


//  Get all books (Axios)
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


//  Get by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    if (!response.data) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


// Get by Author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching author books" });
  }
});


// Get by Title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching title books" });
  }
});


// Reviews 
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;