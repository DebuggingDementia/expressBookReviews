// Import Express to create routes
const express = require('express');

// Import Axios for making HTTP requests (required for this task)
const axios = require("axios"); 

// Import the books data
let books = require("./booksdb.js");

// Import function to check if username is valid
let isValid = require("./auth_users.js").isValid;

// Import users array
let users = require("./auth_users.js").users;

// Create router for public users
const public_users = express.Router();


// ROUTE: Register a new user
public_users.post("/register", (req,res) => {

  // Extract username and password from request body
  const {username , password} = req.body;

  // Check if both fields are provided
  if(!username || !password ){
    return res.status(400).json({message: "username and password required"});
  }

  // Check if username already exists
  if(!isValid(username)){
    return res.status(400).json({message : "username already exists"});
  }

  // Add new user to the users array
  users.push({username, password});

  // Send success response
  return res.json({message : "registered successfully"});
});


// ROUTE: Get all books
public_users.get('/', async (req, res) => {

  try {
    // Make HTTP request using Axios
    const response = await axios.get("http://localhost:5000/");

    // Return the data received
    return res.json(response.data);

  } catch (err) {
    // Handle error
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ROUTE: Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {

  // Get ISBN from request parameters
  const isbn = req.params.isbn;

  try {
    // Make request using Axios
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    // If book not found
    if (!response.data) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Return book data
    return res.json(response.data);

  } catch (err) {
    // Handle error
    return res.status(500).json({ message: "Error fetching book" });
  }
});


// ROUTE: Get books by author
public_users.get('/author/:author', async (req, res) => {

  // Get author from parameters
  const author = req.params.author;

  try {
    // Make request using Axios
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    // If no books found
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    // Return books list
    return res.json(response.data);

  } catch (err) {
    // Handle error
    return res.status(500).json({ message: "Error fetching author books" });
  }
});


// ROUTE: Get books by title
public_users.get('/title/:title', async (req, res) => {

  // Get title from parameters
  const title = req.params.title;

  try {
    // Make request using Axios
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    // If no books found
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    // Return books list
    return res.json(response.data);

  } catch (err) {
    // Handle error
    return res.status(500).json({ message: "Error fetching title books" });
  }
});


// ROUTE: Get reviews by ISBN
public_users.get('/review/:isbn',function (req, res) {

  // Get ISBN from parameters
  const isbn = req.params.isbn;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Return reviews
  return res.json(books[isbn].reviews);
});


// Export router
module.exports.general = public_users;