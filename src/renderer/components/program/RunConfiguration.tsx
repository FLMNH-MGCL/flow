import React from "react";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { Program } from "../../models/Programs";
import Toggle from "../ui/Toggle";
import { ArgumentType } from "../../models/Argument";
import { languages } from "../../constants/languages";

export default observer(
  ({ program }: { program: Instance<typeof Program> }) => {
    const { runConfig } = program;

    const hasPrefix =
      program.language && languages[program.language].prefix !== undefined;

    // TODO: make me not ugly and gross
    function generateFullCommand() {
      if (!runConfig) return "";

      const suffix = program.language
        ? languages[program.language].suffix
          ? languages[program.language].suffix
          : " "
        : " ";

      let fullCommand = `${runConfig.commandPrefix}${
        program.fileLocation ? program.fileLocation : "MISSING LOCATION"
      }${suffix}`;

      runConfig.arguments.forEach((argName, index) => {
        const rawArg = program.arguments.find((arg) => arg.name === argName);

        if (rawArg) {
          if (rawArg.type === ArgumentType.FLAG) {
            fullCommand += rawArg.config.flag;
          } else {
            if (index < runConfig.arguments.length - 1) {
              fullCommand += `${rawArg.config.flag} ${rawArg?.config.value} `;
            } else {
              fullCommand += `${rawArg.config.flag} ${rawArg?.config.value}`;
            }
          }
        }
      });

      program.runConfig?.changeCommand(fullCommand);

      return fullCommand;
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
                onChange={(e) => runConfig.changeCommandPrefix(e.target.value)}
              />
            </div>
          )}

          {/* SELECT ARGS */}
          <div className="flex flex-row flex-wrap items-center">
            {program.arguments.map((argument, index) => {
              const enabled = runConfig.arguments.includes(argument.name);
              return (
                <div className="flex items-center mr-4 pb-3">
                  <Toggle
                    key={`${index}-${argument.name}`}
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
    );
  }
);
