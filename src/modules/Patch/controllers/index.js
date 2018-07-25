const patch = require('jsonpatch');
const { sendJSONResponse } = require('../../../helpers');

module.exports.performPatch = (req, res) => {
  const { jsonbody, jsonpatch } = req.body;
  try {
    const result = patch.apply_patch(jsonbody, jsonpatch);
    sendJSONResponse(res, 200, result, req.method, 'Patch applied successfully!');
  } catch (error) {
    return sendJSONResponse(res, 400, null, req.method, error.message);
  }
};
