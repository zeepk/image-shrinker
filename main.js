const {
	app,
	BrowserWindow,
	Menu,
	globalShortcut,
	ipcMain,
} = require('electron')

process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

let mainWindow
let aboutWindow

function createMainWindow() {
	mainWindow = new BrowserWindow({
		//object of options
		title: 'Image Shrinker',
		width: isDev ? 1200 : 500,
		height: 600,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDev,
		backgroundColor: 'white',
		webPreferences: {
			nodeIntegration: true,
		},
	})

	//dev tools show automatically in developer mode

	if (isDev) {
		mainWindow.webContents.openDevTools()
	}

	//can load normal URL here too
	// mainWindow.loadURL(`file://${__dirname}/app/index.html`)
	mainWindow.loadFile('./app/index.html')
}
function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		//object of options
		title: 'Image Shrinker',
		width: 300,
		height: 300,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: false,
		backgroundColor: 'white',
	})

	//can load normal URL here too
	// mainWindow.loadURL(`file://${__dirname}/app/index.html`)
	aboutWindow.loadFile('./app/about.html')
}

app.on('ready', () => {
	createMainWindow()

	const mainMenu = Menu.buildFromTemplate(menu)
	Menu.setApplicationMenu(mainMenu)

	globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
	globalShortcut.register('CmdOrCtrl+Shift+I', () =>
		mainWindow.toggleDevTools()
	)

	mainWindow.on('closed', () => (mainWindow = null))
})

const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		role: 'fileMenu',
	},
	...(!isMac
		? [
				{
					label: 'Help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	...(isDev
		? [
				{
					label: 'Developer',
					submenu: [
						{
							role: 'reload',
						},
						{
							role: 'forcereload',
						},
						{
							type: 'separator',
						},
						{
							role: 'toggledevtools',
						},
					],
				},
		  ]
		: []),
]

ipcMain.on('image:minimize', (e, options) => {
	console.log(options)
})

app.on('window-all-closed', () => {
	if (!isMac) {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow()
	}
})

app.allowRendererProcessReuse = true
