const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
});

// Handle Python script execution
ipcMain.handle('run-python-code', async (event, { pythonCode, selectedPort }) => {
  return new Promise((resolve, reject) => {
    // Save the Python code to a temporary file
    const tempFilePath = path.join(app.getPath('temp'), 'temp_script.py');
    require('fs').writeFileSync(tempFilePath, pythonCode);

    // Run the Python script using the selected port
    const command = `python ${tempFilePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        resolve(stderr);
        return;
      }
      resolve(stdout);
    });
  });
});
