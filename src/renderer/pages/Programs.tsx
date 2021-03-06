import React, { useCallback, useState } from 'react';
import Header from '../components/Header';
// import ProgramSearch from "../components/ProgramSearch";
import { observer } from 'mobx-react-lite';
import { useMst } from '../models';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { Instance } from 'mobx-state-tree';
import { Programs } from '../models/Programs';
import clsx from 'clsx';
import HeaderPlaceholder from '../components/placeholders/Header';
import ListItemPlaceholder from '../components/placeholders/ListItem';

type ProgramProps = {
  id: string;
  name: string;
  description?: string;
  onDelete(): void;

  bg: string;
};

function ProgramItem({ id, name, description, onDelete, bg }: ProgramProps) {
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();
  return (
    <li
      id={id}
      onClick={() => {
        navigate(id);
      }}
      className={clsx(
        'p-6 flex hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-150 cursor-pointer border-b border-gray-200 dark:border-dark-800',
        bg
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex-1">
        <div className="font-bold text-gray-900 dark:text-dark-200">{name}</div>
        <div className="text-gray-600 dark:text-dark-300">{description}</div>
      </div>
      <div className="flex items-center">
        {hovering && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="trash w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <svg
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 ml-6 dark:text-dark-300"
        >
          <path d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </li>
  );
}

type DroppableProps = {
  programs: Instance<typeof Programs>;
};

const DroppableList = observer(
  ({
    provided,
    programs,
  }: { provided: DroppableProvided } & DroppableProps) => (
    <div className="divide-y overflow-y-scroll">
      <ul {...provided.droppableProps} ref={provided.innerRef}>
        {programs.items.map((program, index) => (
          <React.Fragment key={index}>
            <Draggable draggableId={String(index)} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <ProgramItem
                    key={index}
                    id={String(index)}
                    name={program.name}
                    bg={
                      index !== 0 && (index + 1) % 2 === 0
                        ? 'bg-gray-50 dark:bg-dark-600'
                        : 'bg-white dark:bg-dark-500'
                    }
                    onDelete={() => programs.deleteProgram(program)}
                  />
                </div>
              )}
            </Draggable>
          </React.Fragment>
        ))}
        {provided.placeholder}
      </ul>
    </div>
  )
);

// trying out some fallbacks, not really sure if needed though
function ProgramsFallback() {
  return (
    <React.Fragment>
      <HeaderPlaceholder />
      {/* <Base /> */}
      <ListItemPlaceholder width="24" />
      <ListItemPlaceholder width="36" />
      <ListItemPlaceholder width="16" />
    </React.Fragment>
  );
}

export default observer(() => {
  const store = useMst();

  const createProgram = useCallback(() => {
    store.programs.createProgram();
  }, [store]);

  return (
    <React.Suspense fallback={ProgramsFallback}>
      <Header
        title="Programs"
        to="/settings"
        replaceNavIcon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
        action={
          <button
            onClick={createProgram}
            className="rounded-full border-2 border-indigo-600 bg-white dark:bg-dark-700 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-600 dark:text-dark-200 hover:text-white dark:hover:text-white transition-colors focus:outline-none duration-300 flex text-md px-2 py-1 items-center justify-center font-semibold"
            title="Create Program"
          >
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        }
      />
      {store.programs.items.length > 0 ? (
        <React.Fragment>
          {/* <ProgramSearch /> */}
          <DragDropContext
            onDragEnd={(result) => {
              if (result.destination) {
                store.programs.reorderPrograms(
                  result.source.index,
                  result.destination.index
                );
              }
            }}
          >
            <Droppable droppableId="actions" direction="vertical">
              {(provided) => (
                <DroppableList provided={provided} programs={store.programs} />
              )}
            </Droppable>
          </DragDropContext>
        </React.Fragment>
      ) : (
        <div className="flex justify-center items-center h-64">
          <h3>Declare a new program to get started</h3>
        </div>
      )}
    </React.Suspense>
  );
});
