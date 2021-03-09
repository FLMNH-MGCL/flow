import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OutsideClickHandler from 'react-outside-click-handler';
import clsx from 'clsx';
import useToggle from '../utils/useToggle';

// TODO: add key escape

type ItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function DropdownItem({ children, ...props }: ItemProps) {
  return (
    <button
      className="block px-4 py-2 w-full text-left text-sm leading-5 text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700  hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}

type Option = {
  text: string;
  value: any;
};

type DropdownProps = {
  className?: string;
  placeholder?: string;
  items?: any[];
  children?: React.ReactNode;
  options?: Option[];
  selected?: string | null;
  onSelect?(value: string): void;
};

export default function Dropdown({
  className,
  placeholder,
  children,
  options,
  selected,
  onSelect,
}: DropdownProps) {
  const [open, { off, toggle }] = useToggle(false);

  return (
    <OutsideClickHandler onOutsideClick={off}>
      <div className={clsx('relative inline-block text-left', className)}>
        <div onClick={() => toggle()}>
          <span className="rounded-md shadow-sm">
            <button
              type="button"
              className="dark:border-dark-600 inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white dark:bg-dark-400 dark:text-dark-200 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            >
              {selected ? selected : placeholder}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="duration-100 origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-50"
            >
              <div className="rounded-md bg-white dark:bg-dark-600  shadow-xs">
                <div className="py-1">
                  {options
                    ? options.map((option, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              if (onSelect) {
                                onSelect(option.text);
                                toggle();
                              }
                            }}
                          >
                            {option.text}
                          </DropdownItem>
                        );
                      })
                    : { children }}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OutsideClickHandler>
  );
}
