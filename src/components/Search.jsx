// import React, { useState } from "react";

// function Search({ onSearch }) {
//   const [query, setQuery] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim() !== "") {
//       onSearch(query);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-6 flex">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Tìm video..."
//         className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded-full focus:outline-none"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
//       >
//         Search
//       </button>
//     </form>
//   );
// }

// export default Search;
