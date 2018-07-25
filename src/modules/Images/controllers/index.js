const validUrl = require('valid-url');
const validateMime = require('image-type');
const http = require('https');
const path = require('path');
const imageDownloader = require('image-downloader');
const sharp = require('sharp');
const { promisify } = require('util');
const rimraf = require('rimraf');
const { sendJSONResponse } = require('../../../helpers');
const { imageTypes } = require('../../../utils/validMimeTypes');

const unlinkPromise = promisify(rimraf);


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
  const options = {
    url: imageUrl,
    dest: path.join(`src/public/${Date.now()}.${req.result.ext}`),
  };
  const result = await imageDownloader.image(options);
  const tempLink = `${req.protocol}://${req.headers.host}/${result.filename.split('\\')[2]}`;
  await sharp(`src/public/${tempLink.split('/')[3]}`)
    .resize(50)
    .toFile(`src/public/small-${tempLink.split('/')[3]}`);
  const link = `${req.protocol}://${req.headers.host}/small-${tempLink.split('/')[3]}`;
  const filePath = path.join(`src/public/${tempLink.split('/')[3]}`);
  try {
    await unlinkPromise(filePath);
  } catch (error) {
    await unlinkPromise(filePath);
  }
  sendJSONResponse(res, 200, link, req.method, 'DOWNLOADED IMAGE URL');
};
