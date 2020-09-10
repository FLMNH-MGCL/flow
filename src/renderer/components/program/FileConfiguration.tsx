import React, { useEffect } from "react";
import { Instance } from "mobx-state-tree";
import { Program } from "../../models/Programs";
import { languages } from "../../constants/languages";
import { useFilePicker } from "react-sage";
import Dropdown from "../ui/Dropdown";
import { observer } from "mobx-react-lite";

type Props = {
  program: Instance<typeof Program>;
  onLanguageSelect?(): void;
};

export default observer(({ program }: Props) => {
  const { files, onClick, HiddenFileInput } = useFilePicker({
    maxFileSize: 1,
  });

  useEffect(() => {
    if (files && files.length === 1) {
      program.changeLocation(files[0].path);
    }
  }, [files]);

  function onLanguageSelect(value: string) {
    program.changeLanguage(value);
    program.changeLocation("");
    // program.generateRunConfig();
  }

  // TODO:
  const useDirectory = false;

  return (
    <div>
      <h3 className="text-center text-xl font-bold text-gray-900 flex-1 pb-2">
        File Configuration
      </h3>
      <div className="bg-gray-100 p-2 rounded-md">
        <div className="py-2 mx-2 flex">
          <div className="mr-4">
            <label className="block text-sm leading-5 font-medium text-gray-700">
              Program Type
            </label>

            <Dropdown
              className="mt-1"
              placeholder="Language"
              options={Object.keys(languages).map((key) => {
                const lang = languages[key];

                return {
                  text: key,
                  value: lang.extension,
                };
              })}
              selected={program.language}
              onSelect={onLanguageSelect}
            />
          </div>

          {program.language && (
            <div>
              <label className="block text-sm leading-5 font-medium text-gray-700">
                Accepted Extensions
              </label>

              <input
                className="mt-1 rounded-md border border-gray-300 px-4 py-2 bg-blue-100 text-sm leading-5"
                disabled
                value={languages[program.language].extension}
              />
            </div>
          )}
        </div>

        {program.language && languages[program.language].tip && (
          <div className="py-2 mx-2">
            <p className="text-sm leading-5 font-medium text-gray-700">
              {languages[program.language].tip}
            </p>
          </div>
        )}

        <div className="py-2 mx-2">
          <label className="block text-sm leading-5 font-medium text-gray-700">
            {useDirectory ? "Folder" : "File"} Location
          </label>
          {useDirectory ? (
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                className="form-input rounded-md block w-full pl-4 pr-12 sm:text-sm sm:leading-5"
                placeholder="Enter the path to the program"
                value={program.fileLocation ? program.fileLocation : ""}
                onChange={(e) => program.changeLocation(e.target.value)}
              />
            </div>
          ) : (
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                className="form-input rounded-md block w-full pl-4 pr-12 sm:text-sm sm:leading-5"
                placeholder="Enter the path to the program"
                value={program.fileLocation ? program.fileLocation : ""}
                onChange={(e) => program.changeLocation(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="folder-open w-4 h-4 mr-4 text-gray-700 cursor-pointer"
                  onClick={onClick}
                >
                  <path
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                    clipRule="evenodd"
                  />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <HiddenFileInput
          multiple={false}
          accept={program.language ? languages[program.language].extension : ""}
        />
      </div>
    </div>
  );
});
