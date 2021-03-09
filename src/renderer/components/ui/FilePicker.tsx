import clsx from 'clsx';
import React from 'react';
import pickFile from '../../functions/pickFile';

type FilePickerProps = {
  dir?: boolean;
  label: string;
  placeholder?: string;
  onChange(buffer: any): void;
  value: string;
  fullWidth?: boolean;
};

export default function FilePicker({
  dir,
  label,
  placeholder,
  onChange,
  value,
  fullWidth,
}: FilePickerProps) {
  async function openDialog() {
    const result = await pickFile({ name: '', extensions: [], dir });

    if (result) {
      onChange(result);
    }
  }

  return (
    <div className={clsx(fullWidth && 'flex-1')}>
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200">
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10 dark:text-dark-300">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md bg-white dark:bg-dark-400 border-gray-300 dark:border-dark-400 placeholder-gray-400 dark:placeholder-dark-300 focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out text-sm leading-5 dark:caret-dark-300"
            placeholder={placeholder ?? `Path to ${dir ? 'Folder' : 'File'}`}
          />
        </div>
        <button
          onClick={openDialog}
          className="-ml-px relative inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-dark-500 text-sm font-medium rounded-r-md text-gray-700 dark:text-dark-300 bg-gray-50 dark:bg-dark-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {dir ? (
            <svg
              className="h-5 w-5 text-gray-400 dark:text-dark-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400 dark:text-dark-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
              />
            </svg>
          )}
          <span>Select {dir ? 'Folder' : 'File'}</span>
        </button>
      </div>
    </div>
  );
}
