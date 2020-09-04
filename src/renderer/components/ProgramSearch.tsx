import React from "react";

// type SearchProps = {
//   filter: string;
//   setFilter(): void;
// };

export default function ProgramSearch() {
  return (
    <div className="w-2/3 mx-auto py-4">
      <label className="block text-sm leading-5 font-medium text-gray-700 ml-2">
        Search Programs
      </label>
      <div className="mt-1 relative">
        <input className="form-input rounded-full py-2 block w-full pl-4 pr-12 sm:text-sm sm:leading-5" />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="search w-4 h-4 mr-4"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
