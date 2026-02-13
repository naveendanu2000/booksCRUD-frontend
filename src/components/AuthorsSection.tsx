import { useParams } from "react-router-dom";
import SearchSection from "./SearchSection";

const AuthorsSection = () => {
  const { id } = useParams();
  return (
    <SearchSection
      searchApi={`/api/books/search/authorid/${id}`}
      paginationApi={`/api/books/authorid/${id}`}
    />
  );
};

export default AuthorsSection;
