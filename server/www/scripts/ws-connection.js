function initWsConnection(state) {
  const wsConnection = new WebSocket(`wss://${window.location.host}/events`)
  wsConnection.onopen = () => {
    state.isWsConnected = true
  }
  wsConnection.onmessage = (message) => {
    const data = JSON.parse(message.data)
    if (data.message === 'layerDone') {
      takePhoto(canvas, player).then(blob => {
        return sendPhoto(blob, state.deviceCodename).then(() => {
          state.lastSnapshotTime = new Date()
        })
      })
    }
  }
  wsConnection.onclose = () => {
    state.isWsConnected = false
    setTimeout(() => {
      initWsConnection(state)
    }, 5000)
  }
  wsConnection.onerror = (error) => {
    state.isWsConnected = false
    wsConnection.close()
  }
}
