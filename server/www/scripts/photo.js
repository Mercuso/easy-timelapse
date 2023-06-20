function initTogglePhotoOrientation (state) {
  state.togglePhotoOrientationElt.addEventListener('click', () => {
    const oldWidth = state.width
    const oldHeight = state.height
    state.width = oldHeight
    state.height = oldWidth
  })
}

function initResolutionSelector (state) {
  state.cameraResolutionSelectElt.addEventListener('change', (event) => {
    const [width, height] = event.target.value.split(',').map(v => parseInt(v))
    state.userMediaConstraints.video.width = { ideal: width }
    void initPhotoShootingSystem(state)
  })
}

async function initPhotoShootingSystem (state) {
  const {player} = state
  const stream = await navigator.mediaDevices.getUserMedia(state.userMediaConstraints)
  let settings = stream.getVideoTracks()[0].getSettings()
  state.width = settings.width
  state.height = settings.height

  player.width = settings.width
  player.height = settings.height
  player.srcObject = stream
}
