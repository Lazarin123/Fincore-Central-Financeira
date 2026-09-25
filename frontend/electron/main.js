const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({ width: 1280, height: 800, minWidth: 900, minHeight: 600, autoHideMenuBar: true, webPreferences: { contextIsolation: true } });
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  process.env.ELECTRON_DEV ? win.loadURL('http://localhost:5173') : win.loadFile(path.join(__dirname, '../dist/index.html'));
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
