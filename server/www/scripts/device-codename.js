_requestDeviceCodename = function (state) {
  const deviceCodename = window.prompt('Enter device codename', state.deviceCodename || 'unknown')
  if (deviceCodename) {
    state.saveDeviceCodename(deviceCodename)
  }
}

initDeviceCodename = function (state) {
  if(!state.deviceCodename) {
    _requestDeviceCodename(state)
  }
  state.deviceCodenameElt.addEventListener('click', () => {
    _requestDeviceCodename(state)
  })
}
