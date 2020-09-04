import React from "react";
import clsx from "clsx";

type Props = {
  title: string;
  enabled: boolean;
  onToggle(): void;
};

export default function Toggle({ title, enabled, onToggle }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <span
        className="text-sm font-medium leading-5 text-gray-700"
        onClick={onToggle}
      >
        {title}
      </span>
      <span
        role="checkbox"
        tabIndex={0}
        aria-checked="false"
        className={clsx(
          "relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline",
          !enabled && "bg-gray-200",
          enabled && "bg-indigo-600"
        )}
        onClick={onToggle}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
            !enabled && "translate-x-0",
            enabled && "translate-x-5"
          )}
        />
      </span>
    </div>
  );
}
