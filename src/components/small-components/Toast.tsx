import { IoMdDoneAll } from "react-icons/io";
import { GiCancel } from "react-icons/gi";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  isToastVisible: boolean;
  setIsToastVisible: (v: boolean) => void;
  duration?: number;
};

export const Toast = ({
  message,
  isToastVisible,
  setIsToastVisible,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (!isToastVisible) return;

    const timer = setTimeout(() => {
      setIsToastVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [isToastVisible, duration, setIsToastVisible]);

  return (
    <div
      className={`
        fixed top-10 left-1/2 z-50
        -translate-x-1/2
        flex items-center gap-2
        rounded-lg bg-white px-5 py-3
        shadow-lg
        transition-all duration-300
        ${
          isToastVisible
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0"
        }
      `}
      role="status"
      aria-live="polite"
    >
      <IoMdDoneAll className="text-green-600 text-lg" />

      <span className="text-sm text-gray-800">{message}</span>

      <button
        onClick={() => setIsToastVisible(false)}
        className="ml-2 text-amber-400 hover:text-amber-500"
        aria-label="Close toast"
      >
        <GiCancel />
      </button>
    </div>
  );
};
