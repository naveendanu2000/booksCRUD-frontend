import { BrowserRouter, Routes, Route } from "react-router-dom";
import BooksSection from "./components/BooksSection";
import AuthorsSection from "./components/AuthorsSection";

const App = () => {
  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BooksSection />} />
          <Route path="/authors/:id" element={<AuthorsSection />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
