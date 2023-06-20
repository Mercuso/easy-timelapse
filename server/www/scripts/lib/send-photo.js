/**
 *
 * @param {Blob} blob - image blob in PNG format
 * @param {string} imageName
 * @returns {Promise<undefined>}
 */
async function sendPhoto (blob, imageName='image') {
  const formData = new FormData()
  formData.append('image', blob, imageName+'.png')
  await fetch('/image', {
    method: 'POST',
    body: formData
  });
}
