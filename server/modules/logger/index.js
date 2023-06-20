const path = require('path')
const pino = require('pino')
const transport = pino.transport({
  target: 'pino/file',
  options: {
    destination: path.join(__dirname, '../../../', './tmp/output.log'),
    append: true
  }
})

const logger = pino(transport)

module.exports = logger
