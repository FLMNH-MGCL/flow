import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import React from "react";
import { Program } from "../../models/Programs";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { Argument } from "../../models/Argument";
import ArgumentComponent from "./Argument";

type DroppableProps = {
  args: Instance<typeof Argument>[];
};

const DroppableList = observer(
  ({ provided, args }: { provided: DroppableProvided } & DroppableProps) => (
    <div
      className="flex flex-col space-y-6"
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      {args.map((argument: Instance<typeof Argument>, index: number) => (
        <React.Fragment key={index}>
          <Draggable draggableId={String(index)} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <div
                  className="bg-gray-100 p-2 rounded-md"
                  key={`${argument.name}-${index}`}
                >
                  <div className="py-2 mx-2 flex flex-col space-y-4">
                    {/* @ts-ignore idk why its getting this type wrong*/}
                    <ArgumentComponent
                      argument={argument}
                      key={argument.name}
                    />
                  </div>
                </div>
              </div>
            )}
          </Draggable>
        </React.Fragment>
      ))}
      {provided.placeholder}
    </div>
  )
);

type ArugmentsProps = {
  program: Instance<typeof Program>;
};

export default observer(({ program }: ArugmentsProps) => {
  return (
    <React.Fragment>
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
        <React.Fragment>
          {/* <ProgramSearch /> */}
          <DragDropContext
            onDragEnd={(result) => {
              if (result.destination) {
                program.reorderArguments(
                  result.source.index,
                  result.destination.index
                );
              }
            }}
          >
            <Droppable droppableId="programs">
              {(provided) => (
                // @ts-ignore - idky this isn't typing correctly
                <DroppableList provided={provided} args={program.arguments} />
              )}
            </Droppable>
          </DragDropContext>
        </React.Fragment>
      )}

      {!program.arguments ||
        (program.arguments.length < 1 && (
          <div className="bg-gray-100 p-2 rounded-md">
            No arguments configured
          </div>
        ))}
    </React.Fragment>
  );
});
