import React, { useEffect } from 'react';
import Header from '../components/Header';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useFilePicker } from 'react-sage';
import { useMst } from '../models';
import FileConfiguration from '../components/program/FileConfiguration';
import RunConfiguration from '../components/program/RunConfiguration';
import Arugments from '../components/argument/Arugments';

export default observer(() => {
  const params = useParams();
  const navigate = useNavigate();
  const store = useMst();

  const { files } = useFilePicker({
    maxFileSize: 1,
  });

  const program = store.programs.items[parseInt(params.id, 10)];

  useEffect(() => {
    if (files && files.length === 1) {
      program.changeLocation(files[0].path);
    }
  }, [files]);

  return (
    <React.Fragment>
      <Header
        title={program.name}
        editableTitle
        onEdit={program.changeName}
        action={
          <button
            onClick={() => navigate('execute')}
            className="rounded-full border-2 dark:bg-dark-700 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-600 dark:text-dark-200 hover:text-white dark:hover:text-white  border-indigo-600 bg-white transition-colors focus:outline-none duration-300 flex text-md px-2 py-1 items-center justify-center font-semibold"
            title="Execute Program"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="play w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Execute
          </button>
        }
      />
      <div className="p-6">
        <FileConfiguration program={program} />

        <Arugments program={program} />

        <RunConfiguration program={program} />
      </div>
    </React.Fragment>
  );
});
