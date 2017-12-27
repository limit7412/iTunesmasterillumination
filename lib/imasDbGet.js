// APIをgetで叩くやつ
const request = require('request');
const getAPI = (URL, qs, reject, callback) => {
  console.log(qs);
  request.get({
    uri: URL,
    headers: {'Content-type': 'application/json'},
    qs: qs,
    json: true
  }, (err, req, data) => {
    if (err) {
      reject(err);
    }
    callback(data);
  });
};
module.exports = getAPI;
