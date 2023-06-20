const os = require('os')

function getLocalNetworkIP () {
  const networkInterfaces = os.networkInterfaces()
  const localNetwork = Object.values(networkInterfaces).flat().find(networkInterface => (
    networkInterface.family === 'IPv4' && networkInterface.internal === false && networkInterface.address.startsWith('192.168.')
  ))
  if (!localNetwork) {
    return null
  }
  return localNetwork.address
}

module.exports = { getLocalNetworkIP }
