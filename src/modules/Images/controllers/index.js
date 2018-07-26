const validUrl = require('valid-url');
const validateMime = require('image-type');
const http = require('https');
const jimp = require('jimp');
const hashid = require('../../../utils/hashid');
const { sendJSONResponse } = require('../../../helpers');
const { imageTypes } = require('../../../utils/validMimeTypes');


module.exports.validateUrl = (req, res, next) => {
  const { imageUrl } = req.body;
  if (!validUrl.isWebUri(imageUrl)) {
    return sendJSONResponse(res, 400, null, req.method, 'Url is not a valid web url');
  }
  return next();
};

module.exports.checkUrlExtenstion = (req, res, next) => {
  const { imageUrl } = req.body;
  const validImageTypes = Object.keys(imageTypes);
  const result = validImageTypes.map(extention => imageUrl.toLowerCase().endsWith(extention));
  if (result.includes(true)) {
    return next();
  }
  return sendJSONResponse(res, 400, null, req.method, 'Url does not point to a valid image resource');
};

module.exports.getUrlMimeType = (req, res, next) => {
  const { imageUrl } = req.body;
  http.get(imageUrl, (response) => {
    response.once('data', (chunk) => {
      response.destroy();
      const result = validateMime(chunk);
      req.result = result;
      return next();
    });
  });
};

module.exports.validateUrlMimeType = (req, res, next) => {
  const validImageTypes = Object.values(imageTypes);
  if (!validImageTypes.includes(req.result.mime)) {
    return sendJSONResponse(res, 400, null, req.method, 'Url does not point to a valid image resource');
  }
  return next();
};

module.exports.downloadImage = async (req, res) => {
  const { imageUrl } = req.body;
  const originalImage = await jimp.read(imageUrl);
  const thumbNailName = hashid.generate();
  await originalImage.resize(50, 50).quality(60).write(`src/public/${thumbNailName}.${req.result.ext}`);
  const link = `${req.protocol}://${req.headers.host}/${thumbNailName}.${req.result.ext}`;
  sendJSONResponse(res, 200, { thumbNailUrl: link }, req.method, 'Image thumbnail generated');
};
