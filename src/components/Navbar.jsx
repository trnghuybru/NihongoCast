import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPodcast, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../store/authStore"; // ✅ import Zustand

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const user = useAuthStore((state) => state.user); // ✅ Lấy user từ Zustand
  const logout = useAuthStore((state) => state.logout); // ✅ Hàm logout
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query);
      setQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="gradient-bg text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faPodcast} className="text-2xl" />
          <NavLink to="/" className="text-xl font-bold">
            NihongoCast
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" end className="hover:text-gray-200">
            Trang chủ
          </NavLink>
          <NavLink to="/kaiwa" className="hover:text-gray-200">
            Kaiwa
          </NavLink>
          {/* chuaw link  */}
          <NavLink to="/decks" className="hover:text-gray-200">
            Flashcards
          </NavLink>
          <NavLink to="/tests" className="hover:text-gray-200">
            Test
          </NavLink>
        </nav>

        {/* Search + Auth */}
        <div className="flex items-center space-x-4">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-full"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search podcasts..."
              className="rounded-full py-1 px-4 text-gray-800 focus:outline-none w-40 md:w-64"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          {user ? (
            <>
              <span className="text-sm font-semibold">
                Xin chào, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-red-500 px-4 py-1 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className="bg-white text-red-500 px-4 py-1 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              Đăng nhập
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
