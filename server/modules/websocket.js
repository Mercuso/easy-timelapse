const config = require('./config');
const logger = require('./logger');
const wsLogger = logger.child({ module: 'websocket' });

const init = (trigger) => async (fastify) => {
  fastify.get(
    '/events',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      trigger.on('layerDone', () => {
        connection.socket.send(JSON.stringify({
          sender: 'server',
          message: 'layerDone',
          sessionId: config.SESSION_ID
        }));
      })
    }
  )
}

module.exports = init;
