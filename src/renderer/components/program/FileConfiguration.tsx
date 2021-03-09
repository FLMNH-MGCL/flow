import React from 'react';
import { Instance } from 'mobx-state-tree';
import { Program } from '../../models/Programs';
import { languages } from '../../constants/languages';
import Dropdown from '../ui/Dropdown';
import { observer } from 'mobx-react-lite';
import FilePicker from '../ui/FilePicker';

type Props = {
  program: Instance<typeof Program>;
  onLanguageSelect?(): void;
};

export default observer(({ program }: Props) => {
  function onLanguageSelect(value: string) {
    if (value !== program.language) {
      program.reset();
      program.changeLanguage(value);
      program.changeLocation('');
    }
  }

  function handleChangeFileOrDir(newVal: string) {}

  // TODO: figure out how to handle directory inputs, useFilePicker does not
  // currently support it
  const useDirectory = false;

  return (
    <div>
      <h3 className="text-center text-xl font-bold text-gray-900 dark:text-dark-200 flex-1 pb-2">
        File Configuration
      </h3>
      <div className="bg-gray-100 dark:bg-dark-700 p-2 rounded-md">
        <div className="py-2 mx-2 flex">
          <div className="mr-4">
            <label className="block text-sm leading-5 font-medium text-gray-700 dark:text-dark-200">
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
              <label className="block text-sm leading-5 font-medium text-gray-700 dark:text-dark-200">
                Accepted Extensions
              </label>

              <input
                className="mt-1 rounded-md border border-gray-300 dark:border-dark-500 px-4 py-2 bg-blue-100 dark:bg-dark-400 text-sm leading-5 dark:text-dark-200"
                disabled
                value={languages[program.language].extension}
              />
            </div>
          )}
        </div>

        {program.language && languages[program.language].tip && (
          <div className="py-2 mx-2">
            <p className="text-sm leading-5 font-medium text-gray-700 dark:text-dark-200">
              {languages[program.language].tip}
            </p>
          </div>
        )}

        <div className="py-2 mx-2">
          <FilePicker
            dir={useDirectory}
            label={`Select ${useDirectory ? 'Directory' : 'File Location'}`}
            onChange={handleChangeFileOrDir}
            value={program.fileLocation ?? ''}
          />
        </div>
      </div>
    </div>
  );
});
