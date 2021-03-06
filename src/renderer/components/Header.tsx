import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

function HeaderItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx('flex items-center', className)}>{children}</div>;
}

type Props = {
  title: string;
  action?: React.ReactNode;
  replaceNavIcon?: React.ReactNode;
  to?: string;
  editableTitle?: boolean;
  onEdit?(value: string): void;
  disableNav?: boolean;
};

export default function Header({
  title,
  action,
  editableTitle,
  replaceNavIcon,
  to,
  onEdit,
  disableNav,
}: Props) {
  // const location = useLocation().pathname;

  return (
    <div className="px-4 app-header overflow-hidden grid grid-cols-6 border-b dark:border-dark-900 sticky top-0 z-20 bg-white dark:bg-dark-800 dark:text-dark-200">
      <HeaderItem className="justify-start col-span-1">
        {!disableNav ? (
          <Link
            to={to ?? '..'}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-dark-600 focus:outline-none transition-colors duration-150"
          >
            {replaceNavIcon ?? (
              <svg
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            )}
          </Link>
        ) : (
          <button
            disabled
            className="rounded-full p-2 focus:outline-none transition-colors duration-150 text-gray-500 dark:text-dark-400"
          >
            {replaceNavIcon ?? (
              <svg
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            )}
          </button>
        )}
      </HeaderItem>
      <HeaderItem className="justify-center col-span-4">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-dark-200 flex-1">
          {editableTitle && onEdit ? (
            <input
              className="outline-none text-center text-2xl font-bold text-gray-900 dark:text-dark-200 flex-1 dark:bg-dark-800"
              value={title}
              onChange={(e: any) => onEdit(e.target.value)}
              title="Edit Program Name"
            />
          ) : (
            <>{title}</>
          )}
        </h1>
      </HeaderItem>
      <HeaderItem className="justify-end col-span-1">{action}</HeaderItem>
    </div>
  );
}
