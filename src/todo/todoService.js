const todoProvider = require('./todoProvider');
const emailService = require('./emailService');

function searchBooks(searchText) {
  const list = todoProvider.getTodo();

  const filteredList = list.filter((item) => item.name.toLowerCase().includes(searchText));

  if (!filteredList.length) {
    emailService.sendMissingTodoEmail();
  }

  const formattedBooks = filteredList.map((item) => {
    return {
      _id: item._id,
      name: _formatBookName(item),
      isDone: item.isDone,
    };
  });

  return formattedBooks;
}

function _formatBookName(list) {
  const { name, isDone } = list;
  if (isDone) {
    return name;
  }

  const yearOfPublish = new Date(publishedDate).getFullYear();

  return `${title} ${yearOfPublish}`;
}

function getMostPopularBook() {
  const books = booksProvider.getBooks();

  return books.reduce((a, b) => (a.ordered > b.ordered ? a : b));
}

function calculateDiscount(bookId) {
  const book = booksProvider.getBooks().find((book) => book._id === bookId);
  if (!book) {
    throw new Error('Book with such id not found');
  }

  const discountInPercents = 20;
  const discount = (book.price * discountInPercents) / 100;

  return book.price - discount;
}

function calculateDiscountAsync(bookId) {
  const price = calculateDiscount(bookId);

  return new Promise((resolve) => {
    setTimeout(() => resolve(price), 1000);
  });
}

module.exports = {
  searchBooks,
  getMostPopularBook,
  calculateDiscount,
  calculateDiscountAsync
};