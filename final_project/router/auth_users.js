const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username":"atef1",
    "password":"123"
},];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

function addOrUpdateReview(isbn, username, reviewText) {
    if (books[isbn] && books[isbn].reviews) {
      books[isbn].reviews[username] = reviewText;
      return true;
    } else {
      return false;
    }
  }
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review_text = req.body.review;
  const username =  req.user.data;;
    if (addOrUpdateReview(isbn, username, review_text)) {
        res.status(200).json({ message: "Review added/updated successfully" });
    } else {
        res.status(404).json({message: "The book was not found"});
    }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    const username =  req.user.data;

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        res.status(200).json({ message: "Review deleted successfully" });
    } else {
        res.status(404).json({message: "The review was not deleted/found"});
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
