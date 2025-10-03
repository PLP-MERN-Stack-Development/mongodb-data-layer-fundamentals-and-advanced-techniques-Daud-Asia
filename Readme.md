PLP Bookstore MongoDB Project

Project Overview

This project demonstrates CRUD operations, advanced queries, aggregation pipelines, and indexing using MongoDB Atlas and Mongoose in Node.js. The main goal is to manage a bookstore database, performing queries on a collection of books with real dataset attributes like title, author, genre, published_year, price, in_stock, pages, and publisher.


---

Technologies Used

Node.js

Mongoose

MongoDB Atlas

Replit (for online development and execution)



---

Dataset

The database contains a collection of 12 books. Each document has the following structure:

{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "genre": "Fiction",
  "published_year": 1960,
  "price": 12.99,
  "in_stock": true,
  "pages": 336,
  "publisher": "J. B. Lippincott & Co."
}

Other notable books include:

"1984" by George Orwell

"The Hobbit" and "The Lord of the Rings" by J.R.R. Tolkien

"The Alchemist" by Paulo Coelho

"Animal Farm" by George Orwell (deleted during CRUD demonstration)



---

Project Structure

/project-root
│
├─ insert_book.js        // Book model schema
├─ queries.js            // All CRUD, advanced queries, aggregations, and indexing
└─ README.md             // This documentation


---

CRUD Operations

1. Read

Find all books in a specific genre: "Fantasy"


Book.find({ genre: "Fantasy" });

Find books published after a certain year: 1950


Book.find({ published_year: { $gt: 1950 } });

Find books by a specific author: "George Orwell"


Book.find({ author: "George Orwell" });

2. Update

Update the price of "The Alchemist" to 13.99


Book.updateOne({ title: "The Alchemist" }, { $set: { price: 13.99 } });

3. Delete

Delete the book "Animal Farm"


Book.deleteOne({ title: "Animal Farm" });


---

Advanced Queries

1. Find books that are both in stock and published after 2010



Book.find({ in_stock: true, published_year: { $gt: 2010 } });

(Note: No books in the current dataset meet this condition.)

2. Use projection to return only title, author, and price



Book.find({}, { title: 1, author: 1, price: 1, _id: 0 });

3. Sort books by price:



// Ascending
Book.find().sort({ price: 1 });

// Descending
Book.find().sort({ price: -1 });

4. Pagination (5 books per page, page 2)



Book.find().skip((page - 1) * limit).limit(limit);


---

Aggregation Pipelines

1. Average price of books by genre



Book.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

2. Author with the most books



Book.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

Result: "J.R.R. Tolkien" with 2 books.

3. Group books by publication decade and count



Book.aggregate([
  {
    $group: {
      _id: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


---

Indexing

1. Index on title field for faster searches



Book.collection.createIndex({ title: 1 });

2. Compound index on author and published_year



Book.collection.createIndex({ author: 1, published_year: -1 });

3. Using explain() to demonstrate performance



Book.find({ title: "The Hobbit" }).explain("executionStats");

Shows query execution plan and number of documents examined.

Using indexes reduces scanned documents and improves performance.



---

How to Run

1. Clone or open the project in Replit or locally.


2. Install dependencies:



npm install mongoose

3. Add your MongoDB Atlas URI in queries.js.


4. Run the script:



node queries.js

5. View all outputs in the console.




---

Conclusion / Notes

Learned how to use Mongoose with MongoDB Atlas.

Implemented CRUD operations, advanced queries, aggregations, and indexing.

Practiced projection, sorting, pagination, and analyzing query performance with explain().

The project demonstrates real-world database management for a bookstore collection.