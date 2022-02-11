const booksProvider = require("./booksProvider");
const emailService = require("./emailService");

console.log("--------------- searchText --------------");
function searchBooks(searchText) {
  const books = booksProvider.getBooks();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchText)
  );

  if (!filteredBooks.length) {
    emailService.sendMissingBookEmail();
  }

  const formattedBooks = filteredBooks.map((book) => {
    return {
      _id: book._id,
      title: _formatBookName(book),
      categories: book.categories,
      authors: book.authors,
      price: book.price,
      ordered: book.ordered,
    };
  });
  // console.table(formattedBooks);
  console.log("formattedBooks: ", formattedBooks);

  return formattedBooks;
}

function _formatBookName(book) {
  const { title, publishedDate } = book;
  if (!publishedDate) {
    return title;
  }

  const yearOfPublish = new Date(publishedDate).getFullYear();

  return `${title} ${yearOfPublish}`;
}

module.exports = {
  searchBooks,
};
