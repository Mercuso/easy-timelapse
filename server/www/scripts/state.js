_restoreSavedStateData = (state) => {
  state.deviceCodename = state.restoreDeviceCodename()
}

const initState = () => {
  const initialState = {
    imagePreview: document.getElementById('img'),
    lastSnapshotTimeElt: document.getElementById('snapshot-time'),
    player: document.getElementById('player'),
    canvas: document.getElementById('canvas'),
    header: document.getElementById('header'),
    wsConnectionStatusElt: document.getElementById('connection-status'),
    deviceCodenameElt: document.getElementById('device-codename'),
    cameraResolutionSelectElt: document.getElementById('camera-resolution'),
    togglePhotoOrientationElt: document.getElementById('toggle-photo-orientation'),

    _deviceCodename: undefined,
    userMediaConstraints: {
      audio: false,
      video: {
        width: { ideal: 1280 },
        facingMode: 'environment'
      },
    },
    _isWsConnected: false,

    _width: 0,
    _height: 0,
    get width () {  return this._width; },
    get height () { return this._height; },

    set width (width) {
      this._width = width;
      this.canvas.setAttribute("width", width);
      // this.player.setAttribute("width", width);
    },
    set height (height) {
      this._height = height;
      this.canvas.setAttribute("height", height);
      // this.player.setAttribute("height", height);
    },
    set lastSnapshotTime (date) {
      this.lastSnapshotTimeElt.innerText = date.toLocaleTimeString();
    },
    set isWsConnected (isWsConnected) {
      this._isWsConnected = isWsConnected;
      if (isWsConnected) {
        this.wsConnectionStatusElt.innerText = 'Connected';
        this.header.style.backgroundColor = '#e2fdd6'
      } else {
        this.wsConnectionStatusElt.innerText = 'Disconnected';
        this.header.style.backgroundColor = '#fdd6d6'
      }
    },
    set deviceCodename (deviceCodename) {
      this._deviceCodename = deviceCodename;
      this.deviceCodenameElt.innerText = deviceCodename;
    },
    get deviceCodename () {
      return this._deviceCodename
    },
    restoreDeviceCodename () {
      return localStorage.getItem('deviceCodename')
    },
    saveDeviceCodename (deviceCodename) {
      this.deviceCodename = deviceCodename
      localStorage.setItem('deviceCodename', deviceCodename)
    }
  }
  _restoreSavedStateData(initialState)
  return initialState
}
