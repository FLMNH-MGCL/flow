import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import {
  FlagArgumentConfig,
  ArgumentType,
  Argument,
  FileArgumentConfig,
  DirArgumentConfig,
  VarArgumentConfig,
  ArrayArgumentConfig,
  JsonArgumentConfig,
} from '../../models/Argument';
import ReactJson from 'react-json-view';
import { useFilePicker } from 'react-sage';

/**
 * The observers below return handle the config UI for the various Argument types.
 * The default export handles the determining of which Config component to render
 */

const FileConfig = observer(
  ({ config }: { config: Instance<typeof FileArgumentConfig> }) => {
    const { files, onClick, HiddenFileInput } = useFilePicker({
      maxFileSize: 1,
    });

    useEffect(() => {
      if (files && files.length === 1) {
        config.changeValue(files[0].path);
      }
    }, [files]);

    return (
      <React.Fragment>
        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
            Flag Value
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                placeholder="--flag"
                value={config.flag}
                onChange={(e) => config.changeFlag(e.target.value)}
              />
            </div>
          </label>

          <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
            Argument Value
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                className="rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150 rounded-md block w-full pl-4 pr-12 sm:text-sm sm:leading-5"
                placeholder="Enter the path to the file"
                value={config.value}
                onChange={(e) => config.changeValue(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="folder-open w-4 h-4 mr-4 text-gray-700 dark:text-dark-200 cursor-pointer"
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
          </label>
        </div>
        <HiddenFileInput multiple={false} accept="" />
      </React.Fragment>
    );
  }
);

const DirConfig = observer(
  ({ config }: { config: Instance<typeof DirArgumentConfig> }) => {
    // console.log(config);
    return (
      <div className="flex flex-col space-y-4">
        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Flag Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              placeholder="--flag"
              value={config.flag}
              onChange={(e) => config.changeFlag(e.target.value)}
            />
          </div>
        </label>

        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Argument Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              placeholder="value"
              value={config.value}
              onChange={(e) => config.changeValue(e.target.value)}
            />
          </div>
        </label>
      </div>
    );
  }
);

const VarConfig = observer(
  ({ config }: { config: Instance<typeof VarArgumentConfig> }) => {
    // console.log(config);
    return (
      <div className="flex flex-col space-y-4">
        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Flag Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              placeholder="--flag"
              value={config.flag}
              onChange={(e) => config.changeFlag(e.target.value)}
            />
          </div>
        </label>

        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Argument Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              placeholder="value"
              value={config.value}
              onChange={(e) => config.changeValue(e.target.value)}
            />
          </div>
        </label>
      </div>
    );
  }
);

const FlagConfig = observer(
  ({ config }: { config: Instance<typeof FlagArgumentConfig> }) => {
    return (
      <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
        Flag Value
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            placeholder="--flag"
            value={config.flag}
            onChange={(e) => config.changeFlag(e.target.value)}
          />
        </div>
      </label>
    );
  }
);

const ArrayConfig = observer(
  ({ config }: { config: Instance<typeof ArrayArgumentConfig> }) => {
    const [validationMessage, setValidationMessage] = useState<string>();

    function handleAdd(edit: any) {
      const {
        updated_src, //new src value
        name, //new var name,
        existing_src,
      } = edit;

      if (name !== 'values') {
        setValidationMessage('cannot add fields');
        return false;
      }

      if (Object.keys(updated_src).length > 1) {
        config.changeValue(JSON.stringify(existing_src));
        return false;
      }

      config.changeValue(JSON.stringify(updated_src));

      return true;
    }

    function handleEdit(edit: any) {
      const {
        updated_src, //new src value
        // name, //new var name
        // namespace, //list, namespace indicating var location
        // new_value, //new variable value
        // existing_value, //existing variable value
      } = edit;

      config.changeValue(JSON.stringify(updated_src));

      return true;
    }

    function handleDelete(edit: any) {
      const {
        updated_src,
        name, //new var name
      } = edit;

      if (name === 'values') {
        setValidationMessage("you cannot remove 'values'");
        return false;
      }

      config.changeValue(JSON.stringify(updated_src));

      return true;
    }

    return (
      <div className="flex flex-col space-y-4">
        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Flag Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              placeholder="--flag"
              value={config.flag}
              onChange={(e) => config.changeFlag(e.target.value)}
            />
          </div>
        </label>

        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Argument Values
        </label>

        <ReactJson
          name="arrayConfig"
          src={JSON.parse(config.value)}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
          validationMessage={validationMessage}
        />
      </div>
    );
  }
);

const JsonConfig = observer(
  ({ config }: { config: Instance<typeof JsonArgumentConfig> }) => {
    function handleChange({ updated_src }: { updated_src: Object }) {
      config.changeValue(JSON.stringify(updated_src));
    }

    return (
      <div className="flex flex-col space-y-4">
        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Flag Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="w-full rounded-md border border-gray-300 dark:border-dark-500 dark:bg-dark-500 dark:text-dark-200 px-4 py-2 text-sm leading-5 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              placeholder="--flag"
              value={config.flag}
              onChange={(e) => config.changeFlag(e.target.value)}
            />
          </div>
        </label>

        <label className="block text-sm font-medium leading-5 text-gray-700 dark:text-dark-200">
          Argument Value
        </label>

        <ReactJson
          name="jsonConfig"
          src={JSON.parse(config.value)}
          onEdit={handleChange}
          onAdd={handleChange}
          onDelete={handleChange}
          collapsed={false}
        />
      </div>
    );
  }
);

const ArgumentConfig = {
  [ArgumentType.FILE]: FileConfig,
  [ArgumentType.DIR]: DirConfig,
  [ArgumentType.VAR]: VarConfig,
  [ArgumentType.FLAG]: FlagConfig,
  [ArgumentType.ARRAY]: ArrayConfig,
  [ArgumentType.JSON]: JsonConfig,
};

type Props = {
  argument: Instance<typeof Argument>;
};

/**
 * Attempts to render a config UI for a given argument model
 *
 * @param {Argument} argument - the argument to render the config UI for
 */
export default observer(({ argument }: Props) => {
  let ConfigComponent;
  if (argument.type in ArgumentConfig) {
    // @ts-expect-error - not sure why this errors
    ConfigComponent = ArgumentConfig[argument.type];
  }

  return (
    <div>{ConfigComponent && <ConfigComponent config={argument.config} />}</div>
  );
});
