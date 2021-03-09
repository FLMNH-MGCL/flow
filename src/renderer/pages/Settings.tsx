import { observer } from 'mobx-react-lite';
import React from 'react';
import Header from '../components/Header';
import { Radio } from '@flmnh-mgcl/ui';
import { useMst } from '../models';

export default observer(() => {
  const store = useMst();

  const { theme, changeTheme } = store;

  // function toggleTheme() {}

  return (
    <React.Fragment>
      <Header to="/programs" title="Settings" />
      <div className="flex flex-row space-x-4 items-center">
        <Radio
          label="Dark Theme"
          onChange={() => changeTheme()}
          checked={theme === 'dark'}
        />
      </div>
    </React.Fragment>
  );
});
