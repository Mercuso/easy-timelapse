const fs = require('fs')
const path = require('path')
const config = require('./modules/config')
const fastify = require('fastify')({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
  https: {
    key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem'))
  }
})
const trigger = require('./modules/trigger')
const {getLocalNetworkIP} = require("./modules/local-network");
const webstocketController = require('./modules/websocket')(trigger)
const uploadController = require('./modules/upload')(fastify)

fastify.register(require('@fastify/multipart'), {
  limits: {
    fileSize: config.IMAGE_SIZE_LIMIT
  }
})
fastify.register(require('@fastify/websocket'))
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'www')
})
fastify.register(webstocketController)
fastify.post('/image', uploadController)

fastify.listen(
  { port: config.HTTP_SERVER_PORT, host: config.HTTP_SERVER_HOST },
  (err, address) => {
    if (err) throw err
    const localNetworkIP = getLocalNetworkIP()
    if (localNetworkIP) {
      fastify.log.info(`Visit https://${localNetworkIP}:${config.HTTP_SERVER_PORT} on device that is connected to the same network as this server in case you want to use its camera`)
    } else {
      fastify.log.warn('could not determine local network IP, looks like this server is not connected to any network')
    }
  }
)
