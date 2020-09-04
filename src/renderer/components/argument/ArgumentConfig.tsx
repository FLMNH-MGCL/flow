import React from "react";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import {
  FlagArgumentConfig,
  ArgumentType,
  Argument,
} from "../../models/Argument";

const FlagConfig = observer(
  ({ config }: { config: Instance<typeof FlagArgumentConfig> }) => {
    // console.log(config);
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
  [ArgumentType.FLAG]: FlagConfig,
};

type Props = {
  argument: Instance<typeof Argument>;
};

export default observer(({ argument }: Props) => {
  let ConfigComponent;
  if (argument.type in ArgumentConfig) {
    // @ts-expect-error
    ConfigComponent = ArgumentConfig[argument.type];
  }

  return (
    <div>{ConfigComponent && <ConfigComponent config={argument.config} />}</div>
  );
});
