// queries
const mongoose = require("mongoose");
const Book = require("./insert_book");
const uri =
  "mongodb+srv://Mernstack:2006.dbUser@cluster0.xrznduu.mongodb.net/plp_bookstore?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

async function main() {
  try {
    // 1. Find all books in the "Fantasy" genre
    const fantasyBooks = await Book.find({ genre: "Fantasy" });
    console.log("Fantasy Books:", fantasyBooks);

    // 2. Find books published after the year 1950
    const recentBooks = await Book.find({ published_year: { $gt: 1950 } });
    console.log("Books published after 1950:", recentBooks);

    // 3. Find books by the author "George Orwell"
    const orwellBooks = await Book.find({ author: "George Orwell" });
    console.log("Books by George Orwell:", orwellBooks);

    // 4. Update the price of the book "The Alchemist" to 13.99
    const updatedBook = await Book.updateOne(
      { title: "The Alchemist" },
      { $set: { price: 13.99 } }
    );
    console.log("Updated The Alchemist price:", updatedBook);

    // 5. Delete the book titled "Animal Farm"
    const deletedBook = await Book.deleteOne({ title: "Animal Farm" });
    console.log("Deleted Animal Farm:", deletedBook);

    // -----------------------------
    // Advanced Queries
    // -----------------------------

    // 1️⃣ Find books that are both in stock and published after 2010
    const recentInStock = await Book.find({
      in_stock: true,
      published_year: { $gt: 2010 },
    });
    console.log("Books in stock and published after 2010:", recentInStock);

    // 2️⃣ Use projection to return only title, author, and price
    const projectedBooks = await Book.find(
      {}, // you can filter if needed
      { title: 1, author: 1, price: 1, _id: 0 },
    );
    console.log("Books with title, author, price:", projectedBooks);

    // 3️⃣ Sort books by price
    const sortedByPriceAsc = await Book.find().sort({ price: 1 });
    console.log("Books sorted by price ascending:", sortedByPriceAsc);

    const sortedByPriceDesc = await Book.find().sort({ price: -1 });
    console.log("Books sorted by price descending:", sortedByPriceDesc);

    // 4️⃣ Pagination: 5 books per page, example: page 2
    const page = 2;
    const limit = 5;
    const paginatedBooks = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(`Books page ${page}:`, paginatedBooks);

    // -----------------------------
    // Aggregation Pipelines
    // -----------------------------

    // 1️⃣ Average price of books by genre
    const avgPriceByGenre = await Book.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } },
    ]);
    console.log("Average price by genre:", avgPriceByGenre);

    // 2️⃣ Author with the most books
    const authorWithMostBooks = await Book.aggregate([
      { $group: { _id: "$author", bookCount: { $sum: 1 } } },
      { $sort: { bookCount: -1 } },
      { $limit: 1 },
    ]);
    console.log("Author with most books:", authorWithMostBooks);

    // 3️⃣ Group books by publication decade and count them
    const booksByDecade = await Book.aggregate([
      {
        $group: {
          _id: {
            $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10],
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log("Books grouped by decade:", booksByDecade);

    // -----------------------------
    // Indexing
    // -----------------------------

    // 1️⃣ Create an index on the title field
    await Book.collection.createIndex({ title: 1 });
    console.log("Index created on title");

    // 2️⃣ Create a compound index on author and published_year
    await Book.collection.createIndex({ author: 1, published_year: -1 });
    console.log("Compound index created on author and published_year");

    // 3️⃣ Example: Using explain() to show performance improvement
    const explainBeforeIndex = await Book.find({ title: "The Hobbit" }).explain(
      "executionStats",
    );
    console.log("Explain before/with index:", explainBeforeIndex);
    
  } catch (err) {
    console.error("Error running queries:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();
