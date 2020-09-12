import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import {
  FlagArgumentConfig,
  ArgumentType,
  Argument,
  FileArgumentConfig,
  DirArgumentConfig,
  VarArgumentConfig,
} from "../../models/Argument";
import { useFilePicker } from "react-sage";

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
          <label className="block text-sm font-medium leading-5 text-gray-700">
            Flag Value
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                className="form-input block w-full sm:text-sm sm:leading-5"
                placeholder="--flag"
                value={config.flag}
                onChange={(e) => config.changeFlag(e.target.value)}
              />
            </div>
          </label>

          <label className="block text-sm font-medium leading-5 text-gray-700">
            Argument Value
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                className="form-input rounded-md block w-full pl-4 pr-12 sm:text-sm sm:leading-5"
                placeholder="Enter the path to the file"
                value={config.value}
                onChange={(e) => config.changeValue(e.target.value)}
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
        <label className="block text-sm font-medium leading-5 text-gray-700">
          Flag Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="form-input block w-full sm:text-sm sm:leading-5"
              placeholder="--flag"
              value={config.flag}
              onChange={(e) => config.changeFlag(e.target.value)}
            />
          </div>
        </label>

        <label className="block text-sm font-medium leading-5 text-gray-700">
          Argument Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="form-input block w-full sm:text-sm sm:leading-5"
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
        <label className="block text-sm font-medium leading-5 text-gray-700">
          Flag Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="form-input block w-full sm:text-sm sm:leading-5"
              placeholder="--flag"
              value={config.flag}
              onChange={(e) => config.changeFlag(e.target.value)}
            />
          </div>
        </label>

        <label className="block text-sm font-medium leading-5 text-gray-700">
          Argument Value
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              className="form-input block w-full sm:text-sm sm:leading-5"
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
      <label className="block text-sm font-medium leading-5 text-gray-700">
        Flag Value
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            className="form-input block w-full sm:text-sm sm:leading-5"
            placeholder="--flag"
            value={config.flag}
            onChange={(e) => config.changeFlag(e.target.value)}
          />
        </div>
      </label>
    );
  }
);

const ArgumentConfig = {
  [ArgumentType.FILE]: FileConfig,
  [ArgumentType.DIR]: DirConfig,
  [ArgumentType.VAR]: VarConfig,
  [ArgumentType.FLAG]: FlagConfig,
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
