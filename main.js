const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Funktion, um den Speicherort zu überprüfen und anzupassen
function setupUserDataPath() {
  // Standard-Pfad ermitteln
  const defaultPath = app.getPath('userData');
  console.log("Standard User Data Pfad:", defaultPath);

  // Benutzerdefinierten Pfad festlegen (optional)
  const customPath = path.join('C:', 'Users', 'Embers', 'helpdesk_data');
  if (!fs.existsSync(customPath)) {
    fs.mkdirSync(customPath, { recursive: true }); // Ordner erstellen, falls nicht vorhanden
    console.log("Benutzerdefinierter Pfad erstellt:", customPath);
  }

  // Setze den neuen Speicherpfad
  app.setPath('userData', customPath);
  console.log("Benutzerdefinierter User Data Pfad gesetzt:", app.getPath('userData'));

  // Sicherstellen, dass das Datenverzeichnis existiert
  if (!fs.existsSync(app.getPath('userData'))) {
    console.error("Das User-Datenverzeichnis existiert nicht!");
  }
}

function createWindow() {
  // Speicherpfad konfigurieren
  setupUserDataPath();

  // Browserfenster erstellen
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'Embers-Helpdesk', // Fenstertitel anpassen
    icon: path.join(__dirname, 'assets', 'icon.png'), // Pfad zu deinem Symbol
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Sichere Methode, um Node.js-Funktionen zu integrieren
      contextIsolation: true, // Sichere Isolation des Kontextes
      enableRemoteModule: false, // Remote Module deaktivieren, falls nicht benötigt
      nodeIntegration: false, // Vermeiden von Node.js-Integration aus Sicherheitsgründen
    },
  });

  // Webanwendung laden
  const appUrl = 'https://embers-helpdesk.vercel.app//';
  mainWindow.loadURL(appUrl).catch((error) => {
    console.error(`Fehler beim Laden der URL: ${appUrl}`, error);
  });

  // Wenn das Fenster geschlossen wird, setze die Variable zurück
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Loggen, dass die App gestartet wurde
  console.log('Embers-Helpdesk gestartet!');
}

// App bereitstellen
app.on('ready', createWindow);

// Fenster schließen
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Fenster neu erstellen (für macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Debugging: Wichtige Pfade ausgeben
console.log("App Path: ", app.getAppPath());
console.log("App Data Path: ", app.getPath('appData'));
console.log("Home Path: ", app.getPath('home'));
console.log("Temp Path: ", app.getPath('temp'));
