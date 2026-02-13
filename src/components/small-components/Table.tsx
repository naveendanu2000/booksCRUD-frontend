import { useState } from "react";
import CUDOperations from "../CUDOperations";

interface Books {
  id: number;
  title: string;
  author: string;
  description: string;
  rating: number;
}

const Table = ({
  books,
  page,
  pageLimit,
  setPage,
  setPageLimit,
  setRefresh,
  pageCount,
}: {
  books: Books[];
  page: number;
  pageLimit: { min: number; max: number };
  setPage: (n: number) => void;
  setPageLimit: ({ min, max }: { min: number; max: number }) => void;
  setRefresh: (x: boolean) => void;
  pageCount: number;
}) => {
  const emptyRows = 10 - books.length;
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const updatePageLimitOnNext = () => {
    if (pageCount - pageLimit.min > 10) {
      if (pageLimit.max - page === 0) {
        const min = pageLimit.max + 1;
        const max =
          pageCount - pageLimit.max > 10 ? pageLimit.max + 10 : pageCount;
        setPageLimit({ min, max });
      }
    }
  };
  const updatePageLimitOnPrev = () => {
    if (pageLimit.min > 10) {
      if (page - pageLimit.min === 0) {
        const max = pageLimit.min - 1;
        const min = pageLimit.min - 10;
        setPageLimit({ min, max });
      }
    }
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <table className="w-[90%] table-fixed border-collapse border border-gray-300 shadow-lg">
          <thead className="bg-amber-300 shadow ">
            <tr>
              <th className="w-20 px-4 py-3 text-center text-md font-semibold border border-gray-300">
                Id
              </th>
              <th className="w-1/5 px-4 py-3 text-left text-md font-semibold border border-gray-300">
                Title
              </th>
              <th className="w-1/6 px-4 py-3 text-left text-md font-semibold border border-gray-300">
                Author
              </th>
              <th className="w-1/2 px-4 py-3 text-left text-md font-semibold border border-gray-300">
                Description
              </th>
              <th className="px-4 py-3 text-center text-md font-semibold border border-gray-300">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                onClick={() => {
                  setIsOpen(true);
                  setCurrent(Number(book.id));
                }}
                className="hover:shadow-xl hover:bg-yellow-400 cursor-pointer"
              >
                <td className="px-2 py-[0.9%] text-sm border text-center border-gray-300">
                  {book.id}
                </td>
                <td className="px-2 py-[0.9%] text-sm border border-gray-300 truncate">
                  {book.title.substring(0, 40)}
                </td>
                <td className="px-2 py-[0.9%] text-sm border border-gray-300 truncate">
                  {book.author}
                </td>
                <td className="px-2 py-[0.9%] text-sm border border-gray-300">
                  {book.description?.substring(0, 40) ||
                    "Description not available"}
                </td>
                <td className="px-2 py-[0.9%] text-center text-sm border border-gray-300">
                  {book.rating}
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyRows > 0 ? emptyRows : 0 }).map(
              (_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="px-2 py-[0.9%] text-center text-sm border border-gray-300">
                    &nbsp;
                  </td>
                  <td className="px-2 py-[0.9%] text-center text-sm border border-gray-300">
                    &nbsp;
                  </td>
                  <td className="px-2 py-[0.9%] text-center text-sm border border-gray-300">
                    &nbsp;
                  </td>
                  <td className="px-2 py-[0.9%] text-center text-sm border border-gray-300">
                    &nbsp;
                  </td>
                  <td className="px-2 py-[0.9%] text-center text-sm border border-gray-300">
                    &nbsp;
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className="w-screen flex justify-center mt-5 py-5">
        <button
          disabled={page === 1 ? true : false}
          className="mx-4 shadow hover:shadow-lg px-4 py-2 rounded-sm bg-amber-300 hover:bg-yellow-400"
          onClick={() => {
            updatePageLimitOnPrev();
            setPage(page - 1);
          }}
        >
          Prev
        </button>
        {Array.from(
          { length: pageLimit.max - pageLimit.min + 1 },
          (_, i) => pageLimit.min + i,
        ).map((n) => (
          <button
            key={n}
            className={`${page === n ? "shadow bg-amber-300" : "hover:shadow-lg "} rounded-xl py-2 px-4`}
            onClick={() => setPage(n)}
          >
            <>{n}</>
          </button>
        ))}
        <button
          disabled={page === pageCount ? true : false}
          className="mx-4 shadow hover:shadow-lg px-4 py-2 rounded-sm bg-amber-300 hover:bg-yellow-400"
          onClick={() => {
            updatePageLimitOnNext();
            setPage(page + 1);
          }}
        >
          Next
        </button>
      </div>
      <CUDOperations
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        current={current}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default Table;
