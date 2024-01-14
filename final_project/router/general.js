const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registred. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

function getBooks() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const booksList = await getBooks();
      res.json(booksList);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send("Error fetching books");
    }
});
  

// Get book details based on ISBN
function getBookByISBN(isbn) {
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("The book was not found");
        }
      }, 1000);
    });
}



public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const book = await getBookByISBN(isbn);
      res.json(book);
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ message: error });
    }
});
  


function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
    const foundBooks = Object.keys(books).filter(key => books[key].author === author).map(key => books[key]);

    if (foundBooks.length > 0) {
        resolve(foundBooks);
    } else {
        reject("The author was not found");
    }
    }, 1000);
    });
}
  


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const foundBooks = await getBooksByAuthor(author);
        res.json(foundBooks);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});


function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        const foundBooks = Object.keys(books).filter(key => books[key].title === title).map(key => books[key]);

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject("The book was not found");
        }
        }, 1000);
    });
}
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const foundBooks = await getBooksByTitle(title);
      res.json(foundBooks);
    } catch (error) {
      res.status(400).json({ message: error });
    }
});
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.json(books[isbn].reviews);
    } else {
        res.status(400).json({message: "The book was not found"});
    }
});

module.exports.general = public_users;
