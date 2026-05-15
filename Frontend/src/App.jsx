import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import SignUpPage from "./pages/Signup.jsx";
import { useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import FullDealsPage from "./pages/FullDealsPage.jsx";
import { ToastContainer } from "react-toastify";
import BookmarksPage from "./pages/BookmarksPage.jsx";

function App() {
  const [User, setUser] = useState(null);
  useEffect(() => {
    fetch("https://skymate-backend-only.onrender.com/health").catch(() => {});
  }, []);
  return (
    <Router>
      <div className="flex min-h-svh flex-col i">
        <AuthContext.Provider value={{ User, setUser }}>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/search-flights" element={<Layout />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/deals" element={<FullDealsPage />}></Route>
          </Routes>
        </AuthContext.Provider>
      </div>
    </Router>
  );
}

export default App;
