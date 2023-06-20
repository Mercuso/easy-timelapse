let trigger = null;
const signalSource = process.env.SIGNAL_SOURCE || 'serial-port';
switch (signalSource) {
  case 'serial-port':
    trigger = require('./sources/serial-port');
    break;
  case 'process-input':
    trigger = require('./sources/process-input');
    break;
  default:
    throw new Error(`Invalid signal source: "${process.env.SIGNAL_SOURCE}"`);
}

module.exports = trigger
