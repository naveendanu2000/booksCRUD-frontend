import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../api/api";
import Table from "./small-components/Table";
import Pagination from "./Pagination";
import CreateBook from "./CreateBook";

interface Books {
  id: number;
  title: string;
  author: string;
  description: string;
  rating: number;
}

const SearchSection = ({
  searchApi,
  paginationApi,
}: {
  searchApi: string;
  paginationApi: string;
}) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Books[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageLimit, setPageLimit] = useState({
    min: 1,
    max: 0,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(search);
    setSearch("");

    try {
      const result = await api.get(`${searchApi}/${page}/${search}`);
      const countResult = await api.get(`${searchApi}}/count/${search}`);
      setSearchResult(result.data);
      setPageCount(Math.ceil(countResult.data / 10));
      console.log(Math.ceil(countResult.data / 10));
      setPageLimit({
        min: 1,
        max: Math.min(Math.ceil(countResult.data / 10), 10),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getSearch = async () => {
      try {
        if (search.length > 0) {
          const result = await api.get(`${searchApi}/${page}/${search}`);
          const countResult = await api.get(`${searchApi}/count/${search}`);
          setSearchResult(result.data);
          setPageCount(Math.ceil(countResult.data / 10));

          setPageLimit({
            min: 1,
            max: Math.min(Math.ceil(countResult.data / 10), 10),
          });
        } else {
          setSearchResult([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getSearch();
  }, [page, search]);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="flex w-screen">
        <div className="flex flex-1 items-center justify-center">
          <button
            className="px-3 py-2 bg-amber-300 hover:bg-yellow-400 shadow hover:shadow-lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Book
          </button>
        </div>
        <div className="flex flex-2 me-20 max-w-fit justify-center items-center p-2 rounded-xs ring-2 ring-amber-100  hover:ring-2 hover:shadow-lg focus-within:shadow-md hover:ring-amber-300 focus-within:ring-2 focus-within:ring-amber-200 transition">
          <form onSubmit={handleSubmit}>
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 text-black focus:outline-none"
              placeholder="search"
              value={search}
            />
            <button className="me-2.5 text-yellow-400">
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
      {searchResult.length > 0 ? (
        <Table
          setRefresh={setRefresh}
          books={searchResult}
          page={page}
          pageCount={pageCount}
          pageLimit={pageLimit}
          setPage={setPage}
          setPageLimit={setPageLimit}
        />
      ) : search.length > 0 ? (
        <>
          <h1 className="text-6xl h-120 flex items-center">
            No results found!
          </h1>
        </>
      ) : (
        <Pagination
          refresh={refresh}
          setRefresh={setRefresh}
          paginationApi={paginationApi}
        />
      )}
      <CreateBook
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default SearchSection;
