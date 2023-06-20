const EventEmitter = require('events')
const { SerialPort } = require('serialport')
const logger = require('../../logger')
const config = require('../../config')
const DEVICE_PATH = `/dev/${config.DEVICE_NAME}`
const { TRIGGER_OUTPUT } = config
const eventEmitter = new EventEmitter()
const serialPortLogger = logger.child({ module: 'serial-port' })

const port = new SerialPort({
  path: DEVICE_PATH,
  baudRate: 19200,
})

port.on('data', function (data) {
  const line = data.toString().trim()
  serialPortLogger.info({event: 'data', data: line}, 'serial port data received')
  if (line.includes(TRIGGER_OUTPUT)) {
    eventEmitter.emit('layerDone')
  }
})
port.on('error', function (error) {
  serialPortLogger.error({event: 'error', errorMessage: error.message}, 'serial port error')
  throw error
})
port.on('close', function () {
  serialPortLogger.info({event: 'close'}, 'serial port closed')
})

module.exports = eventEmitter
