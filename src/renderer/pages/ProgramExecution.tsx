import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useMst } from "../models";
import { ipcRenderer, ipcMain } from "electron";
import Header from "../components/Header";

export default observer(() => {
  const params = useParams();
  const store = useMst();

  const [executing, setExecuting] = useState(true);
  const [eData, setEData] = useState<string[]>([]);
  const [init, setInit] = useState(true);

  const program = store.programs.items[parseInt(params.id, 10)];

  ipcRenderer.on("execution_stdout", (event, data: string) => {
    // console.log(data);
    setEData([...eData, data]);
  });

  ipcRenderer.on("execution_end", (event, data: string) => {
    console.log("end called");
    setExecuting(false);
  });

  async function execute() {
    console.log("called execute");
    setInit(false);

    // execute
    await ipcRenderer.send("execute_program", {
      command: program.runConfig?.command,
    });
  }

  useEffect(() => {
    if (init) {
      setTimeout(() => {
        execute();
      }, 1000);
    }
  });

  return (
    <div>
      <Header title={`${program.name} Execution`} />

      <div className=" mx-6 pt-6">
        <h3 className="text-xl font-bold text-gray-900 flex-1 pb-2">
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

      <div className="p-6">
        <div className="bg-gray-100 p-2 rounded-md">
          <pre className="py-2 mx-2 text-sm overflow-x-scroll">
            {eData.length > 0 &&
              eData.map((data) => {
                return <p className="block">{data}</p>;
              })}
          </pre>
        </div>
      </div>
    </div>
  );
});
