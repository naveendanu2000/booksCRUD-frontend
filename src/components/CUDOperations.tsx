import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/api";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { MdEditSquare } from "react-icons/md";
import { WarningModal } from "./small-components/WarningModal";
import { Toast } from "./small-components/Toast";

interface Book {
  id: number;
  title: string;
  author: string;
  thumbnail: string;
  description: string;
  rating: number;
}

const CUDOperations = ({
  isOpen,
  setIsOpen,
  setRefresh,
  current,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  setRefresh: (x: boolean) => void;
  current: number;
}) => {
  const [book, setBook] = useState<Book>();
  const [toggleEditDescription, setToggleEditDescription] = useState(false);
  const [toggleEditRating, setToggleEditRating] = useState(false);
  const [rating, setRating] = useState(book?.rating ?? 0);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const displayRating = isEditingRating ? rating : (book?.rating ?? 0);
  const [disableEditing, setDisableEditing] = useState(false);

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const showToast = () => {
      setIsToastVisible(true);
    };
    showToast();
  }, [toastMessage]);

  const onConfirmDelete = async () => {
    try {
      await api.delete(`/api/books/${book?.id}`);
      setIsWarningOpen(false);
      setRefresh(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
      setToastMessage("Record Deleted Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const updateBook = useCallback(async () => {
    try {
      setDisableEditing(true);
      const result = await api.patch(`/api/books/${book?.id}`, book);
      setDisableEditing(false);
      setBook(result.data);
      setRefresh(true);
    } catch (error) {
      setDisableEditing(false);
      console.error(error);
    }
  }, [book, setRefresh]);

  const prevRatingRef = useRef<number | null>(null);

  useEffect(() => {
    if (!book) {
      prevRatingRef.current = null;
      return;
    }

    const prev = prevRatingRef.current;

    const callUpdateBook = () => {
      updateBook();
    };
    if (prev !== null && book.rating !== prev) {
      callUpdateBook();
    }

    prevRatingRef.current = book.rating;
  }, [book?.rating, book, updateBook]);

  const focusAtEnd = () => {
    const description = descriptionRef.current;
    if (!description) return;

    description.focus();
    const len = description.value.length;
    description.setSelectionRange(len, len);
  };

  useEffect(() => {
    const handleSetRating = () => {
      setRating(Number(book?.rating ?? 0));
    };
    if (!isEditingRating) {
      handleSetRating();
    }
  }, [isEditingRating, book?.rating]);

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const result = await api.get(`/api/books/id/${current}`);
        setBook(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (isOpen) getBookDetails();
  }, [current, isOpen]);

  return (
    <div
      id="modal"
      className={`${isOpen ? "block" : "hidden"} fixed inset-0 z-50`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setIsOpen(false);
          setToggleEditDescription(false);
          setToggleEditRating(false);
          setIsEditingRating(false);
          setBook({
            id: book!.id,
            title: "",
            author: "",
            thumbnail: "",
            description: "",
            rating: book!.rating,
          });
        }}
      ></div>

      <div className="relative m-auto top-1/5 w-[70%] bg-white px-[3%] py-[3%] rounded-lg">
        {!book?.title ? (
          <div>Loading...</div>
        ) : (
          <div className="flex">
            <div className="flex-1 flex items-center justify-center max-h-50 min-h-50">
              <img src={book?.thumbnail} alt="book thumbnail" />
            </div>
            <div className="flex-4 flex flex-col h-contain">
              <header className="flex w-full">
                <div className="flex-1 ps-2">
                  <h2 className=" text-xl">{book?.title}</h2>
                  <div className="text-xs">Author: {book?.author}</div>
                  <div className="text-xs flex items-center">
                    Rating: <span className="px-0.5"></span>
                    {Array.from({ length: 5 }, (_, i) => {
                      const starValue = i + 1;
                      const isFilled = starValue <= displayRating;
                      const Star = isFilled ? FaStar : FaRegStar;

                      return (
                        <Star
                          key={i}
                          className={` ${
                            isEditingRating
                              ? "cursor-pointer text-yellow-400"
                              : "cursor-default text-gray-500"
                          }`}
                          onMouseEnter={
                            isEditingRating
                              ? () => setRating(starValue)
                              : undefined
                          }
                          onClick={
                            isEditingRating
                              ? () => {
                                  setRating(starValue);
                                  setBook((prev) =>
                                    prev
                                      ? { ...prev, rating: starValue }
                                      : prev,
                                  );
                                  setIsEditingRating(false);
                                }
                              : undefined
                          }
                        />
                      );
                    })}
                    <button
                      className="ps-2"
                      disabled={disableEditing}
                      onClick={() => {
                        console.log(toggleEditRating);
                        setToggleEditRating((prev) => !prev);
                        setIsEditingRating((prev) => !prev);
                        setBook((prev) => (prev ? { ...prev, rating } : prev));
                        setRating(Number(book?.rating));
                      }}
                    >
                      {isEditingRating ? (
                        <IoCheckmarkDoneCircleOutline className="text-amber-400" />
                      ) : (
                        <MdEditSquare className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    id="closeBtn"
                    className="shadow hover:shadow-lg hover:bg-yellow-400 px-4 py-2 rounded-sm bg-amber-300"
                    onClick={() => {
                      setIsOpen(false);
                      setToggleEditDescription(false);
                      setToggleEditRating(false);
                      setIsEditingRating(false);
                      setBook({
                        id: book!.id,
                        title: "",
                        author: "",
                        thumbnail: "",
                        description: "",
                        rating: book!.rating,
                      });
                    }}
                  >
                    Close
                  </button>
                </div>
              </header>

              <div className="my-1 flex-1 flex focus-within:shadow-lg rounded border border-transparent focus-within:border  focus-within:border-amber-200">
                {toggleEditDescription ? (
                  <textarea
                    ref={descriptionRef}
                    id="description"
                    onFocus={focusAtEnd}
                    onChange={(e) => {
                      setBook((prev) =>
                        prev
                          ? {
                              ...prev,
                              description: e.target.value,
                            }
                          : prev,
                      );
                    }}
                    className="grow resize-none max-h-50 min-h-50 overflow-y-auto p-2 rounded focus:border-0 border shadow border-amber-300 focus:outline-none focus:ring-0"
                  >
                    {book?.description}
                  </textarea>
                ) : (
                  <p className="p-2 grow max-h-50 min-h-50 border border-transparent overflow-y-auto">
                    {book?.description}
                  </p>
                )}
              </div>
              <div className="flex self-end justify-center">
                <button
                  disabled={disableEditing}
                  className="relative bottom-0 self-end"
                >
                  <AiFillDelete
                    className="text-red-600 text-xl"
                    onClick={() => setIsWarningOpen(true)}
                  />
                </button>
                <span className="px-1"></span>
                <button
                  disabled={disableEditing}
                  className="relative bottom-0 self-end"
                  onClick={() => setToggleEditDescription((prev) => !prev)}
                >
                  <label htmlFor="description">
                    {toggleEditDescription ? (
                      <IoCheckmarkDoneCircleOutline
                        className="text-yellow-400 cursor-pointer"
                        onClick={updateBook}
                      />
                    ) : (
                      <MdEditSquare className="text-gray-500 cursor-pointer" />
                    )}
                  </label>
                </button>
              </div>
            </div>
          </div>
        )}
        <WarningModal
          open={isWarningOpen}
          setOpen={setIsWarningOpen}
          onConfirm={onConfirmDelete}
        />
        <Toast
          message={toastMessage}
          isToastVisible={isToastVisible}
          setIsToastVisible={setIsToastVisible}
        />
      </div>
    </div>
  );
};

export default CUDOperations;
