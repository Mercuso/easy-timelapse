/**
 *
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLVideoElement} videoElt
 * @returns {Promise<Blob>}
 */
function takePhoto (canvas, videoElt) {
  return new Promise((resolve) => {
    const width = canvas.width
    const height = canvas.height
    const context = canvas.getContext('2d')
    context.drawImage(videoElt, 0, 0, width, height)
    canvas.toBlob(function(blob) { // get content as PNG blob
      return resolve(blob)
    })
  })
}
