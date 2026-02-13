import SearchSection from "./SearchSection";

const BooksSection = () => {
  return <SearchSection searchApi="/api/books/search" paginationApi="/api/books"/>;
};

export default BooksSection;
