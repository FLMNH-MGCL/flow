import React from "react";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { defaultArguments, Program } from "../../models/Programs";
import Toggle from "../ui/Toggle";
import { languages } from "../../constants/languages";
import clsx from "clsx";

export default observer(
  ({ program }: { program: Instance<typeof Program> }) => {
    const { runConfig } = program;

    const hasPrefix =
      program.language && languages[program.language].prefix !== undefined;

    // comment for my decision to use clsx in my query/command builder:
    // I decided to transition over to clsx as opposed to template strings
    // 1. because of the cleaner presentation the logic has now, and 2. because of
    // how clsx handles undefined/null data. For example, using clsx I can simply
    // return the combination of arg.flag and arg.value. If the type of argument is a FLAG,
    // arg.value does not exist. Using template strings, ${arg.value} would put a big, fat
    // 'undefined' in my query string.
    function generateFullCommand() {
      const { runConfig } = program;

      if (!runConfig || !program.language) return "";

      const command = clsx(
        runConfig.commandPrefix,
        defaultArguments[program.language],
        program.fileLocation,
        runConfig.arguments.map((argName) => {
          const arg = program.arguments.find((arg) => arg.name == argName)
            ?.config;

          return clsx(arg?.flag, arg?.value);
        })
      );

      runConfig.changeCommand(command);

      return command;
    }

    if (!runConfig && !program.fileLocation) {
      return (
        <div className="bg-gray-100 p-2 rounded-md">
          You must add in the location data to generate a run configuration
        </div>
      );
    }

    if (!runConfig) {
      return (
        <div className="bg-gray-100 p-2 rounded-md">
          <button
            className="py-2 px-3 bg-green-200 text-green-800 rounded-md text-sm"
            onClick={program.generateRunConfig}
            disabled={!program.fileLocation}
          >
            Generate Default
          </button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <h3 className="flex justify-center items-center text-center text-xl font-bold text-gray-900 flex-1 pt-4 pb-2">
          Run Configuration
          <span className="absolute right-0 mr-6">
            <button
              className="rounded-full border-2 border-indigo-600 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors focus:outline-none duration-300 flex text-lg px-3 py-1 items-center justify-center font-semibold"
              disabled={!program.fileLocation}
              onClick={generateFullCommand}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </span>
        </h3>

        <div className="bg-gray-100 p-2 rounded-md">
          <div className="py-2 mx-2 flex flex-col space-y-4">
            {hasPrefix && (
              <div>
                <label className="block text-sm font-medium leading-5 text-gray-700">
                  Command Prefix
                </label>
                <input
                  className="form-input block sm:text-sm sm:leading-5"
                  placeholder="python3"
                  value={runConfig.commandPrefix}
                  onChange={(e) =>
                    runConfig.changeCommandPrefix(e.target.value)
                  }
                />
              </div>
            )}

            {/* SELECT ARGS */}
            <div className="flex flex-row flex-wrap items-center">
              {program.arguments.map((argument, index) => {
                const enabled = runConfig.arguments.includes(argument.name);
                return (
                  <div
                    className="flex items-center mr-4 pb-3"
                    key={`${index}-${argument.name}`}
                  >
                    <Toggle
                      title={argument.name}
                      enabled={enabled}
                      onToggle={() => {
                        if (enabled) {
                          runConfig.removeArgument(argument.name);
                          generateFullCommand();
                        } else {
                          runConfig.addArgument(argument.name);
                          generateFullCommand();
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <h3>Command Preview</h3>
              <pre className="w-full bg-gray-200 p-2 pb-3 rounded-md text-gray-800 text-sm overflow-x-scroll">
                {runConfig.command ? runConfig.command : generateFullCommand()}
              </pre>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
