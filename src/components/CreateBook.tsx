import { useActionState, useEffect, useState } from "react";
import { FaStar, FaRegStar, FaEdit } from "react-icons/fa";
import api from "../api/api";
import { GiCancel } from "react-icons/gi";

interface FormState {
  error: string | null;
  success: boolean;
}

interface Author {
  id: number;
  name: string;
}

const initialState: FormState = {
  error: null,
  success: false,
};

const CreateBook = ({
  isOpen,
  setIsOpen,
  setRefresh,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  setRefresh: (x: boolean) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [isEditingRating, setIsEditingRating] = useState(true);
  const [authorPage, setAuthorPage] = useState(1);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [disableScroll, setDisableScroll] = useState(false);

  const bookAction = async (
    prevState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    try {
      const payload = {
        title: formData.get("title"),
        author: formData.get("author"),
        description: formData.get("description"),
        rating: Number(formData.get("rating")),
      };

      console.log(prevState);

      if (!payload.title || !payload.author) {
        return { error: "Title and Author are required", success: false };
      }

      await api.post("/api/books", payload);
      setRefresh(true);
      return { error: null, success: true };
    } catch (err) {
      console.error(err);
      return { error: "Something went wrong!", success: false };
    }
  };

  const authorThrottle = () => {
    if (disableScroll) return;

    setDisableScroll(true);

    setTimeout(() => {
      setAuthorPage((prev) => prev + 1);
      setDisableScroll(false);
    }, 1000);
    console.log("Throttle Called!");
  };

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const response = await api.get(`/api/authors/${authorPage}`);
        setAuthors((prev) => {
          if (prev.includes(response.data[0])) return prev;
          return [...prev, ...response.data];
        });
      } catch (error) {
        console.log(error);
      }
    };

    getAuthors();
  }, [authorPage]);

  const [state, formAction, isPending] = useActionState(
    bookAction,
    initialState,
  );

  return (
    <div
      id="modal"
      className={`${isOpen ? "block" : "hidden"} fixed inset-0 z-50`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setIsOpen(false);
        }}
      ></div>
      <div className="relative m-auto top-1/10 w-fit bg-white px-[3%] py-[3%] rounded-lg">
        <form action={formAction} className="max-w-md space-y-4 p-4">
          <h2 className="text-lg font-semibold text-center">Add Book</h2>
          <button
            className=" cursor-pointer absolute right-7 top-7"
            onClick={() => setIsOpen(false)}
          >
            <GiCancel className="text-amber-400 text-xl" />
          </button>

          <input
            name="title"
            placeholder="Title"
            className="w-full focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] border border-amber-400 focus:outline-amber-200 px-3 py-2 rounded "
          />
          <select
            name="author"
            size={5}
            className="p-5"
            onScroll={() => authorThrottle()}
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            className="w-full focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] border border-amber-400 focus:outline-amber-200 min-h-80 max-h-80
          resize-none overflow-y-auto
          px-3 py-2 rounded "
          />
          <div className="flex items-center">
            Rating:<span className="px-1"></span>
            {Array.from({ length: 5 }, (_, i) => {
              const starValue = i + 1;
              const isFilled = starValue <= rating;
              const Star = isFilled ? FaStar : FaRegStar;

              return (
                <Star
                  key={i}
                  className={` ${
                    isEditingRating
                      ? "cursor-pointer text-gray-500"
                      : "cursor-default text-yellow-400"
                  }`}
                  onMouseEnter={
                    isEditingRating ? () => setRating(starValue) : undefined
                  }
                  onClick={
                    isEditingRating
                      ? () => {
                          setRating(starValue);
                          setIsEditingRating(false);
                        }
                      : undefined
                  }
                />
              );
            })}
            <span className="ms-2"></span>
            <FaEdit
              className={`text-yellow-400 ${isEditingRating ? "hidden" : "block"}`}
              onClick={() => {
                setIsEditingRating(true);
              }}
            />
          </div>
          <input className="hidden" name="rating" readOnly value={rating} />
          {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

          {state.success && (
            <p className="text-green-600 text-sm">Book saved successfully!</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-400 shadow hover:shadow-lg hover:bg-yellow-500 py-2 rounded
          disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
