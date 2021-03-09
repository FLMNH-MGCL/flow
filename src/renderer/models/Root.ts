import { types } from 'mobx-state-tree';
import { Programs } from './Programs';

export const RootModel = types
  .model({
    programs: Programs,
    theme: types.optional(types.string, 'light'),
  })
  .actions((self) => ({
    changeTheme(newTheme?: string) {
      const theme = newTheme ?? self.theme === 'dark' ? 'light' : 'dark';

      self.theme = theme;

      // toggle the class
      // I am not using local storage in this app since everything
      // is persisted using electron-store
      if (theme === 'light') {
        document.querySelector('html')?.classList.remove('dark');
      } else {
        document.querySelector('html')?.classList.add('dark');
      }
    },
  }));
