import { useEffect, useLayoutEffect, useState } from "react";
import api from "../api/api";
import Table from "./small-components/Table";

interface Books {
  id: number;
  title: string;
  author: string;
  description: string;
  rating: number;
}

const Pagination = ({
  refresh,
  setRefresh,
}: {
  refresh: boolean;
  setRefresh: (x: boolean) => void;
}) => {
  const [books, setBooks] = useState<Books[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageLimit, setPageLimit] = useState({
    min: 1,
    max: 0,
  });

  useEffect(() => {
    const getPageCount = async () => {
      try {
        const result = await api.get("/api/books/count");
        setPageCount(Number(result.data.pages));
        setPageLimit({
          min: 1,
          max: Math.min(result.data.pages, 10),
        });
      } catch (error) {
        console.log(error);
      }
    };

    getPageCount();
  }, []);

  useLayoutEffect(() => {
    const getBooks = async () => {
      try {
        const result = await api.get(`/api/books/${page}`);
        setBooks(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setRefresh(false);
      }
    };

    getBooks();
  }, [page, refresh, setRefresh]);

  return (
    <div className="">
      <div>
        <Table
          setRefresh={setRefresh}
          books={books}
          page={page}
          setPage={setPage}
          setPageLimit={setPageLimit}
          pageCount={pageCount}
          pageLimit={pageLimit}
        />
      </div>
    </div>
  );
};

export default Pagination;
