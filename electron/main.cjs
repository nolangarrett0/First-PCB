const { app, BrowserWindow, dialog, net, protocol, session, shell } = require('electron')
const { existsSync } = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

const appOrigin = 'app://circuitlab'
const distDirectory = path.resolve(__dirname, '..', 'dist')
// Keep existing desktop progress when upgrading from the previous app name.
const previousUserData = path.join(app.getPath('appData'), 'CircuitLab')
if (existsSync(previousUserData)) app.setPath('userData', previousUserData)
const externalHosts = new Set([
  'docs.kicad.org',
  'openstax.org',
  'www.kingbrightusa.com',
  'data.energizer.com',
  'energizer.com',
  'learn.adafruit.com',
  'jlcpcb.com',
  'www.fluke.com',
  'www.hse.gov.uk',
  'ehs.stanford.edu',
  'creativecommons.org',
  'gitlab.com',
  'learn.sparkfun.com',
  'blog.sparkfuneducation.com',
  'www.onsemi.com',
])

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }])

function isAllowedExternal(url) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && externalHosts.has(parsed.hostname) } catch { return false }
}

function openExternal(url) {
  if (isAllowedExternal(url)) void shell.openExternal(url)
}

function resolveBundlePath(url) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'app:' || parsed.host !== 'circuitlab') return null
    const requested = decodeURIComponent(parsed.pathname === '/' ? '/index.html' : parsed.pathname)
    const target = path.resolve(distDirectory, `.${requested}`)
    const relative = path.relative(distDirectory, target)
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return null
    return target
  } catch { return null }
}

async function serveBundle(request) {
  const file = resolveBundlePath(request.url)
  if (!file) return new Response('Not found', { status: 404 })
  const response = await net.fetch(pathToFileURL(file).toString())
  if (!file.endsWith('.html')) return response
  const headers = new Headers(response.headers)
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'")
  return new Response(response.body, { status: response.status, headers })
}

function createWindow() {
  const window = new BrowserWindow({
    title: 'First PCB',
    show: process.env.CIRCUITLAB_TEST !== '1',
    width: 1250,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    backgroundColor: '#f4f9f4',
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true },
  })
  window.webContents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: 'deny' } })
  window.webContents.on('will-prevent-unload', event => {
    const answer=dialog.showMessageBoxSync(window,{type:'question',buttons:['Keep learning','Leave app'],defaultId:0,cancelId:0,title:'Leave this activity?',message:'Your activity is in progress.',detail:'Saved work can be resumed. If the app says “session only”, stay and download a backup before closing.'})
    // Electron prevents unload by default. preventDefault explicitly permits it.
    if(answer===1)event.preventDefault()
  })
  window.webContents.on('will-navigate', (event, url) => { if (url !== `${appOrigin}/index.html`) { event.preventDefault(); openExternal(url) } })
  void window.loadURL(`${appOrigin}/index.html`)
  return window
}

if (!app.requestSingleInstanceLock()) app.quit()
else {
  app.on('second-instance', () => { const window = BrowserWindow.getAllWindows()[0]; if (window) { if (window.isMinimized()) window.restore(); window.focus() } })
  app.whenReady().then(() => {
    protocol.handle('app', serveBundle)
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false))
    app.on('web-contents-created', (_event, contents) => { contents.on('will-attach-webview', event => event.preventDefault()) })
    createWindow()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
  })
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
}
