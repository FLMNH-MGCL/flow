import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { Argument, ArgumentType } from "../../models/Argument";
import ArgumentConfig from "./ArgumentConfig";
import Dropdown from "../ui/Dropdown";

type Props = {
  argument: Instance<typeof Argument>;
};

/**
 * Render a UI for a given argument model
 *
 * @param {Argument} argument - the argument to render to UI
 */
export default observer(({ argument }: Props) => {
  const [name, setName] = useState(argument.name);
  return (
    <React.Fragment>
      <div className="flex justify-between mr-4 w-full">
        <div>
          <label className="block text-sm leading-5 font-medium text-gray-700">
            Argument Name
          </label>

          <input
            className="mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              argument.changeName(name);
            }}
          />
        </div>
        <div>
          <label className="block text-sm leading-5 font-medium text-gray-700">
            Argument Type
          </label>

          <Dropdown
            className="mt-1"
            placeholder="Types"
            options={[
              { text: "FILE", value: ArgumentType.FILE },
              { text: "DIR", value: ArgumentType.DIR },
              { text: "VAR", value: ArgumentType.VAR },
              { text: "FLAG", value: ArgumentType.FLAG },
            ]}
            selected={argument.type}
            onSelect={argument.changeType}
          />
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              argument.delete();
            }}
            className="text-red-500 hover:text-red-700"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="minus-circle w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <ArgumentConfig argument={argument} />
    </React.Fragment>
  );
});
