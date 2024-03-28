   // cannister code goes here
import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap } from 'azle';

// Define types for User, Book, and Admin
interface User {
   id: string;
   name: string;
   email: string;
   password: string;
}
interface Book {
   id: string;
   title: string;
   author: string;
   category: string;
   price: number;
   issued: boolean;
   issuedTo: string | null;
   dueDate: Date | null;
}
interface Admin {
   username: string;
   password: string;
}

// Define storage for users, books, and admins using StableBTreeMap
const usersStorage = StableBTreeMap<string, User>(0);
const booksStorage = StableBTreeMap<string, Book>(1); // Using memory ID 1 for books
const adminsStorage = StableBTreeMap<string, Admin>(2); // Using memory ID 2 for admins
const booksStorage = StableBTreeMap<string, Book>(1);
const adminsStorage = StableBTreeMap<string, Admin>(2);

// Implement user signup and login endpoints
// Initialize Express app
const app = express();
app.use(express.json());

// User signup
app.post("/signup", (req, res) => {
   const { name, email, password } = req.body;
   if (!name || !email || !password) {
      return res.status(400).send("Name, email, and password are required");
   }
   const id = uuidv4();
   const newUser: User = { id, name, email, password };
   usersStorage.insert(id, newUser);
   res.json(newUser);
});
// User login
app.post("/login", (req, res) => {
   const { email, password } = req.body;
   const user = Object.values(usersStorage.values()).find(u => u.email === email && u.password === password);
   if (user) {
      res.json(user);
   } else {
      res.status(401).send("Invalid email or password");
   }
});

// Implement book search and issuance endpoints for users
// Book search
app.get("/books", (req, res) => {
   res.json(booksStorage.values());
});
// Book issuance
app.post("/issue", (req, res) => {
   const { userId, bookId } = req.body;
   const book = booksStorage.get(bookId).Some;
   if (!book) {
      res.status(404).send("Book not found");
   } else if (book.issued) {
      res.status(400).send("Book already issued");
   } else {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // Assuming a two-week lending period
      book.issued = true;
      book.issuedTo = userId;
      book.dueDate = dueDate;
      booksStorage.insert(bookId, book);
      res.json(book);
      return res.status(404).send("Book not found");
   }
   if (book.issued) {
      return res.status(400).send("Book already issued");
   }
   const dueDate = new Date();
   dueDate.setDate(dueDate.getDate() + 14);
   book.issued = true;
   book.issuedTo = userId;
   book.dueDate = dueDate;
   booksStorage.insert(bookId, book);
   res.json(book);
});

// Implement admin login and admin functionalities
// Admin login
app.post("/admin/login", (req, res) => {
   const { username, password } = req.body;
   const admin = Object.values(adminsStorage.values()).find(a => a.username === username && a.password === password);
   if (admin) {
      res.json(admin);
   } else {
      res.status(401).send("Invalid admin credentials");
   }
});
// Admin add book
app.post("/admin/add-book", (req, res) => {
   const { title, author, category, price } = req.body;
   const id = uuidv4();
   const newBook: Book = { id, title, author, category, price, issued: false, issuedTo: null, dueDate: null };
   booksStorage.insert(id, newBook);
   res.json(newBook);
});
// Admin view issued books
app.get("/admin/issued-books", (req, res) => {
   const issuedBooks = Object.values(booksStorage.values()).filter(book => book.issued);
   res.json(issuedBooks);
});
// Admin view overdue books
app.get("/admin/overdue-books", (req, res) => {
   const today = new Date();
   const overdueBooks = Object.values(booksStorage.values()).filter(book => book.issued && book.dueDate && book.dueDate < today);
   res.json(overdueBooks);
});
// Run the server
export default Server(() => {
   return app.listen();
});
