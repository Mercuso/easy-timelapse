const EventEmitter = require('events')
const logger = require('../../logger')
const processInputLogger = logger.child({ module: 'process-input' })

function stdinLineByLine() {
  const stdin = new EventEmitter()
  let buff = ''

  process.stdin
    .on('data', data => {
      buff += data
      const lines = buff.split(/\r\n|\n/)
      buff = lines.pop()
      lines.forEach(line => {
        processInputLogger.info({data: line, event: 'data' }, 'process input data received')
        stdin.emit('line', line)
        if (line === 'photo') {
          stdin.emit('layerDone')
        }
      })
    })
    .on('end', () => {
      if (buff.length > 0) stdin.emit('line', buff)
    })

  return stdin
}

const stdin = stdinLineByLine()
module.exports = stdin
