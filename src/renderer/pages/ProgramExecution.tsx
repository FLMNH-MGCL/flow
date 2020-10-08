import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useMst } from "../models";
import { ipcMain, ipcRenderer } from "electron";
import Header from "../components/Header";
import clsx from "clsx";
import { defaultArguments } from "../models/Programs";
import { ArgumentType } from "../models/Argument";
// import { AutoSizer, List } from "react-virtualized";

type ExecucutionData = {
  rawData: string;
  isError: boolean;
};

export default observer(() => {
  const params = useParams();
  const store = useMst();

  const [executing, setExecuting] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [pid, setPid] = useState<number>();
  const [eData, setEData] = useState<ExecucutionData[]>([]);

  const hasErrorRef = useRef(hasError);
  const dataEndRef = React.createRef<HTMLDivElement>();

  const [init, setInit] = useState(true);

  const program = store.programs.items[parseInt(params.id, 10)];

  function scrollToBottom() {
    if (!dataEndRef) {
      console.log("doesnt exist?");
      return;
    }

    dataEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function killExecution() {
    if (pid) {
      await ipcRenderer.send("kill_execution", {
        pid,
      });
    }
  }

  async function execute() {
    if (!program.runConfig || !program.language) return;

    const { runConfig } = program;

    setInit(false);

    let args: string[] = [];
    runConfig.arguments.forEach((argName) => {
      const arg = program.arguments.find((arg) => arg.name === argName);

      if (arg) {
        const argConfig = arg.config;

        if (arg.type === ArgumentType.ARRAY) {
          const values = JSON.parse(argConfig.value).values;

          args.push(argConfig.flag);

          values.forEach((value: any) => {
            if (typeof value !== "string" && typeof value !== "object") {
              args.push(value.toString());
            } else if (typeof value === "object") {
              // TODO: FIXME: I feel like this could be dangerous
              const stringifiedValue = JSON.stringify(value).replace(
                /(["'])/g,
                "\\$1"
              );
              args.push(stringifiedValue);
            } else {
              args.push(value);
            }
          });
        } else if (arg.type === ArgumentType.JSON) {
          let updatedValue = argConfig.value.replace(/(["'])/g, "\\$1");
          args.push(argConfig.flag);
          args.push(updatedValue);
        } else {
          if (argConfig.value) {
            args.push(argConfig.flag);
            args.push(argConfig.value);
          }
        }
      }
    });

    await ipcRenderer.send("execute_program", {
      prefix: program.runConfig.commandPrefix,
      defaultArgs: defaultArguments[program.language],
      location: program.fileLocation,
      args,
    });
  }

  // this will update the reference to the state so that the
  // useEffect hook handling the ipcRenderer listeners doesn't
  // get affected by closures
  useEffect(() => {
    hasErrorRef.current = hasError;

    scrollToBottom();
  });

  // controlled start of execution
  useEffect(() => {
    if (init) {
      setTimeout(() => {
        execute();
      }, 1000);
    }
  });

  // I moved the listeners into an effect, I realized that each update of state recreated the listeners,
  // and so when the child process sent and exit signal it would then start processing the MASSIVE
  // stack of state updates. E.g. A rust program generated over 220,000 individual state updates once
  // the 'execution_end' listener hit lol

  // One current issue this has is that if the execution is too quick, it will not be able to update the state quickly enough.
  // each listener recieves all the data, but its not always present in the array containing the execution data.
  // this will require some looking into, I don't feel that local state is viable if it lags this much, since it has to
  // copy teh entire array and append the new data each time stdout is sent. maybe I can do this on the electron side?

  // UPDATE: I altered this to be handled on the electron server instead of react state, it seems to be working perfectly now. Electron
  // has a global array that it updates on stdout and sends here.
  useEffect(() => {
    if (executing && eData.length === 0) {
      console.log("CREATING LISTENERS (should only hit once)");

      ipcRenderer.on("child_pid", (_, pid: number) => {
        setPid(pid);
      });

      ipcRenderer.on("execution_stdout", (_, data: ExecucutionData[]) => {
        setEData(data);
      });

      ipcRenderer.on("execution_stderr", (_, data: ExecucutionData[]) => {
        if (!hasErrorRef.current) {
          setHasError(true);
        }
        setEData(data);
      });

      ipcRenderer.once("execution_end", (_, _data: string) => {
        setExecuting(false);

        ipcRenderer.send("notify");
      });

      ipcRenderer.once(
        "kill_execution_response",
        (_, { killed, message }: { killed: boolean; message: string }) => {
          if (killed) {
            setPid(undefined);
            setExecuting(false);
          }

          // console.log(message);
        }
      );
    }

    return () => {
      ipcRenderer.removeAllListeners("execution_stdout");
      ipcRenderer.removeAllListeners("execution_stderr");
      ipcRenderer.removeAllListeners("execution_end");
      ipcRenderer.removeAllListeners("kill_execution_response");
      ipcRenderer.removeAllListeners("child_pid");
    };
  }, [executing]);

  // function rowRenderer({
  //   key, // Unique key within array of rows
  //   index, // Index of row within collection
  //   isScrolling, // The List is currently being scrolled
  // }: any) {
  //   return (
  //     <div key={key} className="block">
  //       {eData[index]}
  //     </div>
  //   );
  // }

  // console.log(eData);

  return (
    <React.Suspense fallback={"...loading"}>
      <Header title={`${program.name} Execution`} disableNav={executing} />

      <div className=" mx-6 pt-6">
        <div className="flex items-center pb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1">
            Command {executing ? "Running" : "Ran"}
          </h3>
          <button
            onClick={killExecution}
            className={clsx(
              executing
                ? "border-red-600 bg-white hover:bg-red-600 text-red-600 hover:text-white "
                : "border-gray-400 bg-white text-gray-400",
              "rounded-full border-2 transition-colors focus:outline-none duration-300 flex text-md px-2 py-1 items-center justify-center font-semibold"
            )}
            title="Kill Execution"
            disabled={!executing}
          >
            <p className="mr-2">Kill Program</p>
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        </div>
        <pre className="w-full bg-gray-100 p-2 pb-4 rounded-md text-gray-800 text-sm overflow-x-scroll">
          {program.runConfig!.command}
        </pre>
      </div>

      <div className="flex justify-between items-center mx-6 pt-6">
        <h3 className="text-xl font-bold text-gray-900 flex-1 pb-2">
          Program Output
        </h3>

        <span
          className={clsx(
            executing
              ? "bg-yellow-100 text-yellow-800"
              : hasError || !pid
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800",
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4"
          )}
        >
          <svg
            className={clsx(
              executing
                ? "text-yello-400"
                : hasError || !pid
                ? "text-red-400"
                : "text-green-400",
              "-ml-0.5 mr-1.5 h-2 w-2"
            )}
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx="4" cy="4" r="3" />
          </svg>
          {executing
            ? "executing"
            : hasError
            ? "completed with errors"
            : !pid
            ? "terminated"
            : "completed"}
        </span>
      </div>

      <div className="p-6 pt-0">
        <div className="bg-gray-100 p-2 rounded-md">
          <pre className="py-2 mx-2 text-sm overflow-scroll">
            {eData.length > 0 &&
              eData.map(({ rawData, isError }, index) => {
                return (
                  <p
                    className={clsx(isError && "text-red-800", "block")}
                    key={`${rawData}-${index}`}
                  >
                    {rawData}
                  </p>
                );
              })}
            {/* 
            {eData.length > 0 &&
              eData.map((data, index) => {
                return (
                  <p className="block" key={index}>
                    {data}
                  </p>
                );
              })} */}

            {/* TODO: implement me to save on performance*/}
            {/* <AutoSizer>
              {({ height, width }) => {
                console.log(height, width);
                return (
                  <List
                    width={420}
                    height={420}
                    rowCount={eData.length}
                    rowHeight={20}
                    rowRenderer={rowRenderer}
                  />
                );
              }}
            </AutoSizer> */}
          </pre>
          <div ref={dataEndRef} />
        </div>
      </div>
    </React.Suspense>
  );
});
