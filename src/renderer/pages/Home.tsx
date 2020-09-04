import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-6 space-y-6 text-center min-h-screen flex flex-col">
      <h1 className="text-5xl font-bold text-gray-900">
        welcome to <span className="text-indigo-600">flow</span>
      </h1>
      <p>
        flow is an electron utility for managing and executing external scripts
        used in the Digitization department of the FLMNH
      </p>

      <div className="flex justify-center">
        <Link
          to="programs"
          className="rounded-full border-2 border-indigo-600 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors focus:outline-none duration-300 flex text-lg px-4 py-2 items-center justify-center font-semibold"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="terminal w-6 h-6 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          View Programs
        </Link>
      </div>
    </div>
  );
}
