import { ipcMain } from 'electron';
import path from 'path';
import { mb } from '.';
import spawn from 'child_process';

let eData: { rawData: string; isError: boolean }[] = [];

ipcMain.on('notify', () => {
  if (!mb.window?.isVisible()) {
    mb.tray.setImage(path.resolve(__dirname, 'assets', 'flmnhActive.png'));
  }
});

// pass in path to file, file type, args for spawn, etc
ipcMain.on('execute_program', (_, data: any) => {
  console.log(data);
  const { prefix, location, args, defaultArgs } = data;

  if (data) {
    const options = args;

    let child;
    if (prefix && prefix !== '') {
      child = spawn.spawn(prefix, [defaultArgs, location, ...options]);
    } else {
      child = spawn.spawn(location, [...options]);
    }

    mb?.window?.webContents.send('child_pid', child.pid);

    child.stdout.setEncoding('utf8');

    child.stdout.on('data', (data) => {
      eData.push({ rawData: data.toString(), isError: false });
      mb?.window?.webContents.send('execution_stdout', eData);
    });

    child.stdout.once('end', () => {
      console.log('child stdout ended');
    });

    child.stderr.on('data', (data) => {
      eData.push({ rawData: data.toString(), isError: true });
      mb?.window?.webContents.send('execution_stderr', eData);
    });

    // TODO: figure out when this would hit
    child.on('error', (data) => {
      console.log('child error hit: ' + data);
    });

    child.once('close', () => {
      console.log('child process closed');
      eData = [];
      mb?.window?.webContents.send('execution_end', 'Process completed');
    });
  }
});

ipcMain.on('kill_execution', (_, data: any) => {
  const { pid } = data;

  try {
    process.kill(pid);

    mb?.window?.webContents.send('kill_execution_response', {
      killed: true,
      message: `Process ${pid} terminated`,
    });

    eData = [];
  } catch (error) {
    console.log(error);

    // assume pid does not exist until more testing
    mb?.window?.webContents.send('kill_execution_response', {
      killed: false,
      message: `Could not kill process ${pid}, unable to detect pid in system`,
    });

    eData = [];
  }
});
