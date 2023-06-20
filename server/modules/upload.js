const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream')
const config = require('./config');
const pump = util.promisify(pipeline)
const imagesUploadDir = `./tmp/images/${config.SESSION_ID}`

const init = (fastify) => {
  if (!fs.existsSync(imagesUploadDir)){
    fs.mkdirSync(imagesUploadDir);
  }
  async function upload (req, reply) {
    const data = await req.file()
    await pump(data.file, fs.createWriteStream(`${imagesUploadDir}/${Date.now()}-${data.filename}`))
    if (data.file.truncated) {
      // you may need to delete the part of the file that has been saved on disk
      // before the `limits.fileSize` has been reached
      reply.send(new fastify.multipartErrors.FilesLimitError());
      return
    }
    reply.send()
  }
  return upload
}

module.exports = init

