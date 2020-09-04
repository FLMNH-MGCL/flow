import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { useFilePicker } from "react-sage";
import { useMst } from "../models";
import Dropdown from "../components/ui/Dropdown";
import { languages } from "../constants/languages";
import { ArgumentType } from "../models/Argument";
import FileConfiguration from "../components/program/FileConfiguration";
import ArgumentConfig from "../components/argument/ArgumentConfig";
import Argument from "../components/argument/Argument";
import RunConfiguration from "../components/program/RunConfiguration";

// TODO: separate parts into their own components

export default observer(() => {
  const params = useParams();
  const navigate = useNavigate();
  const store = useMst();

  const { files, onClick, HiddenFileInput } = useFilePicker({
    maxFileSize: 1,
  });

  const program = store.programs.items[parseInt(params.id, 10)];

  useEffect(() => {
    if (files && files.length === 1) {
      program.changeLocation(files[0].path);
    }
  }, [files]);

  console.log(files);

  function onLanguageSelect(value: string) {
    program.changeLanguage(value);
    program.changeLocation("");
  }

  function onArgumentTypeSelect(value: string) {
    program.arguments[0].changeType(
      ArgumentType[value as keyof typeof ArgumentType]
    );
  }

  return (
    <React.Fragment>
      <Header
        title={program.name}
        editableTitle
        onEdit={program.changeName}
        action={
          <button
            onClick={() => navigate("execute")}
            className="rounded-full border-2 border-indigo-600 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors focus:outline-none duration-300 flex text-md px-2 py-1 items-center justify-center font-semibold"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="play w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Execute
          </button>
        }
      />
      <div className="p-6">
        <FileConfiguration program={program} />

        <h3 className="flex justify-center items-center text-center text-xl font-bold text-gray-900 flex-1 pt-4 pb-2">
          Program Arguments
          <span className="absolute right-0 mr-6">
            <button
              className="rounded-full border-2 border-indigo-600 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors focus:outline-none duration-300 flex text-lg px-3 py-1 items-center justify-center font-semibold"
              onClick={program.createArgument}
            >
              <svg
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </span>
        </h3>

        {program.arguments && program.arguments.length > 0 && (
          <div className="flex flex-col space-y-6">
            {program.arguments.map((argument) => (
              <div className="bg-gray-100 p-2 rounded-md">
                <div className="py-2 mx-2 flex flex-col space-y-4">
                  <Argument argument={argument} key={argument.name} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!program.arguments ||
          (program.arguments.length < 1 && (
            <div className="bg-gray-100 p-2 rounded-md">
              No arguments configured
            </div>
          ))}

        <h3 className="text-center text-xl font-bold text-gray-900 flex-1 pt-4 pb-2">
          Run Configuration
        </h3>

        <RunConfiguration program={program} />
      </div>
    </React.Fragment>
  );
});
