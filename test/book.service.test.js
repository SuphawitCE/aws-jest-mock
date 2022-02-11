const bookService = require("../src/bookService");
const booksProvider = require("../src/booksProvider");
const emailService = require("../src/emailService");

describe("searchBook", () => {
  describe("when one book matches search text", () => {
    test("Should return 1 book", () => {
      booksProvider.getBooks = jest.fn(() => [
        {
          _id: 1,
          title: "Learning React",
          categories: ["Web Development"],
          authors: "John Doe",
          price: 555,
          ordered: 123,
        },
      ]);
      emailService.sendMissingBookEmail = jest.fn();

      const books = bookService.searchBooks("react");
      expect(books.length).toBe(1);
    });
  });
});
