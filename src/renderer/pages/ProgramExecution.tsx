import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useMst } from "../models";
import { ipcRenderer } from "electron";
import Header from "../components/Header";

export default observer(() => {
  const params = useParams();
  const store = useMst();

  const [executing, setExecuting] = useState(true);
  const [eData, setEData] = useState<string[]>([]);

  const eDataRef = useRef(eData);

  const [init, setInit] = useState(true);

  const program = store.programs.items[parseInt(params.id, 10)];

  async function execute() {
    console.log("called execute");
    setInit(false);

    await ipcRenderer.send("execute_program", {
      command: program.runConfig?.command,
    });
  }

  // this will update the reference to the state so that the
  // useEffect hook handling the ipcRenderer listeners doesn't
  // get affected by closures
  useEffect(() => {
    eDataRef.current = eData;
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
  useEffect(() => {
    if (executing && eData.length === 0) {
      console.log("CREATING LISTENERS (should only hit once)");
      ipcRenderer.on("execution_stdout", (_, data: string) => {
        setEData([...eDataRef.current, data]);
      });

      ipcRenderer.once("execution_end", (_, data: string) => {
        console.log(data);
        setExecuting(false);
      });
    }

    return () => {
      ipcRenderer.removeAllListeners("execution_stdout");
      ipcRenderer.removeAllListeners("execution_end");
    };
  }, [executing]);

  return (
    <React.Suspense fallback={"...loading"}>
      <Header title={`${program.name} Execution`} />

      <div className=" mx-6 pt-6">
        <h3 className="text-xl font-bold text-gray-900 flex-1 pb-3">
          Command {executing ? "Running" : "Ran"}
        </h3>
        <pre className="w-full bg-gray-100 p-2 pb-4 rounded-md text-gray-800 text-sm overflow-x-scroll">
          {program.runConfig!.command}
        </pre>
      </div>

      <div className="flex justify-between items-center mx-6 pt-6">
        <h3 className="text-xl font-bold text-gray-900 flex-1 pb-2">
          Program Stdout
        </h3>
        {executing ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-100 text-red-800">
            executing
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">
            completed
          </span>
        )}
      </div>

      <div className="p-6 pt-0">
        <div className="bg-gray-100 p-2 rounded-md">
          <pre className="py-2 mx-2 text-sm overflow-x-scroll">
            {eData.length > 0 &&
              eData.map((data) => {
                return (
                  <p className="block" key={data}>
                    {data}
                  </p>
                );
              })}
          </pre>
        </div>
      </div>
    </React.Suspense>
  );
});
