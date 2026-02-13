import SearchSection from "./SearchSection";

const AuthorsSection = ({ id }: { id: number }) => {
  return (
    <SearchSection
      searchApi={`/api/books/search/authorid/${id}`}
      paginationApi={`/api/books/authorid/${id}`}
    />
  );
};

export default AuthorsSection;
