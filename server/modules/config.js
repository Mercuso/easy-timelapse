const config = {
  SESSION_ID: process.env.SESSION_ID,
  DEVICE_NAME: process.env.DEVICE_NAME,
  TRIGGER_OUTPUT: process.env.TRIGGER_OUTPUT,
  HTTP_SERVER_PORT: parseInt(process.env.HTTP_SERVER_PORT) || 8080,
  HTTP_SERVER_HOST: process.env.HTTP_SERVER_HOST || '0.0.0.0',
  IMAGE_SIZE_LIMIT: parseInt(process.env.IMAGE_SIZE_LIMIT) || 1024 * 1024 * 10, // 10MB
  SIGNAL_SOURCE: process.env.SIGNAL_SOURCE,
}

Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable ${key}`)
  }
})

module.exports = config
